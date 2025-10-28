import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PromptEntity } from '../../database/entities';
import { PromptModel } from '../interfaces';

export class GetPromptsQuery {
  constructor(
    public readonly userId: string,
    public readonly categoryId?: number,
    public readonly search?: string,
  ) {}
}

@QueryHandler(GetPromptsQuery)
export class GetPromptsHandler implements IQueryHandler<GetPromptsQuery> {
  constructor(
    @InjectRepository(PromptEntity)
    private readonly promptRepository: Repository<PromptEntity>,
  ) {}

  async execute(query: GetPromptsQuery): Promise<PromptModel[]> {
    const qb = this.promptRepository
      .createQueryBuilder('prompt')
      .leftJoinAndSelect('prompt.category', 'category')
      .where('prompt.isGlobal = :isGlobal OR prompt.createdById = :userId', {
        isGlobal: true,
        userId: query.userId,
      });

    // Filter by category if provided
    if (query.categoryId) {
      qb.andWhere('prompt.categoryId = :categoryId', { categoryId: query.categoryId });
    }

    // Search by title or content if provided
    if (query.search) {
      qb.andWhere(
        '(prompt.title ILIKE :search OR prompt.content ILIKE :search OR prompt.description ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    // Order by: global first, then by usage count
    qb.orderBy('prompt.isGlobal', 'DESC').addOrderBy('prompt.usageCount', 'DESC');

    return qb.getMany();
  }
}
