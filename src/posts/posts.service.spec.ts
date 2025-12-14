import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

describe('PostsService', () => {
  let service: PostsService;
  let prismaService: PrismaService;

  const mockPost = {
    id: 1,
    title: 'Test Post',
    content: 'Test Content',
    published: false,
    authorId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    author: { id: 1, email: 'test@test.com', name: 'Test User' },
  };

  const mockPrismaService = {
    post: {
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
        PostsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a post', async () => {
      const createPostDto: CreatePostDto = {
        title: 'Test Post',
        content: 'Test Content',
        authorId: 1,
      };

      mockPrismaService.post.create.mockResolvedValue(mockPost);

      const result = await service.create(createPostDto);

      expect(result).toEqual(mockPost);
      expect(prismaService.post.create).toHaveBeenCalledWith({
        data: createPostDto,
        include: { author: true },
      });
    });
  });

  describe('findAll', () => {
    it('should return all posts', async () => {
      mockPrismaService.post.findMany.mockResolvedValue([mockPost]);

      const result = await service.findAll();

      expect(result).toEqual([mockPost]);
      expect(prismaService.post.findMany).toHaveBeenCalledWith({
        include: { author: true },
      });
    });

    it('should return empty array when no posts exist', async () => {
      mockPrismaService.post.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a post by id', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(mockPost);

      const result = await service.findOne(1);

      expect(result).toEqual(mockPost);
      expect(prismaService.post.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { author: true },
      });
    });

    it('should throw NotFoundException when post not found', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a post', async () => {
      const updatePostDto: UpdatePostDto = {
        title: 'Updated Title',
      };

      const updatedPost = { ...mockPost, ...updatePostDto };

      mockPrismaService.post.findUnique.mockResolvedValue(mockPost);
      mockPrismaService.post.update.mockResolvedValue(updatedPost);

      const result = await service.update(1, updatePostDto);

      expect(result).toEqual(updatedPost);
      expect(prismaService.post.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updatePostDto,
        include: { author: true },
      });
    });

    it('should throw NotFoundException when updating non-existent post', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(null);

      await expect(service.update(999, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a post', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(mockPost);
      mockPrismaService.post.delete.mockResolvedValue(mockPost);

      const result = await service.remove(1);

      expect(result).toEqual(mockPost);
      expect(prismaService.post.delete).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { author: true },
      });
    });

    it('should throw NotFoundException when deleting non-existent post', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
