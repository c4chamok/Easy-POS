import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '../../../generated/prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(error: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    let status = HttpStatus.BAD_REQUEST;
    let message = error.message;

    switch (error.code) {
      case 'P2002':
        message = 'Duplicate value already exists';
        break;
      case 'P2025':
        message = 'Record not found';
        status = HttpStatus.NOT_FOUND;
        break;
      case 'P2003':
        message = 'Invalid reference id';
        break;
    }

    res.status(status).json({
      success: false,
      error: message,
    });
  }
}
