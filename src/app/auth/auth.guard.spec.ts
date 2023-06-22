import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from './auth.guard';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwtService: JwtService;
  let reflector: Reflector;

  const mockRequest = {
    headers: {
      authorization: `Bearer mock-token`,
    },
    switchToHttp: () => ({
      getRequest: () => mockRequest,
    }),
    currentUserJwt: undefined,
    getHandler: jest.fn(),
    getClass: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthGuard, JwtService, Reflector],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);
    jwtService = module.get<JwtService>(JwtService);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should bypass auth guard checks if there are any truthy decorators', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);

    const result = await guard.canActivate(mockRequest as any);
    expect(result).toBe(true);
    expect(mockRequest.currentUserJwt).toEqual(undefined);
  });

  it('should throw UnauthorizedException when token is missing', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

    const mockUser = {
      isApproved: true,
    };
    jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(mockUser);

    const missingHeaderRequest = {
      ...mockRequest,
      headers: {},
      switchToHttp: () => ({
        getRequest: () => missingHeaderRequest,
      }),
    };

    const result = guard.canActivate(missingHeaderRequest as any);
    expect(result).rejects.toThrow(UnauthorizedException);
    expect(result).rejects.toMatchObject({
      message: `Missing token.`,
    });
  });

  it('should allow access for approved user with valid token', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

    const mockUser = {
      isApproved: true,
    };
    jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(mockUser);

    const result = await guard.canActivate(mockRequest as any);
    expect(result).toBe(true);
    expect(mockRequest.currentUserJwt).toEqual(mockUser);
  });

  it('should throw ForbiddenException when user is not approved', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

    const mockUser = {
      isApproved: false,
    };
    jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(mockUser);

    const result = guard.canActivate(mockRequest as any);
    expect(result).rejects.toThrow(ForbiddenException);
    expect(result).rejects.toMatchObject({
      message: `User has not been approved.`,
    });
  });
});
