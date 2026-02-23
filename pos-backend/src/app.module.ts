import { Module } from '@nestjs/common';
import { CustomConfigModule } from './config/config.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { AllExceptionsFilter } from './common/filters/allException.filter';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ProductModule } from './product/product.module';
import { RedisModule } from './redis/redis.module';
import { TestModule } from './test/test.module';
import { PrismaExceptionFilter } from './common/filters/prismaException.filter';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [
    AuthModule,
    JwtModule.register({ global: true }),
    CustomConfigModule,
    PrismaModule,
    RedisModule,
    UsersModule,
    ProductModule,
    TestModule,
    CartModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_FILTER, useClass: PrismaExceptionFilter },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    JwtService,
  ],
  exports: [JwtModule],
})
export class AppModule {}
