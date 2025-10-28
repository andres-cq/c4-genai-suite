import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { PromptEntity } from '../../database/entities';

export class IncrementUsageCommand {
  constructor(public readonly promptId: number) {}
}

@CommandHandler(IncrementUsageCommand)
export class IncrementUsageHandler implements ICommandHandler<IncrementUsageCommand> {
  constructor(
    @InjectRepository(PromptEntity)
    private readonly promptRepository: Repository<PromptEntity>,
  ) {}

  async execute(command: IncrementUsageCommand): Promise<void> {
    const prompt = await this.promptRepository.findOne({
      where: { id: command.promptId },
    });

    if (!prompt) {
      throw new BadRequestException(`Prompt with ID ${command.promptId} not found`);
    }

    prompt.usageCount += 1;
    await this.promptRepository.save(prompt);
  }
}
