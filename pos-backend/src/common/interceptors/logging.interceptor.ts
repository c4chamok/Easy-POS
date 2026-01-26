import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();
    const { method, url } = req;
    const start = Date.now();

    return next.handle().pipe(
      tap({
        next: () =>
          console.log(`${method} ${url} -> ${Date.now() - start}ms [SUCCESS]`),
        error: (err: { message: string }) =>
          console.error(
            `${method} ${url} -> ${Date.now() - start}ms [ERROR]:`,
            err.message,
          ),
      }),
    );
  }
}
