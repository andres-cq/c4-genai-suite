import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtensionEntity, ExtensionRepository } from 'src/domain/database';
import { assignDefined } from 'src/lib';
import { ConfiguredExtension, ExtensionConfiguration, ExtensionObjectArgument } from '../interfaces';
import { ExplorerService } from '../services';
import { buildExtension, maskArgumentDefault, maskKeyValues, unmaskExtensionValues, validateConfiguration } from './utils';

type Values = Partial<{
  enabled: boolean;
  values: ExtensionConfiguration;
  configurableArguments?: ExtensionObjectArgument;
}>;

export class UpdateExtension {
  constructor(
    public readonly id: number,
    public readonly values: Values,
  ) {}
}

export class UpdateExtensionResponse {
  constructor(public readonly extension: ConfiguredExtension) {}
}

@CommandHandler(UpdateExtension)
export class UpdateExtensionHandler implements ICommandHandler<UpdateExtension, UpdateExtensionResponse> {
  constructor(
    private readonly explorer: ExplorerService,
    @InjectRepository(ExtensionEntity)
    private readonly extensions: ExtensionRepository,
  ) {}

  async execute(command: UpdateExtension): Promise<UpdateExtensionResponse> {
    const { id } = command;
    const { enabled, values, configurableArguments } = command.values;

    if (configurableArguments?.properties && values) {
      Object.entries(configurableArguments.properties)
        .filter(([key]) => values[key] != null)
        .map(([key, value]) => {
          if (value.type === 'string' || value.type === 'number' || value.type === 'boolean') {
            value.default = values[key] as typeof value.default;
          }
          maskArgumentDefault(value);
        });
    }

    // Make an extra query to get the extension name.
    const entity = await this.extensions.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException();
    }

    const unmaskedValues = assignDefined(entity.values ?? {}, unmaskExtensionValues(values ?? {}));

    const extension = this.explorer.getExtension(entity.name);

    if (!extension) {
      throw new BadRequestException(['Extension is not supported anymore.']);
    }

    entity.values = unmaskedValues;
    const configuredExtension = await ConfiguredExtension.create(extension, entity, true, true);
    entity.values = validateConfiguration(entity.values, configuredExtension.spec);
    assignDefined(entity, { enabled, configurableArguments });

    await this.extensions.save(entity);
    const result = await buildExtension(entity, extension, true);
    maskKeyValues(result);
    return new UpdateExtensionResponse(result);
  }
}
