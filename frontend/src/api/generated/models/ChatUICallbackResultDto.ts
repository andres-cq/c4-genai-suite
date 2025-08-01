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
 * @interface ChatUICallbackResultDto
 */
export interface ChatUICallbackResultDto {
    /**
     * The action taken in the form.
     * @type {string}
     * @memberof ChatUICallbackResultDto
     */
    action: ChatUICallbackResultDtoActionEnum;
    /**
     * Additional data related to the action.
     * @type {object}
     * @memberof ChatUICallbackResultDto
     */
    data?: object;
}


/**
 * @export
 */
export const ChatUICallbackResultDtoActionEnum = {
    Accept: 'accept',
    Reject: 'reject',
    Cancel: 'cancel'
} as const;
export type ChatUICallbackResultDtoActionEnum = typeof ChatUICallbackResultDtoActionEnum[keyof typeof ChatUICallbackResultDtoActionEnum];


/**
 * Check if a given object implements the ChatUICallbackResultDto interface.
 */
export function instanceOfChatUICallbackResultDto(value: object): value is ChatUICallbackResultDto {
    if (!('action' in value) || value['action'] === undefined) return false;
    return true;
}

export function ChatUICallbackResultDtoFromJSON(json: any): ChatUICallbackResultDto {
    return ChatUICallbackResultDtoFromJSONTyped(json, false);
}

export function ChatUICallbackResultDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): ChatUICallbackResultDto {
    if (json == null) {
        return json;
    }
    return {
        
        'action': json['action'],
        'data': json['data'] == null ? undefined : json['data'],
    };
}

export function ChatUICallbackResultDtoToJSON(value?: ChatUICallbackResultDto | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'action': value['action'],
        'data': value['data'],
    };
}

