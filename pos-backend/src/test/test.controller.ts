import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { mockProducts } from '../data/mockData';
import { RedisService } from '../redis/redis.service';

@Controller('api/test')
export class TestController {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}
  @Get('hello')
  hello() {
    return { message: 'Hello, World!' };
  }

  @Get('seed/product')
  async seedProduct() {
    const { count } = await this.prisma.product.createMany({
      data: mockProducts,
    });
    return { success: true, count };
  }

  @Post('redis')
  async setRedis(
    @Query('key') key: string,
    @Body() body: { id: string; value: string },
  ) {
    await this.redis.setRedis(key, body);
  }
  @Get('redis')
  async getRedis(@Query('key') key: string) {
    return await this.redis.getRedis<{ idx: string; valuet: string }>(key);
  }
  @Get('redis/keys')
  async getRedisKeys(@Query('set') set: string) {
    return await this.redis.getMany<{ id: string; value: string }>(set);
  }
}
