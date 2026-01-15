import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { LocalAuthGuard } from 'src/domain/auth';
import { CreatePrompt, CreatePromptResponse } from 'src/domain/prompts';
import { CreatePromptDto, PromptDto } from './dtos';

@Controller('prompts')
@ApiTags('prompts')
@UseGuards(LocalAuthGuard)
export class PromptsController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('')
  @ApiOperation({ operationId: 'createPrompt', description: 'Create a new prompt.' })
  @ApiOkResponse({ type: PromptDto })
  async createPrompt(@Req() req: Request, @Body() body: CreatePromptDto) {
    const result: CreatePromptResponse = await this.commandBus.execute(new CreatePrompt(req.user, body));

    return PromptDto.fromDomain(result.prompt);
  }
}
