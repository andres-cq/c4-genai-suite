import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { UserGroupEntity, UserGroupRepository } from 'src/domain/database';
import { UserGroup } from '../interfaces';
import { buildUserGroup } from './utils';

export class GetUserGroups {
  constructor() {}
}

export class GetUserGroupsResponse {
  constructor(public readonly userGroups: UserGroup[]) {}
}

@QueryHandler(GetUserGroups)
export class GetUserGroupsHandler implements IQueryHandler<GetUserGroups, GetUserGroupsResponse> {
  constructor(
    @InjectRepository(UserGroupEntity)
    private readonly userGroups: UserGroupRepository,
  ) {}

  async execute(): Promise<GetUserGroupsResponse> {
    const entity = await this.userGroups.find();
    const result = entity.map(buildUserGroup);

    return new GetUserGroupsResponse(result);
  }
}
