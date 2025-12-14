import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { RbacService } from '../rbac/rbac.service';
import { RbacGuard } from '../rbac/guards/rbac.guard';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

  const mockCategory = {
    id: 1,
    name: 'Technology',
    slug: 'technology',
    description: 'Tech related posts',
    createdAt: new Date(),
    updatedAt: new Date(),
    posts: [],
  };

  const mockCategoriesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockRbacService = {
    hasPermission: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    let builder = Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: mockCategoriesService,
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

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a category', async () => {
      const createCategoryDto: CreateCategoryDto = {
        name: 'Technology',
        slug: 'technology',
        description: 'Tech related posts',
      };

      mockCategoriesService.create.mockResolvedValue(mockCategory);

      const result = await controller.create(createCategoryDto);

      expect(result).toEqual(mockCategory);
      expect(service.create).toHaveBeenCalledWith(createCategoryDto);
    });
  });

  describe('findAll', () => {
    it('should return all categories', async () => {
      mockCategoriesService.findAll.mockResolvedValue([mockCategory]);

      const result = await controller.findAll();

      expect(result).toEqual([mockCategory]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a category by id', async () => {
      mockCategoriesService.findOne.mockResolvedValue(mockCategory);

      const result = await controller.findOne(1);

      expect(result).toEqual(mockCategory);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const updateCategoryDto: UpdateCategoryDto = {
        name: 'Science',
      };

      const updatedCategory = { ...mockCategory, ...updateCategoryDto };

      mockCategoriesService.update.mockResolvedValue(updatedCategory);

      const result = await controller.update(1, updateCategoryDto);

      expect(result).toEqual(updatedCategory);
      expect(service.update).toHaveBeenCalledWith(1, updateCategoryDto);
    });
  });

  describe('remove', () => {
    it('should delete a category', async () => {
      mockCategoriesService.remove.mockResolvedValue(mockCategory);

      const result = await controller.remove(1);

      expect(result).toEqual(mockCategory);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
