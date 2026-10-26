import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class RpcToHttpExceptionFilter
  implements ExceptionFilter
{
  catch(
    exception: any,
    host: ArgumentsHost,
  ) {
    const response =
      host.switchToHttp().getResponse();

    if (
      exception?.name ===
      'TimeoutError'
    ) {
      return response
        .status(
          HttpStatus.GATEWAY_TIMEOUT,
        )
        .json({
          statusCode:
            HttpStatus.GATEWAY_TIMEOUT,
          message:
            'Tempo limite de comunicação com o serviço excedido',
        });
    }

    const statusCode =
      exception?.statusCode ??
      exception?.status ??
      exception?.error?.statusCode ??
      HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception?.message ??
      exception?.error?.message ??
      'Internal server error';

    return response
      .status(statusCode)
      .json({
        statusCode,
        message,
      });
  }
}