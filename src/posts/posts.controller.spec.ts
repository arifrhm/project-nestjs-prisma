import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { RbacService } from '../rbac/rbac.service';
import { RbacGuard } from '../rbac/guards/rbac.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

describe('PostsController', () => {
  let controller: PostsController;
  let postsService: PostsService;
  let rbacService: RbacService;

  const mockPost = {
    id: 1,
    title: 'Test Post',
    content: 'Test Content',
    published: false,
    authorId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUser = {
    id: 1,
    email: 'test@test.com',
    roleId: 1,
  };

  const mockPostsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockRbacService = {
    hasPermission: jest.fn().mockResolvedValue(true),
    canUpdatePost: jest.fn(),
    canDeletePost: jest.fn(),
  };

  beforeEach(async () => {
    let builder = Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        {
          provide: PostsService,
          useValue: mockPostsService,
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

    controller = module.get<PostsController>(PostsController);
    postsService = module.get<PostsService>(PostsService);
    rbacService = module.get<RbacService>(RbacService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a post', async () => {
      const createPostDto: CreatePostDto = {
        title: 'Test Post',
        content: 'Test Content',
        authorId: 1,
      };

      mockPostsService.create.mockResolvedValue(mockPost);

      const result = await controller.create(createPostDto);

      expect(result).toEqual(mockPost);
      expect(postsService.create).toHaveBeenCalledWith(createPostDto);
    });
  });

  describe('findAll', () => {
    it('should return all posts', async () => {
      mockPostsService.findAll.mockResolvedValue([mockPost]);

      const result = await controller.findAll();

      expect(result).toEqual([mockPost]);
      expect(postsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a post by id', async () => {
      mockPostsService.findOne.mockResolvedValue(mockPost);

      const result = await controller.findOne(1);

      expect(result).toEqual(mockPost);
      expect(postsService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a post when user is owner', async () => {
      const updatePostDto: UpdatePostDto = {
        title: 'Updated Title',
      };

      const req = { user: mockUser } as any;

      mockRbacService.canUpdatePost.mockResolvedValue(true);
      mockPostsService.update.mockResolvedValue({ ...mockPost, ...updatePostDto });

      const result = await controller.update(req, 1, updatePostDto);

      expect(result).toBeDefined();
      expect(rbacService.canUpdatePost).toHaveBeenCalledWith(mockUser.id, 1);
      expect(postsService.update).toHaveBeenCalledWith(1, updatePostDto);
    });

    it('should throw ForbiddenException when user cannot update post', async () => {
      const updatePostDto: UpdatePostDto = {
        title: 'Updated Title',
      };

      const req = { user: mockUser } as any;

      mockRbacService.canUpdatePost.mockResolvedValue(false);

      await expect(controller.update(req, 1, updatePostDto)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw ForbiddenException when user not authenticated', async () => {
      const updatePostDto: UpdatePostDto = {
        title: 'Updated Title',
      };

      const req = { user: null } as any;

      await expect(controller.update(req, 1, updatePostDto)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('remove', () => {
    it('should delete a post when user is owner', async () => {
      const req = { user: mockUser } as any;

      mockRbacService.canDeletePost.mockResolvedValue(true);
      mockPostsService.remove.mockResolvedValue(mockPost);

      const result = await controller.remove(req, 1);

      expect(result).toEqual(mockPost);
      expect(rbacService.canDeletePost).toHaveBeenCalledWith(mockUser.id, 1);
      expect(postsService.remove).toHaveBeenCalledWith(1);
    });

    it('should throw ForbiddenException when user cannot delete post', async () => {
      const req = { user: mockUser } as any;

      mockRbacService.canDeletePost.mockResolvedValue(false);

      await expect(controller.remove(req, 1)).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException when user not authenticated', async () => {
      const req = { user: null } as any;

      await expect(controller.remove(req, 1)).rejects.toThrow(ForbiddenException);
    });
  });
});
