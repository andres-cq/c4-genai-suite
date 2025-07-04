import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { In } from 'typeorm';
import { ConfigurationEntity, ConfigurationRepository, UserGroupEntity, UserGroupRepository } from 'src/domain/database';
import { assignDefined } from 'src/lib';
import { ConfigurationModel } from '../interfaces';
import { buildConfiguration } from './utils';

type Values = Partial<
  Pick<
    ConfigurationModel,
    | 'agentName'
    | 'chatFooter'
    | 'chatSuggestions'
    | 'enabled'
    | 'executorEndpoint'
    | 'executorHeaders'
    | 'name'
    | 'description'
    | 'userGroupsIds'
  >
>;

export class UpdateConfiguration {
  constructor(
    public readonly id: number,
    public readonly values: Values,
  ) {}
}

export class UpdateConfigurationResponse {
  constructor(public readonly configuration: ConfigurationModel) {}
}

@CommandHandler(UpdateConfiguration)
export class UpdateConfigurationHandler implements ICommandHandler<UpdateConfiguration, UpdateConfigurationResponse> {
  constructor(
    @InjectRepository(ConfigurationEntity)
    private readonly configurations: ConfigurationRepository,
    @InjectRepository(UserGroupEntity)
    private readonly userGroups: UserGroupRepository,
  ) {}

  async execute(command: UpdateConfiguration): Promise<any> {
    const { id, values } = command;
    const {
      agentName,
      chatFooter,
      chatSuggestions,
      enabled,
      executorEndpoint,
      executorHeaders,
      name,
      description,
      userGroupsIds,
    } = values;

    const entity = await this.configurations.findOne({
      where: { id },
      relations: {
        userGroups: true,
      },
    });

    if (!entity) {
      throw new NotFoundException();
    }

    if (userGroupsIds) {
      entity.userGroups = await this.userGroups.findBy({ id: In(userGroupsIds) });
    }

    // Assign the object manually to avoid updating unexpected values.
    assignDefined(entity, {
      agentName,
      chatFooter,
      chatSuggestions,
      enabled,
      executorEndpoint,
      executorHeaders,
      name,
      description,
    });

    // Use the save method otherwise we would not get previous values.
    const updated = await this.configurations.save(entity);
    const result = await buildConfiguration(updated);

    return new UpdateConfigurationResponse(result);
  }
}
