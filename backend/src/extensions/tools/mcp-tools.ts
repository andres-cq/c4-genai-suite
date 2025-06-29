import { DynamicStructuredToolInput } from '@langchain/core/dist/tools';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { CallToolRequest, CallToolResultSchema, ListToolsResultSchema, McpError } from '@modelcontextprotocol/sdk/types.js';
import { JsonSchemaObject, jsonSchemaToZod } from '@n8n/json-schema-to-zod';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { diff } from 'json-diff-ts';
import { renderString } from 'nunjucks';
import { z } from 'zod';
import { ChatContext, ChatMiddleware, ChatNextDelegate, GetContext } from 'src/domain/chat';
import {
  Extension,
  ExtensionArgument,
  ExtensionEntity,
  ExtensionObjectArgument,
  ExtensionSpec,
  ExtensionStringArgument,
} from 'src/domain/extensions';
import { User } from 'src/domain/users';
import { I18nService } from '../../localization/i18n.service';
import { transformMCPToolResponse } from './mcp-types/transformer';

type MCPListToolsResultSchema = z.infer<typeof ListToolsResultSchema>;

enum Transport {
  SSE = 'sse',
  STREAMABLE_HTTP = 'streamableHttp',
}

type ConfigurationAttributeSource = 'llm' | 'user' | 'admin';

type ConfigurationAttributes = Record<
  // one record per value
  string,
  {
    source: ConfigurationAttributeSource;
    value: any;
  }
>;

interface Configuration {
  serverName: string;
  endpoint: string;
  transport: Transport;
  schema?: Record<
    // one record per method
    string,
    {
      enabled: boolean;
      description?: string;
      attributes?: ConfigurationAttributes;
    }
  >;
}

interface ExtensionState extends Pick<Configuration, 'endpoint'> {
  tools?: MCPListToolsResultSchema['tools'];
  changed?: boolean;
}

export class NamedDynamicStructuredTool extends DynamicStructuredTool {
  displayName: string;

  constructor({ displayName, ...toolInput }: DynamicStructuredToolInput & { displayName: string }) {
    super(toolInput);
    this.displayName = displayName;
  }
}

// zod has no password type since it is handled as string so we introduce a whitelist to map password fields
const passwordKeys = ['apiKey', 'api-key', 'password', 'credentials'];

function toExtensionArgument(
  schema: JsonSchemaObject & { title?: string; description?: string },
  attributeKey?: string,
): ExtensionArgument | undefined {
  if (schema.type === 'number' || schema.type === 'integer') {
    return {
      type: 'number',
      title: '',
      format: schema.format as 'input',
      minimum: schema.minimum,
      maximum: schema.maximum,
      required: false,
    };
  } else if (schema.type === 'string') {
    const format = attributeKey && passwordKeys.includes(attributeKey) ? 'password' : (schema.format as 'input');

    return {
      type: 'string',
      title: '',
      enum: schema.enum as string[],
      format,
      required: false,
    };
  } else if (schema.type === 'boolean') {
    return {
      type: 'boolean',
      title: '',
      required: false,
    };
  } else if (schema.type === 'object') {
    return {
      type: 'object',
      title: '',
      required: false,
      properties: Object.entries(schema.properties ?? {}).reduce(
        (prev, [key, type]) => {
          const propertyType = toExtensionArgument(type as JsonSchemaObject, key);
          if (propertyType) {
            prev[key] = propertyType;
          }
          return prev;
        },
        {} as Record<string, ExtensionArgument>,
      ),
    };
  } else if (schema.type === 'array') {
    const arrayItemType = toExtensionArgument(schema.items as JsonSchemaObject);
    if (!arrayItemType || (arrayItemType.type !== 'string' && arrayItemType.type !== 'number')) {
      return;
    }

    return {
      type: 'array',
      title: '',
      required: false,
      items: arrayItemType,
      default: schema.default as any[],
    };
  }
}

function toArguments(i18n: I18nService, tools: MCPListToolsResultSchema['tools']) {
  return tools.reduce(
    (toolObject, tool) => {
      const methodSchema = tool.inputSchema as JsonSchemaObject;
      toolObject.properties[tool.name] = Object.entries(methodSchema.properties ?? {}).reduce(
        (methodObject, [name, type]) => {
          const methodType = type as JsonSchemaObject;
          const innerMethodType = toExtensionArgument(methodType, name);
          if (!innerMethodType) {
            return methodObject;
          }

          methodObject.properties.attributes.properties[name] = {
            type: 'object',
            title: name,
            description: methodType.description,
            properties: {
              source: {
                type: 'string',
                title: i18n.t('texts.extensions.mcpTools.source'),
                description: i18n.t('texts.extensions.mcpTools.sourceHint'),
                required: true,
                enum: ['llm', 'user', 'admin'],
                default: 'llm',
              },
              value: {
                ...innerMethodType,
                title: i18n.t('texts.extensions.mcpTools.value'),
                description: i18n.t('texts.extensions.mcpTools.valueHint'),
              },
            },
          };
          return methodObject;
        },
        {
          type: 'object',
          title: tool.name,
          properties: {
            enabled: {
              type: 'boolean',
              title: i18n.t('texts.extensions.mcpTools.enabled'),
              default: false,
              description: i18n.t('texts.extensions.mcpTools.enabledHint'),
            },
            description: {
              type: 'string',
              format: 'textarea',
              title: i18n.t('texts.extensions.mcpTools.toolDescription'),
              required: (tool.description?.length ?? 0) > 1024,
              default: tool.description,
              description: i18n.t('texts.extensions.mcpTools.toolDescriptionHint'),
            },
            attributes: { type: 'object', title: '', properties: {} as { [name: string]: ExtensionArgument } },
          },
        } satisfies ExtensionObjectArgument,
      );
      return toolObject;
    },
    { type: 'object', title: `Schema`, properties: {}, required: true } as ExtensionObjectArgument,
  );
}

function toUserArguments(values: Configuration, schemaArgument: ExtensionObjectArgument) {
  return Object.entries(values.schema ?? {}).reduce(
    (userArguments, [methodName, methodConfig]) => {
      if (methodConfig.enabled) {
        const schemaObjectArgument = schemaArgument.properties?.[methodName] as ExtensionObjectArgument;
        const descriptionArgument = schemaObjectArgument?.properties?.['description'] as ExtensionStringArgument;
        const attributesArgument = schemaObjectArgument?.properties?.['attributes'] as ExtensionObjectArgument;
        const methodArguments = {
          type: 'object',
          title: methodName,
          description: methodConfig?.description || descriptionArgument.default || '',
          properties: Object.entries(methodConfig.attributes ?? {}).reduce(
            (prev, [key, value]) => {
              if (value.source === 'user') {
                const parameterArgument = attributesArgument?.properties?.[key] as ExtensionObjectArgument;
                const valuesArguments = parameterArgument?.properties?.['value'];
                if (valuesArguments) {
                  prev[key] = { ...valuesArguments, title: key, description: parameterArgument?.description };
                }
              }

              return prev;
            },
            {} as Record<string, ExtensionArgument>,
          ),
        } as ExtensionObjectArgument;
        if (Object.keys(methodArguments.properties).length) {
          userArguments[methodName] = methodArguments;
        }
      }

      return userArguments;
    },
    {} as { [name: string]: ExtensionObjectArgument },
  );
}

@Extension()
@Injectable()
export class MCPToolsExtension implements Extension<Configuration> {
  private logger = new Logger(this.constructor.name);

  constructor(protected readonly i18n: I18nService) {}

  get spec(): ExtensionSpec {
    return {
      name: 'mcp',
      title: this.i18n.t('texts.extensions.mcpTools.title'),
      logo: `
        <svg width="1338" height="195" viewBox="0 0 1338 195" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M25 97.8528L92.8823 29.9706C102.255 20.598 117.451 20.598 126.823 29.9706V29.9706C136.196 39.3431 136.196 54.5391 126.823 63.9117L75.5581 115.177" stroke="black" stroke-width="12" stroke-linecap="round"/>
        <path d="M76.2653 114.47L126.823 63.9117C136.196 54.5391 151.392 54.5391 160.765 63.9117L161.118 64.2652C170.491 73.6378 170.491 88.8338 161.118 98.2063L99.7248 159.6C96.6006 162.724 96.6006 167.789 99.7248 170.913L112.331 183.52" stroke="black" stroke-width="12" stroke-linecap="round"/>
        <path d="M109.853 46.9411L59.6482 97.1457C50.2757 106.518 50.2757 121.714 59.6482 131.087V131.087C69.0208 140.459 84.2168 140.459 93.5894 131.087L143.794 80.8822" stroke="black" stroke-width="12" stroke-linecap="round"/>
        <path d="M223.886 63.1818H239.364L260.091 113.773H260.909L281.636 63.1818H297.114V133H284.977V85.0341H284.33L265.034 132.795H255.966L236.67 84.9318H236.023V133H223.886V63.1818ZM333.182 134.023C328.068 134.023 323.636 132.898 319.886 130.648C316.136 128.398 313.227 125.25 311.159 121.205C309.114 117.159 308.091 112.432 308.091 107.023C308.091 101.614 309.114 96.875 311.159 92.8068C313.227 88.7386 316.136 85.5795 319.886 83.3295C323.636 81.0795 328.068 79.9545 333.182 79.9545C338.295 79.9545 342.727 81.0795 346.477 83.3295C350.227 85.5795 353.125 88.7386 355.17 92.8068C357.239 96.875 358.273 101.614 358.273 107.023C358.273 112.432 357.239 117.159 355.17 121.205C353.125 125.25 350.227 128.398 346.477 130.648C342.727 132.898 338.295 134.023 333.182 134.023ZM333.25 124.136C336.023 124.136 338.341 123.375 340.205 121.852C342.068 120.307 343.455 118.239 344.364 115.648C345.295 113.057 345.761 110.17 345.761 106.989C345.761 103.784 345.295 100.886 344.364 98.2955C343.455 95.6818 342.068 93.6023 340.205 92.0568C338.341 90.5114 336.023 89.7386 333.25 89.7386C330.409 89.7386 328.045 90.5114 326.159 92.0568C324.295 93.6023 322.898 95.6818 321.966 98.2955C321.057 100.886 320.602 103.784 320.602 106.989C320.602 110.17 321.057 113.057 321.966 115.648C322.898 118.239 324.295 120.307 326.159 121.852C328.045 123.375 330.409 124.136 333.25 124.136ZM388.179 133.92C384.065 133.92 380.384 132.864 377.134 130.75C373.884 128.636 371.315 125.568 369.429 121.545C367.543 117.523 366.599 112.636 366.599 106.886C366.599 101.068 367.554 96.1591 369.463 92.1591C371.395 88.1364 373.997 85.1023 377.27 83.0568C380.543 80.9886 384.19 79.9545 388.213 79.9545C391.281 79.9545 393.804 80.4773 395.781 81.5227C397.759 82.5455 399.327 83.7841 400.486 85.2386C401.645 86.6705 402.543 88.0227 403.179 89.2955H403.69V63.1818H416.065V133H403.929V124.75H403.179C402.543 126.023 401.622 127.375 400.418 128.807C399.213 130.216 397.622 131.42 395.645 132.42C393.668 133.42 391.179 133.92 388.179 133.92ZM391.622 123.795C394.236 123.795 396.463 123.091 398.304 121.682C400.145 120.25 401.543 118.261 402.497 115.716C403.452 113.17 403.929 110.205 403.929 106.818C403.929 103.432 403.452 100.489 402.497 97.9886C401.565 95.4886 400.179 93.5455 398.338 92.1591C396.52 90.7727 394.281 90.0795 391.622 90.0795C388.872 90.0795 386.577 90.7955 384.736 92.2273C382.895 93.6591 381.509 95.6364 380.577 98.1591C379.645 100.682 379.179 103.568 379.179 106.818C379.179 110.091 379.645 113.011 380.577 115.58C381.531 118.125 382.929 120.136 384.77 121.614C386.634 123.068 388.918 123.795 391.622 123.795ZM452.398 134.023C447.148 134.023 442.614 132.932 438.795 130.75C435 128.545 432.08 125.432 430.034 121.409C427.989 117.364 426.966 112.602 426.966 107.125C426.966 101.739 427.989 97.0114 430.034 92.9432C432.102 88.8523 434.989 85.6705 438.693 83.3977C442.398 81.1023 446.75 79.9545 451.75 79.9545C454.977 79.9545 458.023 80.4773 460.886 81.5227C463.773 82.5455 466.318 84.1364 468.523 86.2955C470.75 88.4545 472.5 91.2045 473.773 94.5455C475.045 97.8636 475.682 101.818 475.682 106.409V110.193H432.761V101.875H463.852C463.83 99.5114 463.318 97.4091 462.318 95.5682C461.318 93.7045 459.92 92.2386 458.125 91.1705C456.352 90.1023 454.284 89.5682 451.92 89.5682C449.398 89.5682 447.182 90.1818 445.273 91.4091C443.364 92.6136 441.875 94.2045 440.807 96.1818C439.761 98.1364 439.227 100.284 439.205 102.625V109.886C439.205 112.932 439.761 115.545 440.875 117.727C441.989 119.886 443.545 121.545 445.545 122.705C447.545 123.841 449.886 124.409 452.568 124.409C454.364 124.409 455.989 124.159 457.443 123.659C458.898 123.136 460.159 122.375 461.227 121.375C462.295 120.375 463.102 119.136 463.648 117.659L475.17 118.955C474.443 122 473.057 124.659 471.011 126.932C468.989 129.182 466.398 130.932 463.239 132.182C460.08 133.409 456.466 134.023 452.398 134.023ZM498.463 63.1818V133H486.122V63.1818H498.463ZM595.273 86.7386H582.523C582.159 84.6477 581.489 82.7955 580.511 81.1818C579.534 79.5455 578.318 78.1591 576.864 77.0227C575.409 75.8864 573.75 75.0341 571.886 74.4659C570.045 73.875 568.057 73.5795 565.92 73.5795C562.125 73.5795 558.761 74.5341 555.83 76.4432C552.898 78.3295 550.602 81.1023 548.943 84.7614C547.284 88.3977 546.455 92.8409 546.455 98.0909C546.455 103.432 547.284 107.932 548.943 111.591C550.625 115.227 552.92 117.977 555.83 119.841C558.761 121.682 562.114 122.602 565.886 122.602C567.977 122.602 569.932 122.33 571.75 121.784C573.591 121.216 575.239 120.386 576.693 119.295C578.17 118.205 579.409 116.864 580.409 115.273C581.432 113.682 582.136 111.864 582.523 109.818L595.273 109.886C594.795 113.205 593.761 116.318 592.17 119.227C590.602 122.136 588.545 124.705 586 126.932C583.455 129.136 580.477 130.864 577.068 132.114C573.659 133.341 569.875 133.955 565.716 133.955C559.58 133.955 554.102 132.534 549.284 129.693C544.466 126.852 540.67 122.75 537.898 117.386C535.125 112.023 533.739 105.591 533.739 98.0909C533.739 90.5682 535.136 84.1364 537.932 78.7955C540.727 73.4318 544.534 69.3295 549.352 66.4886C554.17 63.6477 559.625 62.2273 565.716 62.2273C569.602 62.2273 573.216 62.7727 576.557 63.8636C579.898 64.9545 582.875 66.5568 585.489 68.6705C588.102 70.7614 590.25 73.3295 591.932 76.375C593.636 79.3977 594.75 82.8523 595.273 86.7386ZM629.151 134.023C624.037 134.023 619.605 132.898 615.855 130.648C612.105 128.398 609.196 125.25 607.128 121.205C605.082 117.159 604.06 112.432 604.06 107.023C604.06 101.614 605.082 96.875 607.128 92.8068C609.196 88.7386 612.105 85.5795 615.855 83.3295C619.605 81.0795 624.037 79.9545 629.151 79.9545C634.264 79.9545 638.696 81.0795 642.446 83.3295C646.196 85.5795 649.094 88.7386 651.139 92.8068C653.207 96.875 654.241 101.614 654.241 107.023C654.241 112.432 653.207 117.159 651.139 121.205C649.094 125.25 646.196 128.398 642.446 130.648C638.696 132.898 634.264 134.023 629.151 134.023ZM629.219 124.136C631.991 124.136 634.31 123.375 636.173 121.852C638.037 120.307 639.423 118.239 640.332 115.648C641.264 113.057 641.73 110.17 641.73 106.989C641.73 103.784 641.264 100.886 640.332 98.2955C639.423 95.6818 638.037 93.6023 636.173 92.0568C634.31 90.5114 631.991 89.7386 629.219 89.7386C626.378 89.7386 624.014 90.5114 622.128 92.0568C620.264 93.6023 618.866 95.6818 617.935 98.2955C617.026 100.886 616.571 103.784 616.571 106.989C616.571 110.17 617.026 113.057 617.935 115.648C618.866 118.239 620.264 120.307 622.128 121.852C624.014 123.375 626.378 124.136 629.219 124.136ZM677.057 102.318V133H664.716V80.6364H676.511V89.5341H677.125C678.33 86.6023 680.25 84.2727 682.886 82.5455C685.545 80.8182 688.83 79.9545 692.739 79.9545C696.352 79.9545 699.5 80.7273 702.182 82.2727C704.886 83.8182 706.977 86.0568 708.455 88.9886C709.955 91.9205 710.693 95.4773 710.67 99.6591V133H698.33V101.568C698.33 98.0682 697.42 95.3295 695.602 93.3523C693.807 91.375 691.318 90.3864 688.136 90.3864C685.977 90.3864 684.057 90.8636 682.375 91.8182C680.716 92.75 679.409 94.1023 678.455 95.875C677.523 97.6477 677.057 99.7955 677.057 102.318ZM749.364 80.6364V90.1818H719.261V80.6364H749.364ZM726.693 68.0909H739.034V117.25C739.034 118.909 739.284 120.182 739.784 121.068C740.307 121.932 740.989 122.523 741.83 122.841C742.67 123.159 743.602 123.318 744.625 123.318C745.398 123.318 746.102 123.261 746.739 123.148C747.398 123.034 747.898 122.932 748.239 122.841L750.318 132.489C749.659 132.716 748.716 132.966 747.489 133.239C746.284 133.511 744.807 133.67 743.057 133.716C739.966 133.807 737.182 133.341 734.705 132.318C732.227 131.273 730.261 129.659 728.807 127.477C727.375 125.295 726.67 122.568 726.693 119.295V68.0909ZM782.304 134.023C777.054 134.023 772.52 132.932 768.702 130.75C764.906 128.545 761.986 125.432 759.94 121.409C757.895 117.364 756.872 112.602 756.872 107.125C756.872 101.739 757.895 97.0114 759.94 92.9432C762.009 88.8523 764.895 85.6705 768.599 83.3977C772.304 81.1023 776.656 79.9545 781.656 79.9545C784.884 79.9545 787.929 80.4773 790.793 81.5227C793.679 82.5455 796.224 84.1364 798.429 86.2955C800.656 88.4545 802.406 91.2045 803.679 94.5455C804.952 97.8636 805.588 101.818 805.588 106.409V110.193H762.668V101.875H793.759C793.736 99.5114 793.224 97.4091 792.224 95.5682C791.224 93.7045 789.827 92.2386 788.031 91.1705C786.259 90.1023 784.19 89.5682 781.827 89.5682C779.304 89.5682 777.088 90.1818 775.179 91.4091C773.27 92.6136 771.781 94.2045 770.713 96.1818C769.668 98.1364 769.134 100.284 769.111 102.625V109.886C769.111 112.932 769.668 115.545 770.781 117.727C771.895 119.886 773.452 121.545 775.452 122.705C777.452 123.841 779.793 124.409 782.474 124.409C784.27 124.409 785.895 124.159 787.349 123.659C788.804 123.136 790.065 122.375 791.134 121.375C792.202 120.375 793.009 119.136 793.554 117.659L805.077 118.955C804.349 122 802.963 124.659 800.918 126.932C798.895 129.182 796.304 130.932 793.145 132.182C789.986 133.409 786.372 134.023 782.304 134.023ZM824.994 80.6364L835.562 99.9659L846.301 80.6364H859.358L843.574 106.818L859.631 133H846.642L835.562 114.148L824.585 133H811.494L827.449 106.818L811.903 80.6364H824.994ZM895.051 80.6364V90.1818H864.949V80.6364H895.051ZM872.381 68.0909H884.722V117.25C884.722 118.909 884.972 120.182 885.472 121.068C885.994 121.932 886.676 122.523 887.517 122.841C888.358 123.159 889.29 123.318 890.312 123.318C891.085 123.318 891.79 123.261 892.426 123.148C893.085 123.034 893.585 122.932 893.926 122.841L896.006 132.489C895.347 132.716 894.403 132.966 893.176 133.239C891.972 133.511 890.494 133.67 888.744 133.716C885.653 133.807 882.869 133.341 880.392 132.318C877.915 131.273 875.949 129.659 874.494 127.477C873.063 125.295 872.358 122.568 872.381 119.295V68.0909ZM929.73 133V63.1818H955.912C961.276 63.1818 965.776 64.1818 969.412 66.1818C973.071 68.1818 975.832 70.9318 977.696 74.4318C979.582 77.9091 980.526 81.8636 980.526 86.2955C980.526 90.7727 979.582 94.75 977.696 98.2273C975.81 101.705 973.026 104.443 969.344 106.443C965.662 108.42 961.128 109.409 955.741 109.409H938.389V99.0114H954.037C957.173 99.0114 959.741 98.4659 961.741 97.375C963.741 96.2841 965.219 94.7841 966.173 92.875C967.151 90.9659 967.639 88.7727 967.639 86.2955C967.639 83.8182 967.151 81.6364 966.173 79.75C965.219 77.8636 963.73 76.3977 961.707 75.3523C959.707 74.2841 957.128 73.75 953.969 73.75H942.378V133H929.73ZM990.966 133V80.6364H1002.93V89.3636H1003.48C1004.43 86.3409 1006.07 84.0114 1008.39 82.375C1010.73 80.7159 1013.4 79.8864 1016.4 79.8864C1017.08 79.8864 1017.84 79.9205 1018.68 79.9886C1019.55 80.0341 1020.26 80.1136 1020.83 80.2273V91.5795C1020.31 91.3977 1019.48 91.2386 1018.34 91.1023C1017.23 90.9432 1016.15 90.8636 1015.1 90.8636C1012.85 90.8636 1010.83 91.3523 1009.03 92.3295C1007.26 93.2841 1005.86 94.6136 1004.84 96.3182C1003.82 98.0227 1003.31 99.9886 1003.31 102.216V133H990.966ZM1049.71 134.023C1044.6 134.023 1040.17 132.898 1036.42 130.648C1032.67 128.398 1029.76 125.25 1027.69 121.205C1025.64 117.159 1024.62 112.432 1024.62 107.023C1024.62 101.614 1025.64 96.875 1027.69 92.8068C1029.76 88.7386 1032.67 85.5795 1036.42 83.3295C1040.17 81.0795 1044.6 79.9545 1049.71 79.9545C1054.83 79.9545 1059.26 81.0795 1063.01 83.3295C1066.76 85.5795 1069.66 88.7386 1071.7 92.8068C1073.77 96.875 1074.8 101.614 1074.8 107.023C1074.8 112.432 1073.77 117.159 1071.7 121.205C1069.66 125.25 1066.76 128.398 1063.01 130.648C1059.26 132.898 1054.83 134.023 1049.71 134.023ZM1049.78 124.136C1052.55 124.136 1054.87 123.375 1056.74 121.852C1058.6 120.307 1059.99 118.239 1060.89 115.648C1061.83 113.057 1062.29 110.17 1062.29 106.989C1062.29 103.784 1061.83 100.886 1060.89 98.2955C1059.99 95.6818 1058.6 93.6023 1056.74 92.0568C1054.87 90.5114 1052.55 89.7386 1049.78 89.7386C1046.94 89.7386 1044.58 90.5114 1042.69 92.0568C1040.83 93.6023 1039.43 95.6818 1038.5 98.2955C1037.59 100.886 1037.13 103.784 1037.13 106.989C1037.13 110.17 1037.59 113.057 1038.5 115.648C1039.43 118.239 1040.83 120.307 1042.69 121.852C1044.58 123.375 1046.94 124.136 1049.78 124.136ZM1111.43 80.6364V90.1818H1081.32V80.6364H1111.43ZM1088.76 68.0909H1101.1V117.25C1101.1 118.909 1101.35 120.182 1101.85 121.068C1102.37 121.932 1103.05 122.523 1103.89 122.841C1104.73 123.159 1105.66 123.318 1106.69 123.318C1107.46 123.318 1108.16 123.261 1108.8 123.148C1109.46 123.034 1109.96 122.932 1110.3 122.841L1112.38 132.489C1111.72 132.716 1110.78 132.966 1109.55 133.239C1108.35 133.511 1106.87 133.67 1105.12 133.716C1102.03 133.807 1099.24 133.341 1096.77 132.318C1094.29 131.273 1092.32 129.659 1090.87 127.477C1089.44 125.295 1088.73 122.568 1088.76 119.295V68.0909ZM1144.03 134.023C1138.91 134.023 1134.48 132.898 1130.73 130.648C1126.98 128.398 1124.07 125.25 1122 121.205C1119.96 117.159 1118.93 112.432 1118.93 107.023C1118.93 101.614 1119.96 96.875 1122 92.8068C1124.07 88.7386 1126.98 85.5795 1130.73 83.3295C1134.48 81.0795 1138.91 79.9545 1144.03 79.9545C1149.14 79.9545 1153.57 81.0795 1157.32 83.3295C1161.07 85.5795 1163.97 88.7386 1166.01 92.8068C1168.08 96.875 1169.12 101.614 1169.12 107.023C1169.12 112.432 1168.08 117.159 1166.01 121.205C1163.97 125.25 1161.07 128.398 1157.32 130.648C1153.57 132.898 1149.14 134.023 1144.03 134.023ZM1144.09 124.136C1146.87 124.136 1149.18 123.375 1151.05 121.852C1152.91 120.307 1154.3 118.239 1155.21 115.648C1156.14 113.057 1156.61 110.17 1156.61 106.989C1156.61 103.784 1156.14 100.886 1155.21 98.2955C1154.3 95.6818 1152.91 93.6023 1151.05 92.0568C1149.18 90.5114 1146.87 89.7386 1144.09 89.7386C1141.25 89.7386 1138.89 90.5114 1137 92.0568C1135.14 93.6023 1133.74 95.6818 1132.81 98.2955C1131.9 100.886 1131.45 103.784 1131.45 106.989C1131.45 110.17 1131.9 113.057 1132.81 115.648C1133.74 118.239 1135.14 120.307 1137 121.852C1138.89 123.375 1141.25 124.136 1144.09 124.136ZM1202.43 134.023C1197.2 134.023 1192.72 132.875 1188.97 130.58C1185.24 128.284 1182.36 125.114 1180.34 121.068C1178.34 117 1177.34 112.318 1177.34 107.023C1177.34 101.705 1178.36 97.0114 1180.41 92.9432C1182.45 88.8523 1185.34 85.6705 1189.07 83.3977C1192.82 81.1023 1197.25 79.9545 1202.36 79.9545C1206.61 79.9545 1210.38 80.7386 1213.65 82.3068C1216.94 83.8523 1219.57 86.0455 1221.52 88.8864C1223.48 91.7045 1224.59 95 1224.86 98.7727H1213.07C1212.59 96.25 1211.45 94.1477 1209.66 92.4659C1207.89 90.7614 1205.51 89.9091 1202.53 89.9091C1200.01 89.9091 1197.8 90.5909 1195.89 91.9545C1193.98 93.2955 1192.49 95.2273 1191.42 97.75C1190.38 100.273 1189.85 103.295 1189.85 106.818C1189.85 110.386 1190.38 113.455 1191.42 116.023C1192.47 118.568 1193.93 120.534 1195.82 121.92C1197.73 123.284 1199.97 123.966 1202.53 123.966C1204.35 123.966 1205.98 123.625 1207.41 122.943C1208.86 122.239 1210.08 121.227 1211.06 119.909C1212.03 118.591 1212.7 116.989 1213.07 115.102H1224.86C1224.57 118.807 1223.48 122.091 1221.59 124.955C1219.7 127.795 1217.14 130.023 1213.89 131.636C1210.64 133.227 1206.82 134.023 1202.43 134.023ZM1257.84 134.023C1252.72 134.023 1248.29 132.898 1244.54 130.648C1240.79 128.398 1237.88 125.25 1235.82 121.205C1233.77 117.159 1232.75 112.432 1232.75 107.023C1232.75 101.614 1233.77 96.875 1235.82 92.8068C1237.88 88.7386 1240.79 85.5795 1244.54 83.3295C1248.29 81.0795 1252.72 79.9545 1257.84 79.9545C1262.95 79.9545 1267.38 81.0795 1271.13 83.3295C1274.88 85.5795 1277.78 88.7386 1279.83 92.8068C1281.89 96.875 1282.93 101.614 1282.93 107.023C1282.93 112.432 1281.89 117.159 1279.83 121.205C1277.78 125.25 1274.88 128.398 1271.13 130.648C1267.38 132.898 1262.95 134.023 1257.84 134.023ZM1257.91 124.136C1260.68 124.136 1263 123.375 1264.86 121.852C1266.72 120.307 1268.11 118.239 1269.02 115.648C1269.95 113.057 1270.42 110.17 1270.42 106.989C1270.42 103.784 1269.95 100.886 1269.02 98.2955C1268.11 95.6818 1266.72 93.6023 1264.86 92.0568C1263 90.5114 1260.68 89.7386 1257.91 89.7386C1255.07 89.7386 1252.7 90.5114 1250.82 92.0568C1248.95 93.6023 1247.55 95.6818 1246.62 98.2955C1245.71 100.886 1245.26 103.784 1245.26 106.989C1245.26 110.17 1245.71 113.057 1246.62 115.648C1247.55 118.239 1248.95 120.307 1250.82 121.852C1252.7 123.375 1255.07 124.136 1257.91 124.136ZM1305.74 63.1818V133H1293.4V63.1818H1305.74Z" fill="black"/>
        </svg>
      `,
      description: this.i18n.t('texts.extensions.mcpTools.description'),
      type: 'tool',
      triggers: ['endpoint'],
      arguments: {
        serverName: {
          type: 'string',
          title: this.i18n.t('texts.extensions.mcpTools.serverName'),
          description: this.i18n.t('texts.extensions.mcpTools.serverNameHint'),
          required: true,
          showInList: true,
        },
        endpoint: {
          type: 'string',
          title: this.i18n.t('texts.extensions.mcpTools.endpoint'),
          description: this.i18n.t('texts.extensions.mcpTools.endpointHint'),
          required: true,
        },
        transport: {
          type: 'string',
          title: this.i18n.t('texts.extensions.mcpTools.transport'),
          description: this.i18n.t('texts.extensions.mcpTools.transportHint'),
          required: false,
          default: 'sse',
          enum: Object.values(Transport),
        },
      },
    };
  }

  toolsChanged(before: z.infer<typeof ListToolsResultSchema>['tools'], after: z.infer<typeof ListToolsResultSchema>['tools']) {
    return diff(before, after);
  }

  async buildSpec(
    extension: ExtensionEntity<Configuration>,
    throwOnError: boolean,
    forceRebuild: boolean,
  ): Promise<ExtensionSpec> {
    const spec = this.spec;
    const state = (extension.state ?? {}) as ExtensionState;
    const values = extension.values;

    try {
      const changed = values.endpoint !== state?.endpoint;

      if (changed || !state.tools || forceRebuild) {
        const { tools } = await this.getTools(values);
        this.resetUnmodifiedDescriptionNames(values.schema, tools);
        if (state.tools) {
          this.resetUnmodifiedDescriptionNames(values.schema, state.tools);
          const changes = this.toolsChanged(state.tools, tools);
          state.changed = changes.length > 0;
        }

        state.tools = tools;
        state.endpoint = values.endpoint;
      } else {
        state.changed = false;
      }

      spec.arguments['schema'] = toArguments(this.i18n, state.tools);
      spec.userArguments = {
        type: 'object',
        title: values.serverName,
        description: '',
        properties: toUserArguments(values, spec.arguments['schema']),
      };
    } catch (err) {
      const errorMessage = `Cannot connect to mcp tool`;

      this.logger.error(errorMessage, err);
      delete state.tools;
      delete spec.arguments['schema'];
      delete spec.userArguments;
      delete state.changed;
      values.schema = {};
      if (throwOnError) {
        throw new BadRequestException(errorMessage);
      }
    }

    return spec;
  }

  async test(configuration: Configuration) {
    return this.getTools(configuration);
  }

  private resetUnmodifiedDescriptionNames(
    schema: Configuration['schema'],
    tools: z.infer<typeof ListToolsResultSchema>['tools'],
  ) {
    if (!schema) {
      return;
    }

    tools.forEach((tool) => {
      if (schema[tool.name]?.description && schema[tool.name].description === tool.description) {
        delete schema[tool.name].description;
      }
    });
  }

  private applyTemplates(context: ChatContext, templateArgs: Record<string, any>, args?: Record<string, any>) {
    const templateKeys = Object.keys(templateArgs);

    return Object.fromEntries(
      Object.entries(args ?? templateArgs).map(([key, value]) => [
        key,
        typeof value === 'string' && typeof templateArgs[key] === 'string' && templateArgs[key]
          ? renderString(templateArgs[key], {
              ...context,
              language: this.i18n.language,
              value,
            })
          : templateKeys.includes(key)
            ? value
            : undefined,
      ]),
    );
  }

  private getTemplateArgs(attributes: ConfigurationAttributes, source: ConfigurationAttributeSource) {
    return Object.fromEntries(
      Object.entries(attributes)
        .filter(([_, attribute]) => attribute.source === source)
        .map(([key, attribute]) => [key, attribute.value ?? null]),
    );
  }

  async getMiddlewares(
    _user: User,
    extension: ExtensionEntity<Configuration>,
    userArgs?: Record<string, Record<string, any>>,
  ): Promise<ChatMiddleware[]> {
    const middleware = {
      invoke: async (context: ChatContext, _: GetContext, next: ChatNextDelegate): Promise<any> => {
        const { tools, client } = (await this.getTools(extension.values)) ?? [];
        const schemaData = extension.values.schema ?? {};

        const filteredTools = tools.filter((x) => schemaData[x.name]?.enabled);

        context.tools.push(
          ...filteredTools.map(({ name, description, inputSchema }) => {
            const params = schemaData[name];
            const schema = inputSchema as JsonSchemaObject;
            // only expose attributes that are configured to be defined by the llm
            schema.properties = Object.fromEntries(
              Object.entries(schema.properties ?? {}).filter(([key]) => params.attributes?.[key]?.source === 'llm'),
            );

            const userDefinedArgs = userArgs?.[name] ?? {};
            const displayName = `${extension.values.serverName}: ${name}`;

            return new NamedDynamicStructuredTool({
              displayName,
              name: `${extension.externalId}_${name}`,
              description: params.description || description || name,
              schema: jsonSchemaToZod(schema),
              func: async (args: Record<string, any>) => {
                const attributes = params.attributes ?? {};
                const adminArgs = this.applyTemplates(context, this.getTemplateArgs(attributes, 'admin'));
                const llmArgs = this.applyTemplates(context, this.getTemplateArgs(attributes, 'llm'), args);
                const userArgs = this.applyTemplates(context, this.getTemplateArgs(attributes, 'user'), userDefinedArgs);
                this.logger.log(`Calling function ${name}`);

                try {
                  const req: CallToolRequest = {
                    method: 'tools/call',
                    params: { name, arguments: { ...llmArgs, ...adminArgs, ...userArgs } },
                  };
                  const res = await client.request(req, CallToolResultSchema);
                  const { sources, content } = transformMCPToolResponse(res);
                  if (sources.length) {
                    context.history?.addSources(extension.externalId, sources);
                  }

                  return content;
                } catch (err) {
                  context.result.next({
                    type: 'debug',
                    content: this.i18n.t('texts.extensions.mcpTools.errorToolCall', { tool: name }),
                  });
                  if (err instanceof McpError) {
                    this.logger.error('mcpError during tool call', err);
                  } else {
                    this.logger.error('error during tool call', err);
                  }
                  throw err;
                }
              },
            });
          }),
        );
        return next(context);
      },
    };

    return Promise.resolve([middleware]);
  }

  private async getTools(configuration: Configuration) {
    const client = new Client(
      {
        name: 'langchain-js-client',
        version: '1.0.0',
      },
      {
        capabilities: {},
      },
    );

    const url = new URL(configuration.endpoint);
    const transport =
      configuration.transport === Transport.STREAMABLE_HTTP
        ? new StreamableHTTPClientTransport(url)
        : new SSEClientTransport(url);
    await client.connect(transport);
    const { tools } = await client.request({ method: 'tools/list' }, ListToolsResultSchema);
    return { tools, client };
  }
}
