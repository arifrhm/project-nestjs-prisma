import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { RequirePermission } from '../rbac/decorators';
import { RbacGuard } from '../rbac/guards';
import { StrictThrottle, NormalThrottle, RelaxedThrottle } from '../throttle/throttle.decorator';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @NormalThrottle()
  @UseGuards(RbacGuard)
  @RequirePermission({ resource: 'category', action: 'create' })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @RelaxedThrottle()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @RelaxedThrottle()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @NormalThrottle()
  @UseGuards(RbacGuard)
  @RequirePermission({ resource: 'category', action: 'update' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @NormalThrottle()
  @UseGuards(RbacGuard)
  @RequirePermission({ resource: 'category', action: 'delete' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.remove(id);
  }
}
