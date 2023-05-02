import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

// const isPrismaError = (
//   exception: unknown,
// ): exception is
//   | PrismaClientKnownRequestError
//   | PrismaClientUnknownRequestError
//   | PrismaClientRustPanicError
//   | PrismaClientInitializationError
//   | PrismaClientValidationError => {
//   return (
//     exception instanceof Error &&
//     'message' in
//       (exception as
//         | PrismaClientKnownRequestError
//         | PrismaClientUnknownRequestError
//         | PrismaClientRustPanicError
//         | PrismaClientInitializationError
//         | PrismaClientValidationError)
//   );
// };

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const responseBody = {
      statusCode: httpStatus,
      message: (exception as Error).message,
      ...(exception instanceof Error
        ? {
            errorCode: (exception as PrismaClientKnownRequestError).code,
            errorDetails: (exception as PrismaClientKnownRequestError).meta,
          }
        : {}),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
