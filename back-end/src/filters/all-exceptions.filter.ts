import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

interface IResponseBody {
  statusCode: number;
  message?: string;
  errorCode?: string;
  errorDetails?: unknown;
  path: string;
}

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
    const responseBody: IResponseBody = {
      statusCode: httpStatus,
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      if (typeof response === 'string') responseBody.message = response;
      else if ('message' in response)
        responseBody.message = Array.isArray(response.message)
          ? response.message[0]
          : response.message;
    } else if (exception instanceof Error) {
      responseBody.message = exception.message;
      if (exception instanceof PrismaClientKnownRequestError) {
        responseBody.errorCode = exception.code;
        responseBody.errorDetails = exception.meta;
      }
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }

  private handleUnhandledPromiseRejections(): void {
    process.on('unhandledRejection', (exception: unknown): void => {
      console.error('Unhandled Promise Rejection:', exception);
    });
  }
}
