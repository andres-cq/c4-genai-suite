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
/**
 * 
 * @export
 * @interface ExtensionBucketSettingsDto
 */
export interface ExtensionBucketSettingsDto {
    /**
     * The extension name
     * @type {string}
     * @memberof ExtensionBucketSettingsDto
     */
    title: string;
    /**
     * The extension id
     * @type {number}
     * @memberof ExtensionBucketSettingsDto
     */
    extensionId: number;
    /**
     * The max files that are allowed for the whole conversation
     * @type {number}
     * @memberof ExtensionBucketSettingsDto
     */
    maxFiles?: number;
    /**
     * The filename extensions.
     * @type {Array<string>}
     * @memberof ExtensionBucketSettingsDto
     */
    fileNameExtensions: Array<string>;
}

/**
 * Check if a given object implements the ExtensionBucketSettingsDto interface.
 */
export function instanceOfExtensionBucketSettingsDto(value: object): value is ExtensionBucketSettingsDto {
    if (!('title' in value) || value['title'] === undefined) return false;
    if (!('extensionId' in value) || value['extensionId'] === undefined) return false;
    if (!('fileNameExtensions' in value) || value['fileNameExtensions'] === undefined) return false;
    return true;
}

export function ExtensionBucketSettingsDtoFromJSON(json: any): ExtensionBucketSettingsDto {
    return ExtensionBucketSettingsDtoFromJSONTyped(json, false);
}

export function ExtensionBucketSettingsDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): ExtensionBucketSettingsDto {
    if (json == null) {
        return json;
    }
    return {
        
        'title': json['title'],
        'extensionId': json['extensionId'],
        'maxFiles': json['maxFiles'] == null ? undefined : json['maxFiles'],
        'fileNameExtensions': json['fileNameExtensions'],
    };
}

export function ExtensionBucketSettingsDtoToJSON(value?: ExtensionBucketSettingsDto | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'title': value['title'],
        'extensionId': value['extensionId'],
        'maxFiles': value['maxFiles'],
        'fileNameExtensions': value['fileNameExtensions'],
    };
}

