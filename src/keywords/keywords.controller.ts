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
} from '@nestjs/common';
import { KeywordsService } from './keywords.service';
import { CreateKeywordDto } from './dto/create-keyword.dto';
import { UpdateKeywordDto } from './dto/update-keyword.dto';
import { RequirePermission } from '../rbac/decorators';
import { RbacGuard } from '../rbac/guards';
import { StrictThrottle, NormalThrottle, RelaxedThrottle } from '../throttle/throttle.decorator';

@Controller('keywords')
export class KeywordsController {
  constructor(private readonly keywordsService: KeywordsService) {}

  @Post()
  @NormalThrottle()
  @UseGuards(RbacGuard)
  @RequirePermission({ resource: 'keyword', action: 'create' })
  create(@Body() createKeywordDto: CreateKeywordDto) {
    return this.keywordsService.create(createKeywordDto);
  }

  @Get()
  @RelaxedThrottle()
  findAll() {
    return this.keywordsService.findAll();
  }

  @Get(':id')
  @RelaxedThrottle()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.keywordsService.findOne(id);
  }

  @Patch(':id')
  @NormalThrottle()
  @UseGuards(RbacGuard)
  @RequirePermission({ resource: 'keyword', action: 'update' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateKeywordDto: UpdateKeywordDto,
  ) {
    return this.keywordsService.update(id, updateKeywordDto);
  }

  @Delete(':id')
  @NormalThrottle()
  @UseGuards(RbacGuard)
  @RequirePermission({ resource: 'keyword', action: 'delete' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.keywordsService.remove(id);
  }
}
