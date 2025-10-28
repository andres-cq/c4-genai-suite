import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt } from 'class-validator';

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
