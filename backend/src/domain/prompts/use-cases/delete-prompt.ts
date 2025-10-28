import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { PromptEntity } from '../../database/entities';

export class DeletePromptCommand {
  constructor(
    public readonly id: number,
    public readonly userId: string,
  ) {}
}

@CommandHandler(DeletePromptCommand)
export class DeletePromptHandler implements ICommandHandler<DeletePromptCommand> {
  constructor(
    @InjectRepository(PromptEntity)
    private readonly promptRepository: Repository<PromptEntity>,
  ) {}

  async execute(command: DeletePromptCommand): Promise<void> {
    // Get prompt
    const prompt = await this.promptRepository.findOne({
      where: { id: command.id },
    });

    if (!prompt) {
      throw new BadRequestException(`Prompt with ID ${command.id} not found`);
    }

    // Check ownership
    if (prompt.createdById !== command.userId) {
      throw new ForbiddenException('You can only delete your own prompts');
    }

    // Delete prompt
    await this.promptRepository.remove(prompt);
  }
}
