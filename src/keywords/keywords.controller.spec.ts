import { Test, TestingModule } from '@nestjs/testing';
import { KeywordsController } from './keywords.controller';
import { KeywordsService } from './keywords.service';
import { RbacService } from '../rbac/rbac.service';
import { RbacGuard } from '../rbac/guards/rbac.guard';
import { CreateKeywordDto } from './dto/create-keyword.dto';
import { UpdateKeywordDto } from './dto/update-keyword.dto';

describe('KeywordsController', () => {
  let controller: KeywordsController;
  let service: KeywordsService;

  const mockKeyword = {
    id: 1,
    name: 'javascript',
    createdAt: new Date(),
    updatedAt: new Date(),
    posts: [],
  };

  const mockKeywordsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockRbacService = {
    hasPermission: jest.fn().mockResolvedValue(true),
    canUpdatePost: jest.fn().mockResolvedValue(true),
    canDeletePost: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    let builder = Test.createTestingModule({
      controllers: [KeywordsController],
      providers: [
        {
          provide: KeywordsService,
          useValue: mockKeywordsService,
        },
        {
          provide: RbacService,
          useValue: mockRbacService,
        },
      ],
    });

    builder = builder
      .overrideGuard(RbacGuard)
      .useValue({
        canActivate: jest.fn().mockReturnValue(true),
      });

    const module: TestingModule = await builder.compile();

    controller = module.get<KeywordsController>(KeywordsController);
    service = module.get<KeywordsService>(KeywordsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a keyword', async () => {
      const createKeywordDto: CreateKeywordDto = {
        name: 'javascript',
      };

      mockKeywordsService.create.mockResolvedValue(mockKeyword);

      const result = await controller.create(createKeywordDto);

      expect(result).toEqual(mockKeyword);
      expect(service.create).toHaveBeenCalledWith(createKeywordDto);
    });
  });

  describe('findAll', () => {
    it('should return all keywords', async () => {
      mockKeywordsService.findAll.mockResolvedValue([mockKeyword]);

      const result = await controller.findAll();

      expect(result).toEqual([mockKeyword]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a keyword by id', async () => {
      mockKeywordsService.findOne.mockResolvedValue(mockKeyword);

      const result = await controller.findOne(1);

      expect(result).toEqual(mockKeyword);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a keyword', async () => {
      const updateKeywordDto: UpdateKeywordDto = {
        name: 'typescript',
      };

      const updatedKeyword = { ...mockKeyword, ...updateKeywordDto };

      mockKeywordsService.update.mockResolvedValue(updatedKeyword);

      const result = await controller.update(1, updateKeywordDto);

      expect(result).toEqual(updatedKeyword);
      expect(service.update).toHaveBeenCalledWith(1, updateKeywordDto);
    });
  });

  describe('remove', () => {
    it('should delete a keyword', async () => {
      mockKeywordsService.remove.mockResolvedValue(mockKeyword);

      const result = await controller.remove(1);

      expect(result).toEqual(mockKeyword);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
