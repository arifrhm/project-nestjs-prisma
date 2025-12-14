import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let prismaService: PrismaService;

  const mockCategory = {
    id: 1,
    name: 'Technology',
    slug: 'technology',
    description: 'Tech related posts',
    createdAt: new Date(),
    updatedAt: new Date(),
    posts: [],
  };

  const mockPrismaService = {
    category: {
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
        CategoriesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a category', async () => {
      const createCategoryDto: CreateCategoryDto = {
        name: 'Technology',
        slug: 'technology',
        description: 'Tech related posts',
      };

      mockPrismaService.category.create.mockResolvedValue(mockCategory);

      const result = await service.create(createCategoryDto);

      expect(result).toEqual(mockCategory);
      expect(prismaService.category.create).toHaveBeenCalledWith({
        data: createCategoryDto,
        include: { posts: true },
      });
    });
  });

  describe('findAll', () => {
    it('should return all categories', async () => {
      mockPrismaService.category.findMany.mockResolvedValue([mockCategory]);

      const result = await service.findAll();

      expect(result).toEqual([mockCategory]);
      expect(prismaService.category.findMany).toHaveBeenCalledWith({
        include: { posts: true },
      });
    });

    it('should return empty array when no categories exist', async () => {
      mockPrismaService.category.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a category by id', async () => {
      mockPrismaService.category.findUnique.mockResolvedValue(mockCategory);

      const result = await service.findOne(1);

      expect(result).toEqual(mockCategory);
      expect(prismaService.category.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { posts: true },
      });
    });

    it('should throw NotFoundException when category not found', async () => {
      mockPrismaService.category.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const updateCategoryDto: UpdateCategoryDto = {
        name: 'Science',
      };

      const updatedCategory = { ...mockCategory, ...updateCategoryDto };

      mockPrismaService.category.findUnique.mockResolvedValue(mockCategory);
      mockPrismaService.category.update.mockResolvedValue(updatedCategory);

      const result = await service.update(1, updateCategoryDto);

      expect(result).toEqual(updatedCategory);
      expect(prismaService.category.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateCategoryDto,
        include: { posts: true },
      });
    });

    it('should throw NotFoundException when updating non-existent category', async () => {
      mockPrismaService.category.findUnique.mockResolvedValue(null);

      await expect(service.update(999, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a category', async () => {
      mockPrismaService.category.findUnique.mockResolvedValue(mockCategory);
      mockPrismaService.category.delete.mockResolvedValue(mockCategory);

      const result = await service.remove(1);

      expect(result).toEqual(mockCategory);
      expect(prismaService.category.delete).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { posts: true },
      });
    });

    it('should throw NotFoundException when deleting non-existent category', async () => {
      mockPrismaService.category.findUnique.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
