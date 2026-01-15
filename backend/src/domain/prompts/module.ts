import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromptEntity } from '../database';
import { CreatePromptHandler } from './use-cases';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([PromptEntity])],
  providers: [CreatePromptHandler],
  exports: [],
})
export class PromptsModule {}
