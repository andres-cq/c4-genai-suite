import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString, IsOptional, IsBoolean, IsInt } from 'class-validator';

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
