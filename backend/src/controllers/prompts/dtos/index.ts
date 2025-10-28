import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString, IsOptional, IsBoolean, IsInt } from 'class-validator';
import { PromptModel, PromptCategoryModel } from 'src/domain/prompts';

// Category DTOs
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

  static fromDomain(model: any): PromptCategoryResponseDto {
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
  @ApiProperty({
    description: 'The prompt categories.',
    required: true,
    type: [PromptCategoryResponseDto],
  })
  data!: PromptCategoryResponseDto[];
}

// Prompt DTOs
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
  @ApiProperty({
    description: 'The prompts.',
    required: true,
    type: [PromptDto],
  })
  data!: PromptDto[];
}

// Request DTOs
export class CreatePromptDto {
  @ApiProperty({
    description: 'The prompt title.',
    required: true,
    maxLength: 255,
  })
  @IsDefined()
  @IsString()
  title!: string;

  @ApiProperty({
    description: 'The prompt content.',
    required: true,
  })
  @IsDefined()
  @IsString()
  content!: string;

  @ApiProperty({
    description: 'The prompt description.',
    required: false,
    nullable: true,
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'The category ID.',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsInt()
  categoryId?: number;

  @ApiProperty({
    description: 'Whether this is a global prompt (admin only).',
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isGlobal?: boolean;
}

export class UpdatePromptDto {
  @ApiProperty({
    description: 'The prompt title.',
    required: false,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'The prompt content.',
    required: false,
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({
    description: 'The prompt description.',
    required: false,
    nullable: true,
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'The category ID.',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsInt()
  categoryId?: number;
}

export class CreateCategoryDto {
  @ApiProperty({
    description: 'The category name.',
    required: true,
    maxLength: 100,
  })
  @IsDefined()
  @IsString()
  name!: string;

  @ApiProperty({
    description: 'The category description.',
    required: false,
    nullable: true,
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
