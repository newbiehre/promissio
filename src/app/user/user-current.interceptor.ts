import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from './user.entity';
import { UserService } from './user.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  private readonly logger = new Logger(CurrentUserInterceptor.name);

  constructor(private readonly userService: UserService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const currentUserId: string | null = request.currentUserJwt?.sub;

    if (!currentUserId) {
      this.logger.warn(`No JWT token in request.`);
    }

    let user: User | null = null;
    try {
      user = await this.userService.findExistingById(currentUserId);
    } catch (error) {
      this.logger.error(
        `Cannot find existing user with userId: ${user.id}`,
        error.stack,
      );
      console.error(error);
    }

    request.currentUser = user;
    return next.handle();
  }
}
