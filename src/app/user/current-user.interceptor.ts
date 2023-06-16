import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from './user.service';
import { User } from './user.entity';

@Injectable()
export class UserInterceptor implements NestInterceptor {
  constructor(private readonly userService: UserService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const currentUserId: string | null = request.currentUserJwt?.sub;
    const currentUser: User | null =
      currentUserId && (await this.userService.findById(currentUserId));
    request.currentUser = currentUser;
    return next.handle();
  }
}
