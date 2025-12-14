import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: createCategoryDto,
      include: {
        posts: true,
      },
    });
  }

  async findAll() {
    return this.prisma.category.findMany({
      include: {
        posts: true,
      },
    });
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        posts: true,
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);

    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
      include: {
        posts: true,
      },
    });
  }

  async remove(id: number) {
    const category = await this.findOne(id);

    return this.prisma.category.delete({
      where: { id },
      include: {
        posts: true,
      },
    });
  }
}
