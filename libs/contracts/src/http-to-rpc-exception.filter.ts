import {
  ArgumentsHost,
  Catch,
  HttpException,
} from '@nestjs/common';

import {
  RpcException,
  RpcExceptionFilter,
} from '@nestjs/microservices';

import {
  Observable,
  throwError,
} from 'rxjs';

@Catch(HttpException)
export class HttpToRpcExceptionFilter
  implements RpcExceptionFilter<HttpException>
{
  catch(
    exception: HttpException,
    host: ArgumentsHost,
  ): Observable<never> {
    const response = exception.getResponse();

    let message = exception.message;

    if (
      typeof response === 'object' &&
      response !== null &&
      'message' in response
    ) {
      const responseMessage = (
        response as { message?: string | string[] }
      ).message;

      if (Array.isArray(responseMessage)) {
        message = responseMessage.join(', ');
      } else if (responseMessage) {
        message = responseMessage;
      }
    }

    return throwError(
      () =>
        new RpcException({
          statusCode: exception.getStatus(),
          message,
        }),
    );
  }
}