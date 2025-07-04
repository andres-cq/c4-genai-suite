import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FindManyOptions } from 'typeorm';
import { User } from 'src/domain/users';
import { BucketEntity, BucketRepository, FileEntity, FileRepository } from '../../database';
import { GetFiles, GetFilesHandler, GetFilesResponse } from './get-files';

describe('Get Files', () => {
  let bucketRepository: BucketRepository;
  let fileRepository: FileRepository;
  let handler: GetFilesHandler;

  const mockUser: User = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    userGroupId: 'group1',
  };

  const mockUserDifferent: User = {
    id: '2',
    name: 'Test User 2',
    email: 'test2@example.com',
    userGroupId: 'grou21',
  };

  const findFiles = (statement: FindManyOptions<FileEntity> | undefined, users: FileEntity[]): Promise<FileEntity[]> => {
    const whereStatement = Array.isArray(statement?.where)
      ? statement.where.reduce((prev, curr) => ({ ...prev, ...curr }), {})
      : statement?.where;
    return Promise.resolve(
      Object.entries(whereStatement ?? {}).reduce(
        (filteredUsers, [whereKey, whereValue]) =>
          filteredUsers.filter((user) => user[whereKey as keyof FileEntity] === whereValue),
        users,
      ),
    );
  };

  const countFiles = async (statement: FindManyOptions<FileEntity> | undefined, users: FileEntity[]): Promise<number> => {
    const results = await findFiles(statement, users);
    return Promise.resolve(results.length);
  };

  beforeAll(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetFilesHandler,
        {
          provide: getRepositoryToken(BucketEntity),
          useValue: {
            findOneBy: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(FileEntity),
          useValue: {
            find: jest.fn(),
            count: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get(GetFilesHandler);
    bucketRepository = module.get<BucketRepository>(getRepositoryToken(BucketEntity));
    fileRepository = module.get<FileRepository>(getRepositoryToken(FileEntity));
  });
  it('should return files for a general bucket', async () => {
    const files = [
      { id: 1, userId: mockUser.id, bucketId: 1 },
      { id: 2, userId: mockUserDifferent.id, bucketId: 1 },
      { id: 3, userId: mockUser.id, bucketId: 2 },
    ] as FileEntity[];

    jest.spyOn(fileRepository, 'count').mockImplementation((query) => countFiles(query, files));
    jest.spyOn(fileRepository, 'find').mockImplementation((query) => findFiles(query, files));
    jest
      .spyOn(bucketRepository, 'findOneBy')
      .mockImplementation(() => Promise.resolve({ id: 1, type: 'general' } as BucketEntity));
    const command = new GetFiles({ user: mockUser, bucketIdOrType: 1, page: 0, pageSize: 10 });

    const response = await handler.execute(command);

    expect(response).toBeInstanceOf(GetFilesResponse);
    expect(response).toBeDefined();
    expect(response.total).toBe(2);
    expect(response.files).toHaveLength(2);
  });

  it('should return files for conversation bucket', async () => {
    const files = [
      { id: 1, userId: mockUser.id, bucketId: 1, conversationId: 1 },
      { id: 2, userId: mockUser.id, bucketId: 1, conversationId: 2 },
      { id: 3, userId: mockUserDifferent.id, bucketId: 1, conversationId: 3 },
      { id: 4, userId: mockUser.id, bucketId: 2, conversationId: 1 },
    ] as FileEntity[];

    jest.spyOn(fileRepository, 'count').mockImplementation((query) => countFiles(query, files));
    jest.spyOn(fileRepository, 'find').mockImplementation((query) => findFiles(query, files));
    jest
      .spyOn(bucketRepository, 'findOneBy')
      .mockImplementation(() => Promise.resolve({ id: 1, type: 'conversation' } as BucketEntity));
    const command = new GetFiles({ user: mockUser, bucketIdOrType: 1, page: 0, pageSize: 10 });

    const response = await handler.execute(command);

    expect(response).toBeInstanceOf(GetFilesResponse);
    expect(response).toBeDefined();
    expect(response.total).toBe(2);
    expect(response.files).toHaveLength(2);
    expect(response.files[0].id).toBe(1);
    expect(response.files[1].id).toBe(2);
  });

  it('should return files of user for conversation bucket and conversation id', async () => {
    const files = [
      { id: 1, userId: mockUser.id, bucketId: 1, conversationId: 1 },
      { id: 2, userId: mockUser.id, bucketId: 1, conversationId: 2 },
      { id: 3, userId: mockUserDifferent.id, bucketId: 1, conversationId: 3 },
      { id: 4, userId: mockUser.id, bucketId: 2, conversationId: 1 },
    ] as FileEntity[];

    jest.spyOn(fileRepository, 'count').mockImplementation((query) => countFiles(query, files));
    jest.spyOn(fileRepository, 'find').mockImplementation((query) => findFiles(query, files));
    jest
      .spyOn(bucketRepository, 'findOneBy')
      .mockImplementation(() => Promise.resolve({ id: 1, type: 'conversation' } as BucketEntity));
    const command = new GetFiles({ user: mockUser, bucketIdOrType: 1, page: 0, pageSize: 10, conversationId: 1 });

    const response = await handler.execute(command);

    expect(response).toBeInstanceOf(GetFilesResponse);
    expect(response).toBeDefined();
    expect(response.total).toBe(2);
    expect(response.files).toHaveLength(2);
    expect(response.files[0].id).toBe(1);
    expect(response.files[1].id).toBe(4);
  });

  it('should return files of user for user bucket', async () => {
    const files = [
      { id: 1, userId: mockUser.id, bucketId: 1 },
      { id: 2, userId: mockUserDifferent.id, bucketId: 1 },
    ] as FileEntity[];

    jest.spyOn(fileRepository, 'count').mockImplementation((query) => countFiles(query, files));
    jest.spyOn(fileRepository, 'find').mockImplementation((query) => findFiles(query, files));
    jest.spyOn(bucketRepository, 'findOneBy').mockImplementation(() => Promise.resolve({ id: 1, type: 'user' } as BucketEntity));
    const command = new GetFiles({ user: mockUser, bucketIdOrType: 1, page: 0, pageSize: 10 });

    const response = await handler.execute(command);

    expect(response).toBeInstanceOf(GetFilesResponse);
    expect(response).toBeDefined();
    expect(response.total).toBe(1);
    expect(response.files).toHaveLength(1);
    expect(response.files[0].id).toBe(1);
  });

  it('should fail to find a user bucket', async () => {
    const files = [
      { id: 1, userId: mockUser.id, bucketId: 1 },
      { id: 2, userId: mockUserDifferent.id, bucketId: 1 },
    ] as FileEntity[];
    jest.spyOn(fileRepository, 'count').mockImplementation((query) => countFiles(query, files));
    jest.spyOn(fileRepository, 'find').mockImplementation((query) => findFiles(query, files));
    jest.spyOn(bucketRepository, 'findOneBy').mockImplementation(() => Promise.resolve(null));

    const command = new GetFiles({ user: mockUser, bucketIdOrType: 'user', page: 0, pageSize: 10 });

    await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
  });

  it('should fail to find a conversation bucket', async () => {
    const files = [
      { id: 1, userId: mockUser.id, bucketId: 1 },
      { id: 2, userId: mockUserDifferent.id, bucketId: 1 },
    ] as FileEntity[];
    jest.spyOn(fileRepository, 'count').mockImplementation((query) => countFiles(query, files));
    jest.spyOn(fileRepository, 'find').mockImplementation((query) => findFiles(query, files));

    const command = new GetFiles({ user: mockUser, bucketIdOrType: 'conversation', page: 0, pageSize: 10 });

    await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
  });

  it('should fail to find a general bucket', async () => {
    const files = [
      { id: 1, userId: mockUser.id, bucketId: 1 },
      { id: 2, userId: mockUserDifferent.id, bucketId: 1 },
    ] as FileEntity[];
    jest.spyOn(fileRepository, 'count').mockImplementation((query) => countFiles(query, files));
    jest.spyOn(fileRepository, 'find').mockImplementation((query) => findFiles(query, files));

    const command = new GetFiles({ user: mockUser, bucketIdOrType: 'general', page: 0, pageSize: 10 });

    await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
  });

  it('should return files for a user bucket', async () => {
    const files = [
      { id: 1, userId: mockUser.id, bucketId: 1 },
      { id: 2, userId: mockUserDifferent.id, bucketId: 1 },
      { id: 3, userId: mockUser.id, bucketId: 2 },
    ] as FileEntity[];

    jest.spyOn(fileRepository, 'count').mockImplementation((query) => countFiles(query, files));
    jest.spyOn(fileRepository, 'find').mockImplementation((query) => findFiles(query, files));
    jest.spyOn(bucketRepository, 'findOneBy').mockResolvedValueOnce({ id: 1, type: 'user' } as BucketEntity);

    const command = new GetFiles({ user: mockUser, bucketIdOrType: 'user', page: 0, pageSize: 10 });
    const response = await handler.execute(command);
    expect(response).toBeInstanceOf(GetFilesResponse);
    expect(response.total).toBe(1);
    expect(response.files).toHaveLength(1);
    expect(response.files[0].id).toBe(1);
  });
});
