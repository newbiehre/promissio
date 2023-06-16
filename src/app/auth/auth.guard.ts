import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { CurrentUserJwt } from 'src/app/auth/auth.service';
import { IS_PUBLIC_KEY } from '../utils/public.decorator';
import { ENABLE_NON_APPROVED_USER } from '../user/enable-nonapproved-user.decorator';

interface MyHeaders extends Headers {
  authorization?: string;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Allow Public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // Check Auth
    const enableNonApprovedUser = this.reflector.getAllAndOverride<boolean>(
      ENABLE_NON_APPROVED_USER,
      [context.getHandler(), context.getClass()],
    );

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    let isApprovedUser = false;

    if (!token) throw new UnauthorizedException('Missing token.');
    try {
      const payload = (await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET_KEY,
      })) as CurrentUserJwt;

      request['currentUserJwt'] = payload;
      isApprovedUser = payload.isApproved;
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('Issue with token');
    }

    if (enableNonApprovedUser) return true;
    if (!isApprovedUser)
      throw new ForbiddenException('User has not been approved yet.');

    return isApprovedUser;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] =
      (request.headers as MyHeaders).authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
