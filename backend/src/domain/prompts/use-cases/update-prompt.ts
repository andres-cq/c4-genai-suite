import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { PromptEntity, PromptCategoryEntity } from '../../database/entities';
import { PromptModel } from '../interfaces';

export class UpdatePromptCommand {
  constructor(
    public readonly id: number,
    public readonly userId: string,
    public readonly title?: string,
    public readonly content?: string,
    public readonly description?: string,
    public readonly categoryId?: number,
  ) {}
}

@CommandHandler(UpdatePromptCommand)
export class UpdatePromptHandler implements ICommandHandler<UpdatePromptCommand> {
  constructor(
    @InjectRepository(PromptEntity)
    private readonly promptRepository: Repository<PromptEntity>,
    @InjectRepository(PromptCategoryEntity)
    private readonly categoryRepository: Repository<PromptCategoryEntity>,
  ) {}

  async execute(command: UpdatePromptCommand): Promise<PromptModel> {
    // Get prompt
    const prompt = await this.promptRepository.findOne({
      where: { id: command.id },
      relations: ['category'],
    });

    if (!prompt) {
      throw new BadRequestException(`Prompt with ID ${command.id} not found`);
    }

    // Check ownership
    if (prompt.createdById !== command.userId) {
      throw new ForbiddenException('You can only update your own prompts');
    }

    // Validate category exists if provided
    if (command.categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: command.categoryId },
      });
      if (!category) {
        throw new BadRequestException(`Category with ID ${command.categoryId} not found`);
      }
    }

    // Update fields
    if (command.title !== undefined) prompt.title = command.title;
    if (command.content !== undefined) prompt.content = command.content;
    if (command.description !== undefined) prompt.description = command.description;
    if (command.categoryId !== undefined) prompt.categoryId = command.categoryId;

    const updated = await this.promptRepository.save(prompt);

    // Reload with relations
    return this.promptRepository.findOneOrFail({
      where: { id: updated.id },
      relations: ['category'],
    });
  }
}
