/* tslint:disable */
/* eslint-disable */
/**
 * FastAPI
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 0.1.0
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
 * @interface FileType
 */
export interface FileType {
    /**
     * The file name extension.
     * @type {string}
     * @memberof FileType
     */
    fileNameExtension: string;
}

/**
 * Check if a given object implements the FileType interface.
 */
export function instanceOfFileType(value: object): value is FileType {
    if (!('fileNameExtension' in value) || value['fileNameExtension'] === undefined) return false;
    return true;
}

export function FileTypeFromJSON(json: any): FileType {
    return FileTypeFromJSONTyped(json, false);
}

export function FileTypeFromJSONTyped(json: any, ignoreDiscriminator: boolean): FileType {
    if (json == null) {
        return json;
    }
    return {
        
        'fileNameExtension': json['file_name_extension'],
    };
}

export function FileTypeToJSON(value?: FileType | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'file_name_extension': value['fileNameExtension'],
    };
}

