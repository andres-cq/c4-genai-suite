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
/**
 * 
 * @export
 * @interface ExecuteResponseDto
 */
export interface ExecuteResponseDto {
    /**
     * The result of the tool.
     * @type {string}
     * @memberof ExecuteResponseDto
     */
    result: string;
    /**
     * The debug information.
     * @type {string}
     * @memberof ExecuteResponseDto
     */
    debug?: string;
}

/**
 * Check if a given object implements the ExecuteResponseDto interface.
 */
export function instanceOfExecuteResponseDto(value: object): value is ExecuteResponseDto {
    if (!('result' in value) || value['result'] === undefined) return false;
    return true;
}

export function ExecuteResponseDtoFromJSON(json: any): ExecuteResponseDto {
    return ExecuteResponseDtoFromJSONTyped(json, false);
}

export function ExecuteResponseDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): ExecuteResponseDto {
    if (json == null) {
        return json;
    }
    return {
        
        'result': json['result'],
        'debug': json['debug'] == null ? undefined : json['debug'],
    };
}

export function ExecuteResponseDtoToJSON(value?: ExecuteResponseDto | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'result': value['result'],
        'debug': value['debug'],
    };
}

