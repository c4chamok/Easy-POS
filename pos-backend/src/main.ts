import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import * as fs from 'fs';

async function bootstrap() {
  const isDev = process.env.NODE_ENV !== 'production';

  const httpsOptions = isDev
    ? {
        key: fs.readFileSync('certs/192.168.10.23+1-key.pem'),
        cert: fs.readFileSync('certs/192.168.10.23+1.pem'),
      }
    : undefined;

  const app = await NestFactory.create(AppModule, { httpsOptions });

  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5173/',
      'http://192.168.10.23:5173',
      'http://192.168.10.23:5173/',
    ],
    credentials: true,
  });

  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((e: any) => {
  console.log('error : ', e);
});
