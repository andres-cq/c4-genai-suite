import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { assignDefined } from '../../../lib';
import { ExtensionEntity, ExtensionRepository } from '../../database';
import { ExtensionConfiguration } from '../interfaces';
import { ExplorerService } from '../services';
import { unmaskExtensionValues } from './utils';

export class TestExtension {
  constructor(
    public readonly name: string,
    public readonly configuration: ExtensionConfiguration,
    public readonly id?: number,
  ) {}
}

@CommandHandler(TestExtension)
export class TestExtensionHandler implements ICommandHandler<TestExtension, boolean> {
  constructor(
    private readonly explorer: ExplorerService,
    @InjectRepository(ExtensionEntity)
    private readonly extensions: ExtensionRepository,
  ) {}

  async execute(command: TestExtension): Promise<boolean> {
    const { id, configuration, name } = command;

    const extension = this.explorer.getExtension(name);
    if (!extension) {
      throw new NotFoundException('Cannot find extension.');
    }

    if (!extension.test) {
      throw new BadRequestException('Extension cannot be tested.');
    }

    const entity = id ? await this.extensions.findOneBy({ id }) : undefined;
    if (id && !entity) {
      throw new NotFoundException('Cannot find extension.');
    }

    if (entity) {
      delete entity.state;
    }

    const extensionConfiguration = assignDefined(entity?.values ?? {}, unmaskExtensionValues(configuration));

    await extension.test(extensionConfiguration);
    return true;
  }
}
