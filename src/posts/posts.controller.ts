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
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { RbacService } from '../rbac/rbac.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { RequirePermission } from '../rbac/decorators';
import { RbacGuard } from '../rbac/guards';
import type { AuthRequest } from '../rbac/types';
import { StrictThrottle, NormalThrottle, RelaxedThrottle } from '../throttle/throttle.decorator';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly rbacService: RbacService,
  ) {}

  @Post()
  @NormalThrottle()
  @UseGuards(RbacGuard)
  @RequirePermission({ resource: 'post', action: 'create' })
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  @RelaxedThrottle()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  @RelaxedThrottle()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  @NormalThrottle()
  @UseGuards(RbacGuard)
  @RequirePermission(
    { resource: 'post', action: 'update_own' },
    { resource: 'post', action: 'update_any' },
  )
  async update(
    @Req() req: AuthRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    if (!req.user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Check if user can update this post (owner or admin)
    const canUpdate = await this.rbacService.canUpdatePost(req.user.id, id);
    if (!canUpdate) {
      throw new ForbiddenException(
        'You do not have permission to update this post',
      );
    }

    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  @NormalThrottle()
  @UseGuards(RbacGuard)
  @RequirePermission(
    { resource: 'post', action: 'delete_own' },
    { resource: 'post', action: 'delete_any' },
  )
  async remove(
    @Req() req: AuthRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    if (!req.user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Check if user can delete this post (owner or admin)
    const canDelete = await this.rbacService.canDeletePost(req.user.id, id);
    if (!canDelete) {
      throw new ForbiddenException(
        'You do not have permission to delete this post',
      );
    }

    return this.postsService.remove(id);
  }
}
