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
 * @interface ImageUrlDto
 */
export interface ImageUrlDto {
    /**
     * The image URL. Usually a base64 encoded image.
     * @type {string}
     * @memberof ImageUrlDto
     */
    url: string;
}

/**
 * Check if a given object implements the ImageUrlDto interface.
 */
export function instanceOfImageUrlDto(value: object): value is ImageUrlDto {
    if (!('url' in value) || value['url'] === undefined) return false;
    return true;
}

export function ImageUrlDtoFromJSON(json: any): ImageUrlDto {
    return ImageUrlDtoFromJSONTyped(json, false);
}

export function ImageUrlDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): ImageUrlDto {
    if (json == null) {
        return json;
    }
    return {
        
        'url': json['url'],
    };
}

export function ImageUrlDtoToJSON(value?: ImageUrlDto | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'url': value['url'],
    };
}

