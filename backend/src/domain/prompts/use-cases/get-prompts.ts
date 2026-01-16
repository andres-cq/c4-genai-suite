import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { PromptEntity, PromptRepository } from 'src/domain/database';
import { User } from 'src/domain/users';
import { Prompt } from '../interfaces';

export class GetPrompts {
  constructor(public readonly user: User) {}
}

export class GetPromptsResponse {
  constructor(public readonly prompts: Prompt[]) {}
}

@QueryHandler(GetPrompts)
export class GetPromptsHandler implements IQueryHandler<GetPrompts, GetPromptsResponse> {
  constructor(
    @InjectRepository(PromptEntity)
    private readonly prompts: PromptRepository,
  ) {}

  async execute(query: GetPrompts): Promise<GetPromptsResponse> {
    const entities = await this.prompts.find({
      where: { userId: query.user.id },
      order: { createdAt: 'DESC' },
    });

    return new GetPromptsResponse(entities);
  }
}
