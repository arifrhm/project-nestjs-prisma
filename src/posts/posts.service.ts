import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto) {
    return this.prisma.post.create({
      data: createPostDto,
      include: {
        author: true,
      },
    });
  }

  async findAll() {
    return this.prisma.post.findMany({
      include: {
        author: true,
      },
    });
  }

  async findOne(id: number) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
      },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.findOne(id);

    return this.prisma.post.update({
      where: { id },
      data: updatePostDto,
      include: {
        author: true,
      },
    });
  }

  async remove(id: number) {
    const post = await this.findOne(id);

    return this.prisma.post.delete({
      where: { id },
      include: {
        author: true,
      },
    });
  }
}
