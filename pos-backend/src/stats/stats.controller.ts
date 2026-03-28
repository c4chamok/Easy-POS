import { Controller, Get, Query } from '@nestjs/common';
import { StatsService } from './stats.service';
import { ApiResponse } from '../common/utils/api-response';

@Controller('api/stats')
export class StatsController {
  constructor(private statsService: StatsService) {}

  @Get()
  async getStats(@Query('days') days: string) {
    const parsedDays = parseInt(days) || 7;
    return ApiResponse.success(await this.statsService.getStats(parsedDays));
  }
}
