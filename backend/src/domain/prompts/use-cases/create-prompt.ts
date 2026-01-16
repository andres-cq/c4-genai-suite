import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { PromptEntity, PromptRepository } from 'src/domain/database';
import { User } from 'src/domain/users';
import { assignDefined } from 'src/lib';
import { Prompt } from '../interfaces';

export class CreatePrompt {
  constructor(
    public readonly user: User,
    public readonly values: {
      title: string;
      description?: string;
      promptText: string;
    },
  ) {}
}

export class CreatePromptResponse {
  constructor(public readonly prompt: Prompt) {}
}

@CommandHandler(CreatePrompt)
export class CreatePromptHandler implements ICommandHandler<CreatePrompt, CreatePromptResponse> {
  constructor(
    @InjectRepository(PromptEntity)
    private readonly prompts: PromptRepository,
  ) {}

  async execute(command: CreatePrompt): Promise<CreatePromptResponse> {
    const { title, description, promptText } = command.values;
    const { user } = command;

    const entity = this.prompts.create();
    assignDefined(entity, { title, description, promptText, userId: user.id, isFavorite: false });

    const created = await this.prompts.save(entity);
    return new CreatePromptResponse(created);
  }
}
