import { ApiProperty } from '@nestjs/swagger';
import { PromptModel } from 'src/domain/prompts';

export class PromptCategoryDto {
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
    description: 'The creation date.',
    required: true,
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'The last update date.',
    required: true,
  })
  updatedAt!: Date;
}

export class PromptDto {
  @ApiProperty({
    description: 'The prompt ID.',
    required: true,
  })
  id!: number;

  @ApiProperty({
    description: 'The prompt title.',
    required: true,
  })
  title!: string;

  @ApiProperty({
    description: 'The prompt content.',
    required: true,
  })
  content!: string;

  @ApiProperty({
    description: 'The prompt description.',
    required: false,
    nullable: true,
  })
  description?: string;

  @ApiProperty({
    description: 'Whether this is a global prompt.',
    required: true,
  })
  isGlobal!: boolean;

  @ApiProperty({
    description: 'The category ID.',
    required: false,
    nullable: true,
  })
  categoryId?: number;

  @ApiProperty({
    description: 'The category details.',
    type: PromptCategoryDto,
    required: false,
    nullable: true,
  })
  category?: PromptCategoryDto;

  @ApiProperty({
    description: 'The ID of the user who created this prompt.',
    required: true,
  })
  createdById!: string;

  @ApiProperty({
    description: 'The number of times this prompt has been used.',
    required: true,
  })
  usageCount!: number;

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

  static fromDomain(model: PromptModel): PromptDto {
    const dto = new PromptDto();
    dto.id = model.id;
    dto.title = model.title;
    dto.content = model.content;
    dto.description = model.description;
    dto.isGlobal = model.isGlobal;
    dto.categoryId = model.categoryId;
    dto.category = model.category
      ? {
          id: model.category.id,
          name: model.category.name,
          description: model.category.description,
          createdAt: model.category.createdAt,
          updatedAt: model.category.updatedAt,
        }
      : undefined;
    dto.createdById = model.createdById;
    dto.usageCount = model.usageCount;
    dto.createdAt = model.createdAt;
    dto.updatedAt = model.updatedAt;
    return dto;
  }
}

export class PromptsDto {
  @ApiProperty({ type: [PromptDto] })
  data!: PromptDto[];
}
