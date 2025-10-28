import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { LocalAuthGuard, Role, RoleGuard } from 'src/domain/auth';
import {
  CreatePromptCommand,
  GetPromptsQuery,
  GetPromptQuery,
  UpdatePromptCommand,
  DeletePromptCommand,
  GetCategoriesQuery,
  CreateCategoryCommand,
  IncrementUsageCommand,
  PromptModel,
} from 'src/domain/prompts';
import {
  PromptDto,
  PromptsDto,
  CreatePromptDto,
  UpdatePromptDto,
  CreateCategoryDto,
  PromptCategoryResponseDto,
  PromptCategoriesDto,
} from './dtos';

@Controller('prompts')
@ApiTags('prompts')
@UseGuards(LocalAuthGuard)
export class PromptsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('')
  @ApiOperation({ operationId: 'getPrompts', description: 'Gets all accessible prompts for the user.' })
  @ApiOkResponse({ type: PromptsDto })
  @ApiQuery({ name: 'categoryId', required: false, type: Number, description: 'Filter by category ID' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by title, content, or description' })
  async getPrompts(
    @Req() req: Request,
    @Query('categoryId') categoryId?: string,
    @Query('search') search?: string,
  ): Promise<PromptsDto> {
    const userId = (req.user as any).id;
    const prompts = await this.queryBus.execute(
      new GetPromptsQuery(userId, categoryId ? parseInt(categoryId) : undefined, search),
    );
    return {
      data: prompts.map((p: PromptModel) => PromptDto.fromDomain(p)),
    };
  }

  @Get(':id')
  @ApiOperation({ operationId: 'getPrompt', description: 'Gets a single prompt by ID.' })
  @ApiOkResponse({ type: PromptDto })
  @ApiParam({ name: 'id', type: Number })
  async getPrompt(@Param('id', ParseIntPipe) id: number): Promise<PromptDto> {
    const prompt = await this.queryBus.execute(new GetPromptQuery(id));
    if (!prompt) {
      throw new NotFoundException(`Prompt with ID ${id} not found`);
    }
    return PromptDto.fromDomain(prompt);
  }

  @Post('')
  @ApiOperation({ operationId: 'createPrompt', description: 'Creates a new user prompt.' })
  @ApiOkResponse({ type: PromptDto })
  async createPrompt(@Req() req: Request, @Body() dto: CreatePromptDto): Promise<PromptDto> {
    const userId = (req.user as any).id;
    const prompt = await this.commandBus.execute(
      new CreatePromptCommand(dto.title, dto.content, dto.description, dto.categoryId, false, userId),
    );
    return PromptDto.fromDomain(prompt);
  }

  @Post('admin')
  @UseGuards(RoleGuard)
  @Role('admin')
  @ApiOperation({ operationId: 'createAdminPrompt', description: 'Creates a new global prompt (admin only).' })
  @ApiOkResponse({ type: PromptDto })
  async createAdminPrompt(@Req() req: Request, @Body() dto: CreatePromptDto): Promise<PromptDto> {
    const userId = (req.user as any).id;
    const prompt = await this.commandBus.execute(
      new CreatePromptCommand(dto.title, dto.content, dto.description, dto.categoryId, true, userId),
    );
    return PromptDto.fromDomain(prompt);
  }

  @Put(':id')
  @ApiOperation({ operationId: 'updatePrompt', description: 'Updates a prompt (ownership check).' })
  @ApiOkResponse({ type: PromptDto })
  @ApiParam({ name: 'id', type: Number })
  async updatePrompt(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePromptDto,
  ): Promise<PromptDto> {
    const userId = (req.user as any).id;
    const prompt = await this.commandBus.execute(
      new UpdatePromptCommand(id, userId, dto.title, dto.content, dto.description, dto.categoryId),
    );
    return PromptDto.fromDomain(prompt);
  }

  @Delete(':id')
  @ApiNoContentResponse()
  @ApiOperation({ operationId: 'deletePrompt', description: 'Deletes a prompt (ownership check).' })
  @ApiParam({ name: 'id', type: Number })
  async deletePrompt(@Req() req: Request, @Param('id', ParseIntPipe) id: number): Promise<void> {
    const userId = (req.user as any).id;
    await this.commandBus.execute(new DeletePromptCommand(id, userId));
  }

  @Post(':id/use')
  @ApiNoContentResponse()
  @ApiOperation({ operationId: 'incrementPromptUsage', description: 'Increments the usage count of a prompt.' })
  @ApiParam({ name: 'id', type: Number })
  async incrementUsage(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.commandBus.execute(new IncrementUsageCommand(id));
  }

  @Get('categories')
  @ApiOperation({ operationId: 'getCategories', description: 'Gets all prompt categories with counts.' })
  @ApiOkResponse({ type: PromptCategoriesDto })
  async getCategories(): Promise<PromptCategoriesDto> {
    const categories = await this.queryBus.execute(new GetCategoriesQuery());
    return {
      data: categories.map((c: any) => PromptCategoryResponseDto.fromDomain(c)),
    };
  }

  @Post('categories')
  @UseGuards(RoleGuard)
  @Role('admin')
  @ApiOperation({ operationId: 'createCategory', description: 'Creates a new category (admin only).' })
  @ApiOkResponse({ type: PromptCategoryResponseDto })
  async createCategory(@Body() dto: CreateCategoryDto): Promise<PromptCategoryResponseDto> {
    const category = await this.commandBus.execute(new CreateCategoryCommand(dto.name, dto.description));
    return {
      id: category.id,
      name: category.name,
      description: category.description,
      promptCount: 0,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }
}
