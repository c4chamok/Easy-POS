import { Injectable } from '@nestjs/common';
import { CustomConfigService } from '../config/config.service';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(private readonly config: CustomConfigService) {
    super({
      adapter: new PrismaPg({ connectionString: config.getDBUrl() }),
    });
  }
}
