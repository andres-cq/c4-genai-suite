import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { PromptEntity, PromptRepository } from 'src/domain/database';
import { User } from 'src/domain/users';

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
  constructor(public readonly prompt: PromptEntity) {}
}

@CommandHandler(CreatePrompt)
export class CreatePromptHandler implements ICommandHandler<CreatePrompt, CreatePromptResponse> {
  constructor(
    @InjectRepository(PromptEntity)
    private readonly prompts: PromptRepository,
  ) {}

  async execute(command: CreatePrompt): Promise<CreatePromptResponse> {
    const entity = this.prompts.create({
      title: command.values.title,
      description: command.values.description,
      promptText: command.values.promptText,
      userId: command.user.id,
      isFavorite: false,
    });

    const created = await this.prompts.save(entity);
    return new CreatePromptResponse(created);
  }
}
