import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { KeywordsService } from './keywords.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateKeywordDto } from './dto/create-keyword.dto';
import { UpdateKeywordDto } from './dto/update-keyword.dto';

describe('KeywordsService', () => {
  let service: KeywordsService;
  let prismaService: PrismaService;

  const mockKeyword = {
    id: 1,
    name: 'javascript',
    createdAt: new Date(),
    updatedAt: new Date(),
    posts: [],
  };

  const mockPrismaService = {
    keyword: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KeywordsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<KeywordsService>(KeywordsService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a keyword', async () => {
      const createKeywordDto: CreateKeywordDto = {
        name: 'javascript',
      };

      mockPrismaService.keyword.create.mockResolvedValue(mockKeyword);

      const result = await service.create(createKeywordDto);

      expect(result).toEqual(mockKeyword);
      expect(prismaService.keyword.create).toHaveBeenCalledWith({
        data: createKeywordDto,
        include: { posts: true },
      });
    });
  });

  describe('findAll', () => {
    it('should return all keywords', async () => {
      mockPrismaService.keyword.findMany.mockResolvedValue([mockKeyword]);

      const result = await service.findAll();

      expect(result).toEqual([mockKeyword]);
      expect(prismaService.keyword.findMany).toHaveBeenCalledWith({
        include: { posts: true },
      });
    });

    it('should return empty array when no keywords exist', async () => {
      mockPrismaService.keyword.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a keyword by id', async () => {
      mockPrismaService.keyword.findUnique.mockResolvedValue(mockKeyword);

      const result = await service.findOne(1);

      expect(result).toEqual(mockKeyword);
      expect(prismaService.keyword.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { posts: true },
      });
    });

    it('should throw NotFoundException when keyword not found', async () => {
      mockPrismaService.keyword.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a keyword', async () => {
      const updateKeywordDto: UpdateKeywordDto = {
        name: 'typescript',
      };

      const updatedKeyword = { ...mockKeyword, ...updateKeywordDto };

      mockPrismaService.keyword.findUnique.mockResolvedValue(mockKeyword);
      mockPrismaService.keyword.update.mockResolvedValue(updatedKeyword);

      const result = await service.update(1, updateKeywordDto);

      expect(result).toEqual(updatedKeyword);
      expect(prismaService.keyword.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateKeywordDto,
        include: { posts: true },
      });
    });

    it('should throw NotFoundException when updating non-existent keyword', async () => {
      mockPrismaService.keyword.findUnique.mockResolvedValue(null);

      await expect(service.update(999, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a keyword', async () => {
      mockPrismaService.keyword.findUnique.mockResolvedValue(mockKeyword);
      mockPrismaService.keyword.delete.mockResolvedValue(mockKeyword);

      const result = await service.remove(1);

      expect(result).toEqual(mockKeyword);
      expect(prismaService.keyword.delete).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { posts: true },
      });
    });

    it('should throw NotFoundException when deleting non-existent keyword', async () => {
      mockPrismaService.keyword.findUnique.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
