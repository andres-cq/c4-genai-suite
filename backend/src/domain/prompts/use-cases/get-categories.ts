import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PromptCategoryEntity, PromptEntity } from '../../database/entities';
import { PromptCategoryModel } from '../interfaces';

export interface PromptCategoryWithCount extends PromptCategoryModel {
  promptCount: number;
}

export class GetCategoriesQuery {}

@QueryHandler(GetCategoriesQuery)
export class GetCategoriesHandler implements IQueryHandler<GetCategoriesQuery> {
  constructor(
    @InjectRepository(PromptCategoryEntity)
    private readonly categoryRepository: Repository<PromptCategoryEntity>,
    @InjectRepository(PromptEntity)
    private readonly promptRepository: Repository<PromptEntity>,
  ) {}

  async execute(): Promise<PromptCategoryWithCount[]> {
    const categories = await this.categoryRepository.find();

    // Get prompt count for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const count = await this.promptRepository.count({
          where: { categoryId: category.id },
        });

        return {
          ...category,
          promptCount: count,
        };
      }),
    );

    return categoriesWithCount;
  }
}
