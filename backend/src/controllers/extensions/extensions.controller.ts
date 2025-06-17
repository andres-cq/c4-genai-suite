import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard, Role, RoleGuard } from 'src/domain/auth';
import { BUILTIN_USER_GROUP_ADMIN } from 'src/domain/database';
import { RebuildExtension, RebuildExtensionResponse, TestExtension } from 'src/domain/extensions/use-cases';
import { ExtensionDto, TestExtensionDto } from './dtos';

@Controller('extensions')
@ApiTags('extensions')
@UseGuards(LocalAuthGuard)
export class ExtensionsController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('test')
  @ApiOperation({ operationId: 'testExtension', description: 'Tests an extension.' })
  @ApiNoContentResponse({})
  @Role(BUILTIN_USER_GROUP_ADMIN)
  @UseGuards(RoleGuard)
  async test(@Body() body: TestExtensionDto) {
    const command = new TestExtension(body.name, body.values, body.id);
    await this.commandBus.execute(command);
  }

  @Post('rebuild')
  @ApiOperation({ operationId: 'rebuildExtension', description: 'Rebuilds an extension.' })
  @Role(BUILTIN_USER_GROUP_ADMIN)
  @UseGuards(RoleGuard)
  @ApiOkResponse({ type: ExtensionDto })
  async rebuild(@Body() body: TestExtensionDto) {
    const command = new RebuildExtension(body.name, body.values, body.id);
    const response: RebuildExtensionResponse = await this.commandBus.execute(command);
    return ExtensionDto.fromDomain(response.extension);
  }
}
