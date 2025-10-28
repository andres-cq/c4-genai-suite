import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { PromptCategoryEntity } from '../../database/entities';
import { PromptCategoryModel } from '../interfaces';

export class CreateCategoryCommand {
  constructor(
    public readonly name: string,
    public readonly description?: string,
  ) {}
}

@CommandHandler(CreateCategoryCommand)
export class CreateCategoryHandler implements ICommandHandler<CreateCategoryCommand> {
  constructor(
    @InjectRepository(PromptCategoryEntity)
    private readonly categoryRepository: Repository<PromptCategoryEntity>,
  ) {}

  async execute(command: CreateCategoryCommand): Promise<PromptCategoryModel> {
    // Check if category already exists
    const existing = await this.categoryRepository.findOne({
      where: { name: command.name },
    });

    if (existing) {
      throw new BadRequestException(`Category with name "${command.name}" already exists`);
    }

    // Create category
    const category = this.categoryRepository.create({
      name: command.name,
      description: command.description,
    });

    return this.categoryRepository.save(category);
  }
}
