import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Catch()
export class AllExceptionsFilter extends BaseWsExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {
    super();
    this.handleUnhandledPromiseRejections();
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    if (exception instanceof WsException) {
      super.catch(exception, host);
      return;
    }

    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const responseBody = {
      statusCode: httpStatus,
      ...(exception instanceof Error
        ? {
            message: (exception as Error)?.message,
            errorCode: (exception as PrismaClientKnownRequestError)?.code,
            errorDetails: (exception as PrismaClientKnownRequestError)?.meta,
          }
        : {}),
      ...(exception instanceof HttpException
        ? { message: (exception as any)?.response?.message }
        : {}),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }

  private handleUnhandledPromiseRejections(): void {
    process.on('unhandledRejection', (exception: unknown): void => {
      console.error('Unhandled Promise Rejection:', exception);
    });
  }
}
