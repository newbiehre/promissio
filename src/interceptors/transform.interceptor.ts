import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// any class
interface ClassConstrcutor {
  new (...args: any[]): {};
}

export function Transform(dto: ClassConstrcutor) {
  return UseInterceptors(new TransformInterceptor(dto));
}

class TransformInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(context: never, handler: CallHandler): Observable<any> {
    // run before request is handled by request handler
    // console.log('Running before handler', context);
    console.log('transform-interceptor before request is handled by hamdler');
    // console.log('Running before handler', context);

    return handler.handle().pipe(
      map((data: any) => {
        // run before response is sent out.
        // console.log('Running before response is sent out', data)
        console.log('transform-interceptor before response sent out');
        console.log(data);
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true, // ensures instance tied to dto rules
        });
      }),
    );
  }
}
