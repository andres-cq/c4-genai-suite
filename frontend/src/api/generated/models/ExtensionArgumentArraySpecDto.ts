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
import type { ExtensionArgumentArraySpecDtoItems } from './ExtensionArgumentArraySpecDtoItems';
import {
    ExtensionArgumentArraySpecDtoItemsFromJSON,
    ExtensionArgumentArraySpecDtoItemsFromJSONTyped,
    ExtensionArgumentArraySpecDtoItemsToJSON,
} from './ExtensionArgumentArraySpecDtoItems';

/**
 * 
 * @export
 * @interface ExtensionArgumentArraySpecDto
 */
export interface ExtensionArgumentArraySpecDto {
    /**
     * The type of the argument.
     * @type {string}
     * @memberof ExtensionArgumentArraySpecDto
     */
    type: ExtensionArgumentArraySpecDtoTypeEnum;
    /**
     * The label of the argument.
     * @type {string}
     * @memberof ExtensionArgumentArraySpecDto
     */
    title: string;
    /**
     * True, if required.
     * @type {string}
     * @memberof ExtensionArgumentArraySpecDto
     */
    description?: string;
    /**
     * True, if required.
     * @type {boolean}
     * @memberof ExtensionArgumentArraySpecDto
     */
    required?: boolean;
    /**
     * True to show this property in lists.
     * @type {boolean}
     * @memberof ExtensionArgumentArraySpecDto
     */
    showInList?: boolean;
    /**
     * URL to the documentation.
     * @type {string}
     * @memberof ExtensionArgumentArraySpecDto
     */
    documentationUrl?: string;
    /**
     * 
     * @type {ExtensionArgumentArraySpecDtoItems}
     * @memberof ExtensionArgumentArraySpecDto
     */
    items: ExtensionArgumentArraySpecDtoItems;
    /**
     * True, if items should be unique.
     * @type {boolean}
     * @memberof ExtensionArgumentArraySpecDto
     */
    uniqueItems?: boolean;
    /**
     * The selected value.
     * @type {Array<object>}
     * @memberof ExtensionArgumentArraySpecDto
     */
    _default?: Array<object>;
}


/**
 * @export
 */
export const ExtensionArgumentArraySpecDtoTypeEnum = {
    String: 'string',
    Number: 'number',
    Boolean: 'boolean',
    Object: 'object',
    Array: 'array'
} as const;
export type ExtensionArgumentArraySpecDtoTypeEnum = typeof ExtensionArgumentArraySpecDtoTypeEnum[keyof typeof ExtensionArgumentArraySpecDtoTypeEnum];


/**
 * Check if a given object implements the ExtensionArgumentArraySpecDto interface.
 */
export function instanceOfExtensionArgumentArraySpecDto(value: object): value is ExtensionArgumentArraySpecDto {
    if (!('type' in value) || value['type'] === undefined) return false;
    if (!('title' in value) || value['title'] === undefined) return false;
    if (!('items' in value) || value['items'] === undefined) return false;
    return true;
}

export function ExtensionArgumentArraySpecDtoFromJSON(json: any): ExtensionArgumentArraySpecDto {
    return ExtensionArgumentArraySpecDtoFromJSONTyped(json, false);
}

export function ExtensionArgumentArraySpecDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): ExtensionArgumentArraySpecDto {
    if (json == null) {
        return json;
    }
    return {
        
        'type': json['type'],
        'title': json['title'],
        'description': json['description'] == null ? undefined : json['description'],
        'required': json['required'] == null ? undefined : json['required'],
        'showInList': json['showInList'] == null ? undefined : json['showInList'],
        'documentationUrl': json['documentationUrl'] == null ? undefined : json['documentationUrl'],
        'items': ExtensionArgumentArraySpecDtoItemsFromJSON(json['items']),
        'uniqueItems': json['uniqueItems'] == null ? undefined : json['uniqueItems'],
        '_default': json['default'] == null ? undefined : json['default'],
    };
}

export function ExtensionArgumentArraySpecDtoToJSON(value?: ExtensionArgumentArraySpecDto | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'type': value['type'],
        'title': value['title'],
        'description': value['description'],
        'required': value['required'],
        'showInList': value['showInList'],
        'documentationUrl': value['documentationUrl'],
        'items': ExtensionArgumentArraySpecDtoItemsToJSON(value['items']),
        'uniqueItems': value['uniqueItems'],
        'default': value['_default'],
    };
}

