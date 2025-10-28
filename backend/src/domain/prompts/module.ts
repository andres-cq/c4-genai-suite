import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromptEntity, PromptCategoryEntity } from '../database/entities';
import {
  CreatePromptHandler,
  GetPromptsHandler,
  GetPromptHandler,
  UpdatePromptHandler,
  DeletePromptHandler,
  GetCategoriesHandler,
  CreateCategoryHandler,
  IncrementUsageHandler,
} from './use-cases';

const CommandHandlers = [
  CreatePromptHandler,
  UpdatePromptHandler,
  DeletePromptHandler,
  CreateCategoryHandler,
  IncrementUsageHandler,
];

const QueryHandlers = [GetPromptsHandler, GetPromptHandler, GetCategoriesHandler];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([PromptEntity, PromptCategoryEntity])],
  providers: [...CommandHandlers, ...QueryHandlers],
  exports: [TypeOrmModule],
})
export class PromptsModule {}
