import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PromptEntity } from 'src/domain/database';

export class CreatePromptDto {
  @ApiProperty({ description: 'The title of the prompt.', required: true })
  @IsString()
  title!: string;

  @ApiProperty({ description: 'The description of the prompt.', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'The prompt text.', required: true })
  @IsString()
  promptText!: string;
}

export class PromptDto {
  @ApiProperty({ description: 'The ID of the prompt.', required: true })
  id!: number;

  @ApiProperty({ description: 'The title of the prompt.', required: true })
  title!: string;

  @ApiProperty({ description: 'The description of the prompt.', required: false })
  description?: string;

  @ApiProperty({ description: 'The prompt text.', required: true })
  promptText!: string;

  @ApiProperty({ description: 'Whether the prompt is favorited.', required: true })
  isFavorite!: boolean;

  @ApiProperty({ description: 'The user ID who created the prompt.', required: true })
  userId!: string;

  @ApiProperty({ description: 'The creation timestamp.', required: true, type: String, format: 'date' })
  createdAt!: Date;

  @ApiProperty({ description: 'The last update timestamp.', required: true, type: String, format: 'date' })
  updatedAt!: Date;

  static fromDomain(source: PromptEntity): PromptDto {
    const result = new PromptDto();
    result.id = source.id;
    result.title = source.title;
    result.description = source.description;
    result.promptText = source.promptText;
    result.isFavorite = source.isFavorite;
    result.userId = source.userId;
    result.createdAt = source.createdAt;
    result.updatedAt = source.updatedAt;
    return result;
  }
}
