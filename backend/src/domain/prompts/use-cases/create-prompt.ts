import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { PromptEntity, PromptCategoryEntity } from '../../database/entities';
import { PromptModel } from '../interfaces';

export class CreatePromptCommand {
  constructor(
    public readonly title: string,
    public readonly content: string,
    public readonly description: string | undefined,
    public readonly categoryId: number | undefined,
    public readonly isGlobal: boolean,
    public readonly createdById: string,
  ) {}
}

@CommandHandler(CreatePromptCommand)
export class CreatePromptHandler implements ICommandHandler<CreatePromptCommand> {
  constructor(
    @InjectRepository(PromptEntity)
    private readonly promptRepository: Repository<PromptEntity>,
    @InjectRepository(PromptCategoryEntity)
    private readonly categoryRepository: Repository<PromptCategoryEntity>,
  ) {}

  async execute(command: CreatePromptCommand): Promise<PromptModel> {
    // Validate category exists if provided
    if (command.categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: command.categoryId },
      });
      if (!category) {
        throw new BadRequestException(`Category with ID ${command.categoryId} not found`);
      }
    }

    // Create prompt
    const prompt = this.promptRepository.create({
      title: command.title,
      content: command.content,
      description: command.description,
      categoryId: command.categoryId,
      isGlobal: command.isGlobal,
      createdById: command.createdById,
    });

    const savedPrompt = await this.promptRepository.save(prompt);

    // Load with relations
    return this.promptRepository.findOneOrFail({
      where: { id: savedPrompt.id },
      relations: ['category'],
    });
  }
}
