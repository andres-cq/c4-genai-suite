/* tslint:disable */
/* eslint-disable */
/**
 * CCCC
 * CodeCentric Company Chat
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { mapValues } from '../runtime';
import type { ToolArgumentDto } from './ToolArgumentDto';
import {
    ToolArgumentDtoFromJSON,
    ToolArgumentDtoFromJSONTyped,
    ToolArgumentDtoToJSON,
} from './ToolArgumentDto';
import type { UIRequirementDto } from './UIRequirementDto';
import {
    UIRequirementDtoFromJSON,
    UIRequirementDtoFromJSONTyped,
    UIRequirementDtoToJSON,
} from './UIRequirementDto';

/**
 * 
 * @export
 * @interface ToolDto
 */
export interface ToolDto {
    /**
     * The name of the tool.
     * @type {string}
     * @memberof ToolDto
     */
    name: string;
    /**
     * The description of the tool.
     * @type {string}
     * @memberof ToolDto
     */
    description: string;
    /**
     * The requirements on the UI.
     * @type {UIRequirementDto}
     * @memberof ToolDto
     */
    ui?: UIRequirementDto;
    /**
     * The arguments.
     * @type {{ [key: string]: ToolArgumentDto; }}
     * @memberof ToolDto
     */
    arguments: { [key: string]: ToolArgumentDto; };
}

/**
 * Check if a given object implements the ToolDto interface.
 */
export function instanceOfToolDto(value: object): value is ToolDto {
    if (!('name' in value) || value['name'] === undefined) return false;
    if (!('description' in value) || value['description'] === undefined) return false;
    if (!('arguments' in value) || value['arguments'] === undefined) return false;
    return true;
}

export function ToolDtoFromJSON(json: any): ToolDto {
    return ToolDtoFromJSONTyped(json, false);
}

export function ToolDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): ToolDto {
    if (json == null) {
        return json;
    }
    return {
        
        'name': json['name'],
        'description': json['description'],
        'ui': json['ui'] == null ? undefined : UIRequirementDtoFromJSON(json['ui']),
        'arguments': (mapValues(json['arguments'], ToolArgumentDtoFromJSON)),
    };
}

export function ToolDtoToJSON(value?: ToolDto | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'name': value['name'],
        'description': value['description'],
        'ui': UIRequirementDtoToJSON(value['ui']),
        'arguments': (mapValues(value['arguments'], ToolArgumentDtoToJSON)),
    };
}

