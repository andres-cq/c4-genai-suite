import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PromptEntity } from '../../database/entities';
import { PromptModel } from '../interfaces';

export class GetPromptQuery {
  constructor(public readonly id: number) {}
}

@QueryHandler(GetPromptQuery)
export class GetPromptHandler implements IQueryHandler<GetPromptQuery> {
  constructor(
    @InjectRepository(PromptEntity)
    private readonly promptRepository: Repository<PromptEntity>,
  ) {}

  async execute(query: GetPromptQuery): Promise<PromptModel | null> {
    return this.promptRepository.findOne({
      where: { id: query.id },
      relations: ['category'],
    });
  }
}
