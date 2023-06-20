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
    let user = null;
    try {
      user = await this.userService.findExistingById(currentUserId);
    } catch (e) {
      console.error(e);
    }
    const currentUser: User | null = currentUserId && user;
    request.currentUser = currentUser;
    return next.handle();
  }
}
