import { Server } from 'net';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { DataSource, Repository } from 'typeorm';
import { AppModule } from '../../app.module';
import { PromptEntity, UserEntity } from '../../domain/database';
import { UserGroupEntity } from '../../domain/database';
import { schema } from '../../domain/database/typeorm.helper';
import { initAppWithDataBaseAndValidUser } from '../../utils/testUtils';
import { CreatePromptDto, PromptDto, PromptsDto } from './dtos';
import { PromptsController } from './prompts.controller';

describe('Prompts', () => {
  let app: INestApplication<Server>;
  let dataSource: DataSource;
  let controller: PromptsController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    controller = module.get(PromptsController);

    const initialized = await initAppWithDataBaseAndValidUser(dataSource, module, app);
    dataSource = initialized.dataSource;
    app = initialized.app;
    await cleanDatabase(dataSource);
    await seedTestData(dataSource);
  });

  afterAll(async () => {
    await cleanDatabase(dataSource);
    await dataSource.destroy();
    await app.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /prompts', () => {
    it('should retrieve all prompts for the current user', async () => {
      const response = await request(app.getHttpServer()).get('/prompts').expect(HttpStatus.OK);

      const body = response.body as PromptsDto;
      expect(body).toBeDefined();
      expect(body.items).toBeDefined();
      expect(body.items.length).toBeGreaterThanOrEqual(2);
      expect(body.items[0].title).toBe('Test Prompt 1');
      expect(body.items[0].promptText).toBe('This is test prompt 1');
      expect(body.items[1].title).toBe('Test Prompt 2');
      expect(body.items[1].promptText).toBe('This is test prompt 2');
    });
  });

  describe('POST /prompts', () => {
    it('should create a new prompt', async () => {
      const createPromptDto: CreatePromptDto = {
        title: 'New Prompt',
        description: 'New prompt description',
        promptText: 'This is a new prompt text',
      };

      const response = await request(app.getHttpServer()).post('/prompts').send(createPromptDto).expect(HttpStatus.CREATED);

      const body = response.body as PromptDto;
      expect(body).toBeDefined();
      expect(body.id).toBeDefined();
      expect(body.title).toBe(createPromptDto.title);
      expect(body.description).toBe(createPromptDto.description);
      expect(body.promptText).toBe(createPromptDto.promptText);
      expect(body.isFavorite).toBe(false);
      expect(body.createdAt).toBeDefined();
      expect(body.updatedAt).toBeDefined();
    });

    it('should create a prompt without description', async () => {
      const createPromptDto: CreatePromptDto = {
        title: 'Prompt Without Description',
        promptText: 'This is a prompt without description',
      };

      const response = await request(app.getHttpServer()).post('/prompts').send(createPromptDto).expect(HttpStatus.CREATED);

      const body = response.body as PromptDto;
      expect(body).toBeDefined();
      expect(body.id).toBeDefined();
      expect(body.title).toBe(createPromptDto.title);
      expect(body.description).toBeNull();
      expect(body.promptText).toBe(createPromptDto.promptText);
    });
  });
});

async function cleanDatabase(dataSource: DataSource) {
  const entities = dataSource.entityMetadatas;

  for (const entity of entities) {
    const repository = dataSource.getRepository(entity.name);
    await repository.query(`TRUNCATE TABLE ${schema}."${entity.tableName}" RESTART IDENTITY CASCADE`);
  }
}

async function seedTestData(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(UserEntity);
  const userGroupRepository = dataSource.getRepository(UserGroupEntity);
  const promptRepository = dataSource.getRepository(PromptEntity);

  const userGroup = await createUserGroupEntity(userGroupRepository);
  const user = await createUserEntity(userRepository, userGroup);
  await createPromptEntities(promptRepository, user.id);
}

function createUserGroupEntity(repository: Repository<UserGroupEntity>): Promise<UserGroupEntity> {
  const entity = new UserGroupEntity();
  entity.id = 'test-group-id';
  entity.name = 'test-group';
  return repository.save(entity);
}

function createUserEntity(repository: Repository<UserEntity>, userGroup: UserGroupEntity): Promise<UserEntity> {
  const entity = new UserEntity();
  entity.id = '1';
  entity.name = 'test';
  entity.email = 'test@example.com';
  entity.userGroups = [userGroup];
  return repository.save(entity);
}

async function createPromptEntities(repository: Repository<PromptEntity>, userId: string): Promise<void> {
  const prompt1 = new PromptEntity();
  prompt1.userId = userId;
  prompt1.title = 'Test Prompt 1';
  prompt1.description = 'Test description 1';
  prompt1.promptText = 'This is test prompt 1';
  prompt1.isFavorite = false;

  const prompt2 = new PromptEntity();
  prompt2.userId = userId;
  prompt2.title = 'Test Prompt 2';
  prompt2.description = 'Test description 2';
  prompt2.promptText = 'This is test prompt 2';
  prompt2.isFavorite = true;

  await repository.save([prompt1, prompt2]);
}
