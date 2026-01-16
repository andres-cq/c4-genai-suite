import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { LocalAuthGuard } from 'src/domain/auth';
import { CreatePrompt, CreatePromptResponse, GetPrompts, GetPromptsResponse } from 'src/domain/prompts';
import { CreatePromptDto, PromptDto, PromptsDto } from './dtos';

@Controller('prompts')
@ApiTags('prompts')
@UseGuards(LocalAuthGuard)
export class PromptsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('')
  @ApiOperation({ operationId: 'getPrompts', description: 'Get all prompts for the current user.' })
  @ApiOkResponse({ type: PromptsDto })
  async getPrompts(@Req() req: Request) {
    const result: GetPromptsResponse = await this.queryBus.execute(new GetPrompts(req.user));

    return PromptsDto.fromDomain(result.prompts);
  }

  @Post('')
  @ApiOperation({ operationId: 'createPrompt', description: 'Create a new prompt.' })
  @ApiOkResponse({ type: PromptDto })
  async createPrompt(@Req() req: Request, @Body() body: CreatePromptDto) {
    const command = new CreatePrompt(req.user, body);

    const result: CreatePromptResponse = await this.commandBus.execute(command);

    return PromptDto.fromDomain(result.prompt);
  }
}
