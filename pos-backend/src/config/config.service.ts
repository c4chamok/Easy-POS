import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CustomConfigService {
  constructor(private configService: ConfigService) {}

  getPort(): number | undefined {
    return this.configService.get<number>('PORT');
  }
  getJWTSecret(): string | undefined {
    return this.configService.get<string>('JWT_SECRET');
  }
  getDBUrl(): string | undefined {
    return this.configService.get<string>('DATABASE_URL');
  }
  getFrontendUrl(): string | undefined {
    return this.configService.get<string>('FRONTEND_URL');
  }
  getRedisHost() {
    return this.configService.get<string>('REDIS_HOST');
  }
  getRedisPort() {
    return this.configService.get<number>('REDIS_PORT');
  }
  getRedisPassword() {
    return this.configService.get<string>('REDIS_PASSWORD');
  }
}
