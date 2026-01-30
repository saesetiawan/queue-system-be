import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put, UseGuards,
} from '@nestjs/common';
import { QueueServicesService } from '../services/queue_service.service';
import { CreateQueueServiceDto } from '../dtos/create_queue_service.dto';
import { UpdateQueueServiceDto } from '../dtos/update_queue_service.dto';
import { UserDecorator } from '../../../auth/decorators/user.decorator';
import type { JwtPayload } from '../../../auth/dtos/jwt.dto';
import { JwtAuthGuard } from '../../../auth/guard/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('/api/queue/service')
export class QueueServicesController {
  constructor(private readonly queueService: QueueServicesService) {}

  @Post()
  create(
    @Body() dto: CreateQueueServiceDto,
    @UserDecorator() user: JwtPayload,
  ) {
    return this.queueService.create(user.companyId, dto);
  }

  @Get()
  findAll(
    @UserDecorator() user: JwtPayload,
    @Query('page') page = 1,
    @Query('perPage') perPage = 10,
    @Query('search') search?: string,
  ) {
    return this.queueService.findAll(user?.companyId, page, perPage, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.queueService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateQueueServiceDto,
    @UserDecorator() user: JwtPayload,
  ) {
    dto.id = id;
    return this.queueService.update(user.companyId, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.queueService.delete(id);
  }
}
