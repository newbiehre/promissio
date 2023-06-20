import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { User1 } from '../../test-utils/utils';
import { User } from './user.entity';
import { CreateUserDto, SignupDto, UpdateUserDto } from './user.request.dto';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let existingUser = User1;

  const MockUserRepositoryProvider = {
    provide: getRepositoryToken(User),
    useValue: {
      findBy: jest.fn((isApproved: boolean) => Promise.resolve([existingUser])),
      findOneBy: jest.fn(({ id, email }: { id?: string; email?: string }) => {
        let user = null;
        if (
          (id && id === existingUser.id) ||
          (email && email === existingUser.email)
        ) {
          user = Promise.resolve(existingUser);
        }
        return user;
      }),
      create: jest.fn((dto: SignupDto) => dto),
      save: jest.fn((user: User) => Promise.resolve(user)),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, MockUserRepositoryProvider],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('userService should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findById', () => {
    it('show return an existing user when id exists', async () => {
      const user = await service.findExistingById(existingUser.id);

      expect(user.id).toBe(existingUser.id);
      expect(user.email).toBe(existingUser.email);
    });

    it('show throw NotFoundException when user with id does not exist', async () => {
      const randomId = randomUUID();
      const userPromise = service.findExistingById(randomId);

      expect(userPromise).rejects.toThrowError(NotFoundException);
      expect(userPromise).rejects.toMatchObject({
        message: `No user by id: ${randomId}`,
      });
    });
  });

  describe('findByEmail', () => {
    it('show return an existing user when email exists', async () => {
      const user = await service.findExistingByEmail(existingUser.email);

      expect(user.id).toBe(existingUser.id);
      expect(user.email).toBe(existingUser.email);
    });

    it('show throw NotFoundException when user with email does not exist', async () => {
      const randomEmail = 'randomEmail@email.com';
      const userPromise = service.findExistingByEmail(randomEmail);

      expect(userPromise).rejects.toThrowError(NotFoundException);
      expect(userPromise).rejects.toMatchObject({
        message: `No user by email: ${randomEmail}`,
      });
    });
  });

  describe('createUser', () => {
    it('should create new user with hashed password', async () => {
      const email = 'new@gmail.com';
      const unhashedPassword = '12345';
      const createdUser = await service.createUser({
        ...new SignupDto(),
        email,
        password: unhashedPassword,
      });

      expect(createdUser.email).toBe(email);
      expect(createdUser.isAdmin).not.toBeDefined();
      expect(createdUser.password).toBeDefined();
      // Check that the hashed password is not the same as the input password
      expect(createdUser.password).not.toBe(unhashedPassword);
      expect(
        service.validatePassword(unhashedPassword, createdUser),
      ).resolves.not.toThrowError();
    });

    it('show throw ConflictException when creating user with an existing email', async () => {
      const createdUserPromise = service.create({
        ...new CreateUserDto(),
        email: existingUser.email,
      });

      expect(createdUserPromise).rejects.toThrowError(ConflictException);
      expect(createdUserPromise).rejects.toMatchObject({
        message: `Duplicate email: ${existingUser.email}`,
      });
    });

    describe('findAllApprovedUsers', () => {
      it('should return array of approved users', async () => {
        const approvedUser = await service.findApprovedByEmail(
          existingUser.email,
        );
        expect(approvedUser).toBe(existingUser);
      });

      it('show return empty array if no approved users found', async () => {
        MockUserRepositoryProvider.useValue.findBy.mockImplementation(
          jest.fn(() => Promise.resolve([])),
        );

        const approvedUsers = await service.findAllApproved();
        expect(approvedUsers).toEqual([]);
      });
    });

    describe('findApprovedByEmail', () => {
      it('return approved user by email', async () => {
        const approvedUserByEmail = await service.findApprovedByEmail(
          existingUser.email,
        );
        expect(approvedUserByEmail).toBe(existingUser);
      });

      it('return empty array if there are no approved users', async () => {
        const randomEmail = 'rando@gmail.com';
        const userPromise = service.findApprovedByEmail(randomEmail);

        expect(userPromise).rejects.toThrowError(NotFoundException);
        expect(userPromise).rejects.toMatchObject({
          message: `No user by email: ${randomEmail}`,
        });
      });
    });

    describe('update', () => {
      it('should update user (without pw changes) successfully', async () => {
        const newEmail = 'newEmail@email.com';
        const updateDto = {
          email: newEmail,
        };
        const user = await service.update(updateDto, existingUser.id);

        expect(user.id).toBe(existingUser.id);
        expect(user.firstName).toBe(existingUser.firstName);
        expect(user.email).toBe(newEmail);
      });

      it('should throw NotFoundException when updating on an non-existant user', async () => {
        const randomUserId = randomUUID();
        const userPromise = service.update(new UpdateUserDto(), randomUserId);

        expect(userPromise).rejects.toThrowError(NotFoundException);
        expect(userPromise).rejects.toMatchObject({
          message: `No user by id: ${randomUserId}`,
        });
      });

      it('should update user (with pw changes) successfully', async () => {
        const existingUserPassword = '1234';
        existingUser.password = await service.hashPassword(
          existingUserPassword,
        );
        expect(existingUser.password).not.toBe(existingUserPassword);

        const newPassword = 'new1234';
        const updateDto = {
          oldPassword: existingUserPassword,
          newPassword,
        };
        const updatedUser = await service.update(updateDto, existingUser.id);

        expect(updatedUser.id).toBe(existingUser.id);
        expect(updatedUser.firstName).toBe(existingUser.firstName);
        expect(updatedUser.password).toBeDefined();
        expect(updatedUser.password).not.toBe(newPassword);
        expect(updatedUser.password).not.toBe(existingUser.password);
        expect(
          service.validatePassword(newPassword, updatedUser),
        ).resolves.not.toThrowError();
      });

      it('show throw BadRequestException when updating password with wrong old password', async () => {
        const updateDto = {
          oldPassword: 'bad-password',
          newPassword: 'new1234',
        };
        const userPromise = service.update(updateDto, existingUser.id);

        expect(userPromise).rejects.toThrowError(BadRequestException);
        expect(userPromise).rejects.toMatchObject({
          message: `Bad password`,
        });
      });
    });
  });
});
