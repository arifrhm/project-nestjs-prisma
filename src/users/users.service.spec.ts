import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersService', () => {
  let service: UsersService;

  const mockUser = {
    id: 1,
    email: 'test@test.com',
    name: 'Test User',
    roleId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    role: { id: 1, name: 'User' },
  };

  const mockPrismaService = {
    user: {
      create: jest.fn().mockResolvedValue(mockUser),
      findMany: jest.fn().mockResolvedValue([mockUser]),
      findUnique: jest.fn().mockResolvedValue(mockUser),
      update: jest.fn().mockResolvedValue(mockUser),
      delete: jest.fn().mockResolvedValue(mockUser),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@test.com',
        name: 'Test User',
      };

      const result = await service.create(createUserDto);

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: createUserDto,
      });
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const result = await service.findAll();

      expect(result).toEqual([mockUser]);
      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith({
        include: { posts: true },
      });
    });

    it('should return empty array when no users exist', async () => {
      mockPrismaService.user.findMany.mockResolvedValueOnce([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const result = await service.findOne(1);

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { posts: true },
      });
    });

    it('should throw NotFoundException when user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const result = await service.findByEmail('test@test.com');

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@test.com' },
      });
    });

    it('should return null when user not found by email', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce(null);

      const result = await service.findByEmail('notfound@test.com');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Updated Name',
      };

      const updatedUser = { ...mockUser, ...updateUserDto };
      mockPrismaService.user.update.mockResolvedValueOnce(updatedUser);

      const result = await service.update(1, updateUserDto);

      expect(result).toEqual(updatedUser);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateUserDto,
      });
    });

    it('should throw NotFoundException when updating non-existent user', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.update(999, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      const result = await service.remove(1);

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException when deleting non-existent user', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
