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
  BucketAvailabilityDto,
  ConfigurationDto,
  ConfigurationUserValuesDto,
  ConfigurationsDto,
  CreateExtensionDto,
  ExtensionDto,
  ExtensionsDto,
  TestExtensionDto,
  UpdateExtensionDto,
  UpsertConfigurationDto,
} from '../models/index';
import {
    BucketAvailabilityDtoFromJSON,
    BucketAvailabilityDtoToJSON,
    ConfigurationDtoFromJSON,
    ConfigurationDtoToJSON,
    ConfigurationUserValuesDtoFromJSON,
    ConfigurationUserValuesDtoToJSON,
    ConfigurationsDtoFromJSON,
    ConfigurationsDtoToJSON,
    CreateExtensionDtoFromJSON,
    CreateExtensionDtoToJSON,
    ExtensionDtoFromJSON,
    ExtensionDtoToJSON,
    ExtensionsDtoFromJSON,
    ExtensionsDtoToJSON,
    TestExtensionDtoFromJSON,
    TestExtensionDtoToJSON,
    UpdateExtensionDtoFromJSON,
    UpdateExtensionDtoToJSON,
    UpsertConfigurationDtoFromJSON,
    UpsertConfigurationDtoToJSON,
} from '../models/index';

export interface DeleteConfigurationRequest {
    id: number;
}

export interface DeleteExtensionRequest {
    id: number;
    extensionId: number;
}

export interface DuplicateConfigurationRequest {
    id: number;
}

export interface GetBucketAvailabilityRequest {
    id: number;
    type: GetBucketAvailabilityTypeEnum;
}

export interface GetConfigurationRequest {
    id: number;
}

export interface GetConfigurationUserValuesRequest {
    id: number;
}

export interface GetConfigurationsRequest {
    enabled?: boolean;
}

export interface GetExtensionsRequest {
    id: number;
}

export interface PostConfigurationRequest {
    upsertConfigurationDto: UpsertConfigurationDto;
}

export interface PostExtensionRequest {
    id: number;
    createExtensionDto: CreateExtensionDto;
}

export interface PutConfigurationRequest {
    id: number;
    upsertConfigurationDto: UpsertConfigurationDto;
}

export interface PutExtensionRequest {
    id: number;
    extensionId: number;
    updateExtensionDto: UpdateExtensionDto;
}

export interface RebuildExtensionRequest {
    testExtensionDto: TestExtensionDto;
}

export interface TestExtensionRequest {
    testExtensionDto: TestExtensionDto;
}

export interface UpdateConfigurationUserValuesRequest {
    id: number;
    configurationUserValuesDto: ConfigurationUserValuesDto;
}

/**
 * 
 */
export class ExtensionsApi extends runtime.BaseAPI {

    /**
     * Deletes a configuration.
     * 
     */
    async deleteConfigurationRaw(requestParameters: DeleteConfigurationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling deleteConfiguration().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/configurations/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id']))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Deletes a configuration.
     * 
     */
    async deleteConfiguration(id: number, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteConfigurationRaw({ id: id }, initOverrides);
    }

    /**
     * Deletes an extension.
     * 
     */
    async deleteExtensionRaw(requestParameters: DeleteExtensionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling deleteExtension().'
            );
        }

        if (requestParameters['extensionId'] == null) {
            throw new runtime.RequiredError(
                'extensionId',
                'Required parameter "extensionId" was null or undefined when calling deleteExtension().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/configurations/{id}/extensions/{extensionId}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id']))).replace(`{${"extensionId"}}`, encodeURIComponent(String(requestParameters['extensionId']))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Deletes an extension.
     * 
     */
    async deleteExtension(id: number, extensionId: number, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteExtensionRaw({ id: id, extensionId: extensionId }, initOverrides);
    }

    /**
     * Duplicate a configuration.
     * 
     */
    async duplicateConfigurationRaw(requestParameters: DuplicateConfigurationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ConfigurationDto>> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling duplicateConfiguration().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/configurations/duplicate/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id']))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ConfigurationDtoFromJSON(jsonValue));
    }

    /**
     * Duplicate a configuration.
     * 
     */
    async duplicateConfiguration(id: number, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ConfigurationDto> {
        const response = await this.duplicateConfigurationRaw({ id: id }, initOverrides);
        return await response.value();
    }

    /**
     * Checks if this configuration has a user or conversation bucket and if yes by which extension it is provided.
     * 
     */
    async getBucketAvailabilityRaw(requestParameters: GetBucketAvailabilityRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<BucketAvailabilityDto>> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling getBucketAvailability().'
            );
        }

        if (requestParameters['type'] == null) {
            throw new runtime.RequiredError(
                'type',
                'Required parameter "type" was null or undefined when calling getBucketAvailability().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/configurations/{id}/checkBucketAvailability/{type}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id']))).replace(`{${"type"}}`, encodeURIComponent(String(requestParameters['type']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => BucketAvailabilityDtoFromJSON(jsonValue));
    }

    /**
     * Checks if this configuration has a user or conversation bucket and if yes by which extension it is provided.
     * 
     */
    async getBucketAvailability(id: number, type: GetBucketAvailabilityTypeEnum, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<BucketAvailabilityDto> {
        const response = await this.getBucketAvailabilityRaw({ id: id, type: type }, initOverrides);
        return await response.value();
    }

    /**
     * Gets a configuration with the given id.
     * 
     */
    async getConfigurationRaw(requestParameters: GetConfigurationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ConfigurationDto>> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling getConfiguration().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/configurations/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ConfigurationDtoFromJSON(jsonValue));
    }

    /**
     * Gets a configuration with the given id.
     * 
     */
    async getConfiguration(id: number, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ConfigurationDto> {
        const response = await this.getConfigurationRaw({ id: id }, initOverrides);
        return await response.value();
    }

    /**
     * Gets the user configured values.
     * 
     */
    async getConfigurationUserValuesRaw(requestParameters: GetConfigurationUserValuesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ConfigurationUserValuesDto>> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling getConfigurationUserValues().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/configurations/{id}/user-values`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ConfigurationUserValuesDtoFromJSON(jsonValue));
    }

    /**
     * Gets the user configured values.
     * 
     */
    async getConfigurationUserValues(id: number, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ConfigurationUserValuesDto> {
        const response = await this.getConfigurationUserValuesRaw({ id: id }, initOverrides);
        return await response.value();
    }

    /**
     * Gets the configured and available extensions.
     * 
     */
    async getConfigurationsRaw(requestParameters: GetConfigurationsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ConfigurationsDto>> {
        const queryParameters: any = {};

        if (requestParameters['enabled'] != null) {
            queryParameters['enabled'] = requestParameters['enabled'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/configurations`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ConfigurationsDtoFromJSON(jsonValue));
    }

    /**
     * Gets the configured and available extensions.
     * 
     */
    async getConfigurations(enabled?: boolean, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ConfigurationsDto> {
        const response = await this.getConfigurationsRaw({ enabled: enabled }, initOverrides);
        return await response.value();
    }

    /**
     * Gets the configured and available extensions.
     * 
     */
    async getExtensionsRaw(requestParameters: GetExtensionsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ExtensionsDto>> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling getExtensions().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/configurations/{id}/extensions`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ExtensionsDtoFromJSON(jsonValue));
    }

    /**
     * Gets the configured and available extensions.
     * 
     */
    async getExtensions(id: number, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ExtensionsDto> {
        const response = await this.getExtensionsRaw({ id: id }, initOverrides);
        return await response.value();
    }

    /**
     * Creates a configuration.
     * 
     */
    async postConfigurationRaw(requestParameters: PostConfigurationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ConfigurationDto>> {
        if (requestParameters['upsertConfigurationDto'] == null) {
            throw new runtime.RequiredError(
                'upsertConfigurationDto',
                'Required parameter "upsertConfigurationDto" was null or undefined when calling postConfiguration().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/configurations`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: UpsertConfigurationDtoToJSON(requestParameters['upsertConfigurationDto']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ConfigurationDtoFromJSON(jsonValue));
    }

    /**
     * Creates a configuration.
     * 
     */
    async postConfiguration(upsertConfigurationDto: UpsertConfigurationDto, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ConfigurationDto> {
        const response = await this.postConfigurationRaw({ upsertConfigurationDto: upsertConfigurationDto }, initOverrides);
        return await response.value();
    }

    /**
     * Creates an extension.
     * 
     */
    async postExtensionRaw(requestParameters: PostExtensionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ExtensionDto>> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling postExtension().'
            );
        }

        if (requestParameters['createExtensionDto'] == null) {
            throw new runtime.RequiredError(
                'createExtensionDto',
                'Required parameter "createExtensionDto" was null or undefined when calling postExtension().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/configurations/{id}/extensions`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id']))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateExtensionDtoToJSON(requestParameters['createExtensionDto']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ExtensionDtoFromJSON(jsonValue));
    }

    /**
     * Creates an extension.
     * 
     */
    async postExtension(id: number, createExtensionDto: CreateExtensionDto, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ExtensionDto> {
        const response = await this.postExtensionRaw({ id: id, createExtensionDto: createExtensionDto }, initOverrides);
        return await response.value();
    }

    /**
     * Updates an extension.
     * 
     */
    async putConfigurationRaw(requestParameters: PutConfigurationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ConfigurationDto>> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling putConfiguration().'
            );
        }

        if (requestParameters['upsertConfigurationDto'] == null) {
            throw new runtime.RequiredError(
                'upsertConfigurationDto',
                'Required parameter "upsertConfigurationDto" was null or undefined when calling putConfiguration().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/configurations/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id']))),
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: UpsertConfigurationDtoToJSON(requestParameters['upsertConfigurationDto']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ConfigurationDtoFromJSON(jsonValue));
    }

    /**
     * Updates an extension.
     * 
     */
    async putConfiguration(id: number, upsertConfigurationDto: UpsertConfigurationDto, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ConfigurationDto> {
        const response = await this.putConfigurationRaw({ id: id, upsertConfigurationDto: upsertConfigurationDto }, initOverrides);
        return await response.value();
    }

    /**
     * Updates an extension.
     * 
     */
    async putExtensionRaw(requestParameters: PutExtensionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ExtensionDto>> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling putExtension().'
            );
        }

        if (requestParameters['extensionId'] == null) {
            throw new runtime.RequiredError(
                'extensionId',
                'Required parameter "extensionId" was null or undefined when calling putExtension().'
            );
        }

        if (requestParameters['updateExtensionDto'] == null) {
            throw new runtime.RequiredError(
                'updateExtensionDto',
                'Required parameter "updateExtensionDto" was null or undefined when calling putExtension().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/configurations/{id}/extensions/{extensionId}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id']))).replace(`{${"extensionId"}}`, encodeURIComponent(String(requestParameters['extensionId']))),
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: UpdateExtensionDtoToJSON(requestParameters['updateExtensionDto']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ExtensionDtoFromJSON(jsonValue));
    }

    /**
     * Updates an extension.
     * 
     */
    async putExtension(id: number, extensionId: number, updateExtensionDto: UpdateExtensionDto, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ExtensionDto> {
        const response = await this.putExtensionRaw({ id: id, extensionId: extensionId, updateExtensionDto: updateExtensionDto }, initOverrides);
        return await response.value();
    }

    /**
     * Rebuilds an extension.
     * 
     */
    async rebuildExtensionRaw(requestParameters: RebuildExtensionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ExtensionDto>> {
        if (requestParameters['testExtensionDto'] == null) {
            throw new runtime.RequiredError(
                'testExtensionDto',
                'Required parameter "testExtensionDto" was null or undefined when calling rebuildExtension().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/extensions/rebuild`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: TestExtensionDtoToJSON(requestParameters['testExtensionDto']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ExtensionDtoFromJSON(jsonValue));
    }

    /**
     * Rebuilds an extension.
     * 
     */
    async rebuildExtension(testExtensionDto: TestExtensionDto, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ExtensionDto> {
        const response = await this.rebuildExtensionRaw({ testExtensionDto: testExtensionDto }, initOverrides);
        return await response.value();
    }

    /**
     * Tests an extension.
     * 
     */
    async testExtensionRaw(requestParameters: TestExtensionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters['testExtensionDto'] == null) {
            throw new runtime.RequiredError(
                'testExtensionDto',
                'Required parameter "testExtensionDto" was null or undefined when calling testExtension().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/extensions/test`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: TestExtensionDtoToJSON(requestParameters['testExtensionDto']),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Tests an extension.
     * 
     */
    async testExtension(testExtensionDto: TestExtensionDto, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.testExtensionRaw({ testExtensionDto: testExtensionDto }, initOverrides);
    }

    /**
     * Updates the user configured values.
     * 
     */
    async updateConfigurationUserValuesRaw(requestParameters: UpdateConfigurationUserValuesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ConfigurationUserValuesDto>> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling updateConfigurationUserValues().'
            );
        }

        if (requestParameters['configurationUserValuesDto'] == null) {
            throw new runtime.RequiredError(
                'configurationUserValuesDto',
                'Required parameter "configurationUserValuesDto" was null or undefined when calling updateConfigurationUserValues().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/configurations/{id}/user-values`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id']))),
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: ConfigurationUserValuesDtoToJSON(requestParameters['configurationUserValuesDto']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ConfigurationUserValuesDtoFromJSON(jsonValue));
    }

    /**
     * Updates the user configured values.
     * 
     */
    async updateConfigurationUserValues(id: number, configurationUserValuesDto: ConfigurationUserValuesDto, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ConfigurationUserValuesDto> {
        const response = await this.updateConfigurationUserValuesRaw({ id: id, configurationUserValuesDto: configurationUserValuesDto }, initOverrides);
        return await response.value();
    }

}

/**
 * @export
 */
export const GetBucketAvailabilityTypeEnum = {
    User: 'user',
    Conversation: 'conversation'
} as const;
export type GetBucketAvailabilityTypeEnum = typeof GetBucketAvailabilityTypeEnum[keyof typeof GetBucketAvailabilityTypeEnum];
