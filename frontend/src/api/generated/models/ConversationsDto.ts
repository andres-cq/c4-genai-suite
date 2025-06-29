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
import type { ConversationDto } from './ConversationDto';
import {
    ConversationDtoFromJSON,
    ConversationDtoFromJSONTyped,
    ConversationDtoToJSON,
} from './ConversationDto';

/**
 * 
 * @export
 * @interface ConversationsDto
 */
export interface ConversationsDto {
    /**
     * The conversations.
     * @type {Array<ConversationDto>}
     * @memberof ConversationsDto
     */
    items: Array<ConversationDto>;
}

/**
 * Check if a given object implements the ConversationsDto interface.
 */
export function instanceOfConversationsDto(value: object): value is ConversationsDto {
    if (!('items' in value) || value['items'] === undefined) return false;
    return true;
}

export function ConversationsDtoFromJSON(json: any): ConversationsDto {
    return ConversationsDtoFromJSONTyped(json, false);
}

export function ConversationsDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): ConversationsDto {
    if (json == null) {
        return json;
    }
    return {
        
        'items': ((json['items'] as Array<any>).map(ConversationDtoFromJSON)),
    };
}

export function ConversationsDtoToJSON(value?: ConversationsDto | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'items': ((value['items'] as Array<any>).map(ConversationDtoToJSON)),
    };
}

