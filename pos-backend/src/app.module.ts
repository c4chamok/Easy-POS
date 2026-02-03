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

@Module({
  imports: [
    AuthModule,
    JwtModule.register({ global: true }),
    CustomConfigModule,
    PrismaModule,
    UsersModule,
    ProductModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    JwtService,
  ],
  exports: [JwtModule],
})
export class AppModule {}
