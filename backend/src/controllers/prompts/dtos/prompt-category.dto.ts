import { ApiProperty } from '@nestjs/swagger';
import { PromptCategoryModel } from 'src/domain/prompts';

export interface PromptCategoryWithCount extends PromptCategoryModel {
  promptCount: number;
}

export class PromptCategoryResponseDto {
  @ApiProperty({
    description: 'The category ID.',
    required: true,
  })
  id!: number;

  @ApiProperty({
    description: 'The category name.',
    required: true,
  })
  name!: string;

  @ApiProperty({
    description: 'The category description.',
    required: false,
    nullable: true,
  })
  description?: string;

  @ApiProperty({
    description: 'The number of prompts in this category.',
    required: true,
  })
  promptCount!: number;

  @ApiProperty({
    description: 'The creation date.',
    required: true,
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'The last update date.',
    required: true,
  })
  updatedAt!: Date;

  static fromDomain(model: PromptCategoryWithCount): PromptCategoryResponseDto {
    const dto = new PromptCategoryResponseDto();
    dto.id = model.id;
    dto.name = model.name;
    dto.description = model.description;
    dto.promptCount = model.promptCount;
    dto.createdAt = model.createdAt;
    dto.updatedAt = model.updatedAt;
    return dto;
  }
}

export class PromptCategoriesDto {
  @ApiProperty({ type: [PromptCategoryResponseDto] })
  data!: PromptCategoryResponseDto[];
}
