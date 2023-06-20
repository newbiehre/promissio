import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class HttpLoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, baseUrl: url } = request;
    const userAgent = request.get('user-agent' || '');

    response.on('finish', () => {
      const { statusCode } = response;
      this.logger.log(
        `${method} ${url} ${statusCode}:${response.statusMessage} - ${userAgent} ${ip}`,
      );
    });

    next();
  }
}
