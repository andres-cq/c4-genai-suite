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


import * as runtime from '../runtime';
import type {
  UpsertUserDto,
  UpsertUserGroupDto,
  UserDto,
  UserGroupDto,
  UserGroupsDto,
  UsersDto,
} from '../models/index';
import {
    UpsertUserDtoFromJSON,
    UpsertUserDtoToJSON,
    UpsertUserGroupDtoFromJSON,
    UpsertUserGroupDtoToJSON,
    UserDtoFromJSON,
    UserDtoToJSON,
    UserGroupDtoFromJSON,
    UserGroupDtoToJSON,
    UserGroupsDtoFromJSON,
    UserGroupsDtoToJSON,
    UsersDtoFromJSON,
    UsersDtoToJSON,
} from '../models/index';

export interface DeleteUserRequest {
    id: string;
}

export interface DeleteUserGroupRequest {
    id: string;
}

export interface GetUserRequest {
    id: string;
}

export interface GetUsersRequest {
    page?: number;
    pageSize?: number;
    query?: string;
}

export interface PostUserRequest {
    upsertUserDto: UpsertUserDto;
}

export interface PostUserGroupRequest {
    upsertUserGroupDto: UpsertUserGroupDto;
}

export interface PutUserRequest {
    id: string;
    upsertUserDto: UpsertUserDto;
}

export interface PutUserGroupRequest {
    id: string;
    upsertUserGroupDto: UpsertUserGroupDto;
}

/**
 * 
 */
export class UsersApi extends runtime.BaseAPI {

    /**
     * Deletes an user.
     * 
     */
    async deleteUserRaw(requestParameters: DeleteUserRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling deleteUser().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/users/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id']))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Deletes an user.
     * 
     */
    async deleteUser(id: string, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteUserRaw({ id: id }, initOverrides);
    }

    /**
     * Deletes an user group.
     * 
     */
    async deleteUserGroupRaw(requestParameters: DeleteUserGroupRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling deleteUserGroup().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/user-groups/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id']))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Deletes an user group.
     * 
     */
    async deleteUserGroup(id: string, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteUserGroupRaw({ id: id }, initOverrides);
    }

    /**
     * Get the user.
     * 
     */
    async getUserRaw(requestParameters: GetUserRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<UserDto>> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling getUser().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/users/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => UserDtoFromJSON(jsonValue));
    }

    /**
     * Get the user.
     * 
     */
    async getUser(id: string, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<UserDto> {
        const response = await this.getUserRaw({ id: id }, initOverrides);
        return await response.value();
    }

    /**
     * Gets the user groups.
     * 
     */
    async getUserGroupsRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<UserGroupsDto>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/user-groups`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => UserGroupsDtoFromJSON(jsonValue));
    }

    /**
     * Gets the user groups.
     * 
     */
    async getUserGroups(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<UserGroupsDto> {
        const response = await this.getUserGroupsRaw(initOverrides);
        return await response.value();
    }

    /**
     * Gets the users.
     * 
     */
    async getUsersRaw(requestParameters: GetUsersRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<UsersDto>> {
        const queryParameters: any = {};

        if (requestParameters['page'] != null) {
            queryParameters['page'] = requestParameters['page'];
        }

        if (requestParameters['pageSize'] != null) {
            queryParameters['pageSize'] = requestParameters['pageSize'];
        }

        if (requestParameters['query'] != null) {
            queryParameters['query'] = requestParameters['query'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/users`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => UsersDtoFromJSON(jsonValue));
    }

    /**
     * Gets the users.
     * 
     */
    async getUsers(page?: number, pageSize?: number, query?: string, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<UsersDto> {
        const response = await this.getUsersRaw({ page: page, pageSize: pageSize, query: query }, initOverrides);
        return await response.value();
    }

    /**
     * Creates a user.
     * 
     */
    async postUserRaw(requestParameters: PostUserRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<UserDto>> {
        if (requestParameters['upsertUserDto'] == null) {
            throw new runtime.RequiredError(
                'upsertUserDto',
                'Required parameter "upsertUserDto" was null or undefined when calling postUser().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/users`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: UpsertUserDtoToJSON(requestParameters['upsertUserDto']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => UserDtoFromJSON(jsonValue));
    }

    /**
     * Creates a user.
     * 
     */
    async postUser(upsertUserDto: UpsertUserDto, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<UserDto> {
        const response = await this.postUserRaw({ upsertUserDto: upsertUserDto }, initOverrides);
        return await response.value();
    }

    /**
     * Creates a user group.
     * 
     */
    async postUserGroupRaw(requestParameters: PostUserGroupRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<UserGroupDto>> {
        if (requestParameters['upsertUserGroupDto'] == null) {
            throw new runtime.RequiredError(
                'upsertUserGroupDto',
                'Required parameter "upsertUserGroupDto" was null or undefined when calling postUserGroup().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/user-groups`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: UpsertUserGroupDtoToJSON(requestParameters['upsertUserGroupDto']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => UserGroupDtoFromJSON(jsonValue));
    }

    /**
     * Creates a user group.
     * 
     */
    async postUserGroup(upsertUserGroupDto: UpsertUserGroupDto, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<UserGroupDto> {
        const response = await this.postUserGroupRaw({ upsertUserGroupDto: upsertUserGroupDto }, initOverrides);
        return await response.value();
    }

    /**
     * Updates the user.
     * 
     */
    async putUserRaw(requestParameters: PutUserRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<UserDto>> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling putUser().'
            );
        }

        if (requestParameters['upsertUserDto'] == null) {
            throw new runtime.RequiredError(
                'upsertUserDto',
                'Required parameter "upsertUserDto" was null or undefined when calling putUser().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/users/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id']))),
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: UpsertUserDtoToJSON(requestParameters['upsertUserDto']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => UserDtoFromJSON(jsonValue));
    }

    /**
     * Updates the user.
     * 
     */
    async putUser(id: string, upsertUserDto: UpsertUserDto, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<UserDto> {
        const response = await this.putUserRaw({ id: id, upsertUserDto: upsertUserDto }, initOverrides);
        return await response.value();
    }

    /**
     * Updates the user group.
     * 
     */
    async putUserGroupRaw(requestParameters: PutUserGroupRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<UserGroupDto>> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling putUserGroup().'
            );
        }

        if (requestParameters['upsertUserGroupDto'] == null) {
            throw new runtime.RequiredError(
                'upsertUserGroupDto',
                'Required parameter "upsertUserGroupDto" was null or undefined when calling putUserGroup().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/user-groups/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id']))),
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: UpsertUserGroupDtoToJSON(requestParameters['upsertUserGroupDto']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => UserGroupDtoFromJSON(jsonValue));
    }

    /**
     * Updates the user group.
     * 
     */
    async putUserGroup(id: string, upsertUserGroupDto: UpsertUserGroupDto, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<UserGroupDto> {
        const response = await this.putUserGroupRaw({ id: id, upsertUserGroupDto: upsertUserGroupDto }, initOverrides);
        return await response.value();
    }

}
