//@ts-nocheck
/* tslint:disable */
/* eslint-disable */
/**
 * c4 GenAI Suite
 * c4 GenAI Suite
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { mapValues } from '../runtime';
import type { ExtensionArgumentObjectSpecDtoPropertiesValue } from './ExtensionArgumentObjectSpecDtoPropertiesValue';
import {
    ExtensionArgumentObjectSpecDtoPropertiesValueFromJSON,
    ExtensionArgumentObjectSpecDtoPropertiesValueFromJSONTyped,
    ExtensionArgumentObjectSpecDtoPropertiesValueToJSON,
} from './ExtensionArgumentObjectSpecDtoPropertiesValue';
import type { ExtensionArgumentObjectSpecDto } from './ExtensionArgumentObjectSpecDto';
import {
    ExtensionArgumentObjectSpecDtoFromJSON,
    ExtensionArgumentObjectSpecDtoFromJSONTyped,
    ExtensionArgumentObjectSpecDtoToJSON,
} from './ExtensionArgumentObjectSpecDto';

/**
 * 
 * @export
 * @interface ExtensionUserInfoDto
 */
export interface ExtensionUserInfoDto {
    /**
     * The name of the extension.
     * @type {string}
     * @memberof ExtensionUserInfoDto
     */
    name: string;
    /**
     * The ID of the extension within the configuration.
     * @type {number}
     * @memberof ExtensionUserInfoDto
     */
    id: number;
    /**
     * The display title.
     * @type {string}
     * @memberof ExtensionUserInfoDto
     */
    title: string;
    /**
     * The optional description.
     * @type {string}
     * @memberof ExtensionUserInfoDto
     */
    description?: string;
    /**
     * The logo as SVG.
     * @type {string}
     * @memberof ExtensionUserInfoDto
     */
    logo?: string;
    /**
     * The type of the extension.
     * @type {string}
     * @memberof ExtensionUserInfoDto
     */
    type: ExtensionUserInfoDtoTypeEnum;
    /**
     * The user arguments.
     * @type {{ [key: string]: ExtensionArgumentObjectSpecDtoPropertiesValue; }}
     * @memberof ExtensionUserInfoDto
     */
    userArguments: { [key: string]: ExtensionArgumentObjectSpecDtoPropertiesValue; };
    /**
     * The arguments.
     * @type {ExtensionArgumentObjectSpecDto}
     * @memberof ExtensionUserInfoDto
     */
    configurableArguments?: ExtensionArgumentObjectSpecDto;
}


/**
 * @export
 */
export const ExtensionUserInfoDtoTypeEnum = {
    Tool: 'tool',
    Llm: 'llm',
    Other: 'other'
} as const;
export type ExtensionUserInfoDtoTypeEnum = typeof ExtensionUserInfoDtoTypeEnum[keyof typeof ExtensionUserInfoDtoTypeEnum];


/**
 * Check if a given object implements the ExtensionUserInfoDto interface.
 */
export function instanceOfExtensionUserInfoDto(value: object): value is ExtensionUserInfoDto {
    if (!('name' in value) || value['name'] === undefined) return false;
    if (!('id' in value) || value['id'] === undefined) return false;
    if (!('title' in value) || value['title'] === undefined) return false;
    if (!('type' in value) || value['type'] === undefined) return false;
    if (!('userArguments' in value) || value['userArguments'] === undefined) return false;
    return true;
}

export function ExtensionUserInfoDtoFromJSON(json: any): ExtensionUserInfoDto {
    return ExtensionUserInfoDtoFromJSONTyped(json, false);
}

export function ExtensionUserInfoDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): ExtensionUserInfoDto {
    if (json == null) {
        return json;
    }
    return {
        
        'name': json['name'],
        'id': json['id'],
        'title': json['title'],
        'description': json['description'] == null ? undefined : json['description'],
        'logo': json['logo'] == null ? undefined : json['logo'],
        'type': json['type'],
        'userArguments': (mapValues(json['userArguments'], ExtensionArgumentObjectSpecDtoPropertiesValueFromJSON)),
        'configurableArguments': json['configurableArguments'] == null ? undefined : ExtensionArgumentObjectSpecDtoFromJSON(json['configurableArguments']),
    };
}

export function ExtensionUserInfoDtoToJSON(value?: ExtensionUserInfoDto | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'name': value['name'],
        'id': value['id'],
        'title': value['title'],
        'description': value['description'],
        'logo': value['logo'],
        'type': value['type'],
        'userArguments': (mapValues(value['userArguments'], ExtensionArgumentObjectSpecDtoPropertiesValueToJSON)),
        'configurableArguments': ExtensionArgumentObjectSpecDtoToJSON(value['configurableArguments']),
    };
}

