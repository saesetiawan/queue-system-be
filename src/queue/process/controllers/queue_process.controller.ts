import { Controller, Param, Post, Body, Get, UseGuards } from '@nestjs/common';
import type { GetNumber, TakeNumber } from '../dtos/GetNumber';
import { QueueProcessNumberService } from '../services/queue_process_number.service';
import { UserDecorator } from '../../../auth/decorators/user.decorator';
import type { JwtPayload } from '../../../auth/dtos/jwt.dto';
import { JwtAuthGuard } from '../../../auth/guard/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('/api/queue/process')
export class QueueProcessController {
  constructor(
    private readonly queueProcessNumberService: QueueProcessNumberService,
  ) {}

  @Get('/number/:serviceId')
  async getNumber(
    @Param('serviceId') serviceId: string,
    @UserDecorator() user: JwtPayload,
  ): Promise<GetNumber> {
    console.log('user', user);
    return await this.queueProcessNumberService.getNumberByServiceId(serviceId);
  }

  @Post('/take/number')
  async takeNumber(
    @Body() body: TakeNumber,
    @UserDecorator() user: JwtPayload,
  ): Promise<GetNumber> {
    console.log('user', user);
    return await this.queueProcessNumberService.takeNumberByServiceId(
      user.companyId,
      body.service_id,
    );
  }
}
