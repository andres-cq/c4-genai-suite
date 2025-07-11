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
import type { ExtensionUserInfoDto } from './ExtensionUserInfoDto';
import {
    ExtensionUserInfoDtoFromJSON,
    ExtensionUserInfoDtoFromJSONTyped,
    ExtensionUserInfoDtoToJSON,
} from './ExtensionUserInfoDto';
import type { ChatSuggestionDto } from './ChatSuggestionDto';
import {
    ChatSuggestionDtoFromJSON,
    ChatSuggestionDtoFromJSONTyped,
    ChatSuggestionDtoToJSON,
} from './ChatSuggestionDto';
import type { ExtensionArgumentObjectSpecDto } from './ExtensionArgumentObjectSpecDto';
import {
    ExtensionArgumentObjectSpecDtoFromJSON,
    ExtensionArgumentObjectSpecDtoFromJSONTyped,
    ExtensionArgumentObjectSpecDtoToJSON,
} from './ExtensionArgumentObjectSpecDto';

/**
 * 
 * @export
 * @interface ConfigurationDto
 */
export interface ConfigurationDto {
    /**
     * The ID of the configuration.
     * @type {number}
     * @memberof ConfigurationDto
     */
    id: number;
    /**
     * The name of the configuration.
     * @type {string}
     * @memberof ConfigurationDto
     */
    name: string;
    /**
     * The description of the configuration.
     * @type {string}
     * @memberof ConfigurationDto
     */
    description: string;
    /**
     * Indicates whether the configuration is enabled.
     * @type {boolean}
     * @memberof ConfigurationDto
     */
    enabled: boolean;
    /**
     * The name of the agent.
     * @type {string}
     * @memberof ConfigurationDto
     */
    agentName?: string;
    /**
     * The footer text to be shown below the chat.
     * @type {string}
     * @memberof ConfigurationDto
     */
    chatFooter?: string;
    /**
     * The suggestions to be shown for the chat.
     * @type {Array<ChatSuggestionDto>}
     * @memberof ConfigurationDto
     */
    chatSuggestions?: Array<ChatSuggestionDto>;
    /**
     * The optional executor endpoint.
     * @type {string}
     * @memberof ConfigurationDto
     */
    executorEndpoint?: string;
    /**
     * The optional executor headers.
     * @type {string}
     * @memberof ConfigurationDto
     */
    executorHeaders?: string;
    /**
     * The allowed user groups.
     * @type {Array<string>}
     * @memberof ConfigurationDto
     */
    userGroupsIds?: Array<string>;
    /**
     * Extension information.
     * @type {Array<ExtensionUserInfoDto>}
     * @memberof ConfigurationDto
     */
    extensions?: Array<ExtensionUserInfoDto>;
    /**
     * Configurable arguments.
     * @type {ExtensionArgumentObjectSpecDto}
     * @memberof ConfigurationDto
     */
    configurableArguments?: ExtensionArgumentObjectSpecDto;
}

/**
 * Check if a given object implements the ConfigurationDto interface.
 */
export function instanceOfConfigurationDto(value: object): value is ConfigurationDto {
    if (!('id' in value) || value['id'] === undefined) return false;
    if (!('name' in value) || value['name'] === undefined) return false;
    if (!('description' in value) || value['description'] === undefined) return false;
    if (!('enabled' in value) || value['enabled'] === undefined) return false;
    return true;
}

export function ConfigurationDtoFromJSON(json: any): ConfigurationDto {
    return ConfigurationDtoFromJSONTyped(json, false);
}

export function ConfigurationDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): ConfigurationDto {
    if (json == null) {
        return json;
    }
    return {
        
        'id': json['id'],
        'name': json['name'],
        'description': json['description'],
        'enabled': json['enabled'],
        'agentName': json['agentName'] == null ? undefined : json['agentName'],
        'chatFooter': json['chatFooter'] == null ? undefined : json['chatFooter'],
        'chatSuggestions': json['chatSuggestions'] == null ? undefined : ((json['chatSuggestions'] as Array<any>).map(ChatSuggestionDtoFromJSON)),
        'executorEndpoint': json['executorEndpoint'] == null ? undefined : json['executorEndpoint'],
        'executorHeaders': json['executorHeaders'] == null ? undefined : json['executorHeaders'],
        'userGroupsIds': json['userGroupsIds'] == null ? undefined : json['userGroupsIds'],
        'extensions': json['extensions'] == null ? undefined : ((json['extensions'] as Array<any>).map(ExtensionUserInfoDtoFromJSON)),
        'configurableArguments': json['configurableArguments'] == null ? undefined : ExtensionArgumentObjectSpecDtoFromJSON(json['configurableArguments']),
    };
}

export function ConfigurationDtoToJSON(value?: ConfigurationDto | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'id': value['id'],
        'name': value['name'],
        'description': value['description'],
        'enabled': value['enabled'],
        'agentName': value['agentName'],
        'chatFooter': value['chatFooter'],
        'chatSuggestions': value['chatSuggestions'] == null ? undefined : ((value['chatSuggestions'] as Array<any>).map(ChatSuggestionDtoToJSON)),
        'executorEndpoint': value['executorEndpoint'],
        'executorHeaders': value['executorHeaders'],
        'userGroupsIds': value['userGroupsIds'],
        'extensions': value['extensions'] == null ? undefined : ((value['extensions'] as Array<any>).map(ExtensionUserInfoDtoToJSON)),
        'configurableArguments': ExtensionArgumentObjectSpecDtoToJSON(value['configurableArguments']),
    };
}

