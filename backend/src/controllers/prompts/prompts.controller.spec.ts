import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { User } from 'src/domain/users/interfaces';
import { CreatePromptDto } from './dtos';
import { PromptsController } from './prompts.controller';

describe('PromptsController', () => {
  let controller: PromptsController;
  let commandBus: CommandBus;
  let queryBus: QueryBus;

  const mockUser: User = {
    id: '1',
    userGroupIds: ['1'],
    name: 'Test User',
    email: 'test@example.com',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PromptsController],
      providers: [
        {
          provide: CommandBus,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: QueryBus,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PromptsController>(PromptsController);
    commandBus = module.get<CommandBus>(CommandBus);
    queryBus = module.get<QueryBus>(QueryBus);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getPrompts', () => {
    it('should get all prompts for the current user', async () => {
      const mockPrompts = [
        {
          id: 1,
          userId: '1',
          title: 'Test Prompt',
          description: 'Test description',
          promptText: 'Test prompt text',
          isFavorite: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const mockResponse = { prompts: mockPrompts };
      const executeSpy = jest.spyOn(queryBus, 'execute').mockImplementation(() => Promise.resolve(mockResponse));

      const req = { user: mockUser } as Request;
      const result = await controller.getPrompts(req);

      expect(executeSpy).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  describe('createPrompt', () => {
    it('should create a new prompt', async () => {
      const createPromptDto: CreatePromptDto = {
        title: 'New Prompt',
        description: 'New description',
        promptText: 'New prompt text',
      };

      const mockPrompt = {
        id: 1,
        userId: '1',
        title: createPromptDto.title,
        description: createPromptDto.description,
        promptText: createPromptDto.promptText,
        isFavorite: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockResponse = { prompt: mockPrompt };
      const executeSpy = jest.spyOn(commandBus, 'execute').mockImplementation(() => Promise.resolve(mockResponse));

      const req = { user: mockUser } as Request;
      const result = await controller.createPrompt(req, createPromptDto);

      expect(executeSpy).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });
});
