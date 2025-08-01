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
import type { UserGroupDto } from './UserGroupDto';
import {
    UserGroupDtoFromJSON,
    UserGroupDtoFromJSONTyped,
    UserGroupDtoToJSON,
} from './UserGroupDto';

/**
 * 
 * @export
 * @interface UserGroupsDto
 */
export interface UserGroupsDto {
    /**
     * The user groups.
     * @type {Array<UserGroupDto>}
     * @memberof UserGroupsDto
     */
    items: Array<UserGroupDto>;
}

/**
 * Check if a given object implements the UserGroupsDto interface.
 */
export function instanceOfUserGroupsDto(value: object): value is UserGroupsDto {
    if (!('items' in value) || value['items'] === undefined) return false;
    return true;
}

export function UserGroupsDtoFromJSON(json: any): UserGroupsDto {
    return UserGroupsDtoFromJSONTyped(json, false);
}

export function UserGroupsDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): UserGroupsDto {
    if (json == null) {
        return json;
    }
    return {
        
        'items': ((json['items'] as Array<any>).map(UserGroupDtoFromJSON)),
    };
}

export function UserGroupsDtoToJSON(value?: UserGroupsDto | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'items': ((value['items'] as Array<any>).map(UserGroupDtoToJSON)),
    };
}

