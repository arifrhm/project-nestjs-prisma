import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateKeywordDto } from './dto/create-keyword.dto';
import { UpdateKeywordDto } from './dto/update-keyword.dto';

@Injectable()
export class KeywordsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createKeywordDto: CreateKeywordDto) {
    return this.prisma.keyword.create({
      data: createKeywordDto,
      include: {
        posts: true,
      },
    });
  }

  async findAll() {
    return this.prisma.keyword.findMany({
      include: {
        posts: true,
      },
    });
  }

  async findOne(id: number) {
    const keyword = await this.prisma.keyword.findUnique({
      where: { id },
      include: {
        posts: true,
      },
    });

    if (!keyword) {
      throw new NotFoundException(`Keyword with ID ${id} not found`);
    }

    return keyword;
  }

  async update(id: number, updateKeywordDto: UpdateKeywordDto) {
    const keyword = await this.findOne(id);

    return this.prisma.keyword.update({
      where: { id },
      data: updateKeywordDto,
      include: {
        posts: true,
      },
    });
  }

  async remove(id: number) {
    const keyword = await this.findOne(id);

    return this.prisma.keyword.delete({
      where: { id },
      include: {
        posts: true,
      },
    });
  }
}
