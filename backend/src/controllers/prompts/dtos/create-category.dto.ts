import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString, IsOptional } from 'class-validator';

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
