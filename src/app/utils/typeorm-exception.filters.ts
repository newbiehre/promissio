import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { TypeORMError } from 'typeorm';

@Catch(TypeORMError)
export class TypeOrmExceptionFilter implements ExceptionFilter {
  catch(exception: TypeORMError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    response.json({
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      name: 'Database',
      message: `${exception.name}: ${exception.message}`,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
