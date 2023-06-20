import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Admin1, User1, User2 } from '../../test-utils/utils';
import { User } from '../user/user.entity';
import { CreateUserDto } from '../user/user.request.dto';
import { AdminService } from './admin.service';

describe('AdminService', () => {
  let service: AdminService;
  let users = [User1, User2, Admin1];
  let existingUser1 = users[0];
  let existingUser2 = users[1];
  let existingAdmin = users[2];

  const MockUserRepositoryProvider = {
    provide: getRepositoryToken(User),
    useValue: {
      findBy: jest.fn(
        ({
          isApproved,
          isAdmin,
        }: {
          isApproved?: boolean;
          isAdmin?: boolean;
        }) =>
          Promise.resolve(
            users.filter((user) => {
              if (isApproved) return user.isApproved === isApproved;
              if (isAdmin) return user.isAdmin === isAdmin;
            }),
          ),
      ),
      findOneBy: jest.fn(
        ({
          id,
          email,
          isAdmin,
        }: {
          id?: string;
          email?: string;
          isAdmin?: boolean;
        }) => {
          let filtered = [];
          filtered = users.filter(
            (user) => (id && user.id === id) || (email && user.email === email),
          );
          if (isAdmin) {
            filtered = filtered.filter((user) => user.isAdmin === isAdmin);
          }
          return filtered.length <= 0 ? null : filtered[0];
        },
      ),
      create: jest.fn((dto: CreateUserDto) => dto),
      save: jest.fn((user: User) => Promise.resolve(user)),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminService, MockUserRepositoryProvider],
    }).compile();

    service = module.get<AdminService>(AdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // describe('createAdmin', () => {
  //   it('should create new user admin with hashed password', async () => {
  //     const email = 'new@gmail.com';
  //     const unhashedPassword = '12345';
  //     const createdUser = await service.create({
  //       ...new CreateUserDto(),
  //       email,
  //       password: unhashedPassword,
  //       isAdmin: true,
  //     });

  //     expect(createdUser.email).toBe(email);
  //     expect(createdUser.isAdmin).toBe(true);
  //     expect(createdUser.password).toBeDefined();
  //     expect(createdUser.password).not.toBe(unhashedPassword);
  //     expect(
  //       service.validatePassword(unhashedPassword, createdUser),
  //     ).resolves.not.toThrowError();
  //   });

  //   it('should throw ConflictException when creating admin with an existing email', async () => {
  //     const createdUserPromise = service.create({
  //       ...new CreateUserDto(),
  //       email: existingUser1.email,
  //     });

  //     expect(createdUserPromise).rejects.toThrowError(ConflictException);
  //     expect(createdUserPromise).rejects.toMatchObject({
  //       message: `Duplicate email: ${existingUser1.email}`,
  //     });
  //   });
  // });

  // describe('getAll', () => {
  //   it('should return array of users', async () => {
  //     const filteredUsers = await service.getAll(true, true);

  //     expect(Array.isArray(filteredUsers)).toBe(true);
  //   });
  // });

  // describe('getAdminById', () => {
  //   it('should return admin by id', async () => {
  //     const admin = await service.getAdminById(existingAdmin.id);

  //     expect(admin).toBe(existingAdmin);
  //   });

  //   it('should throw NotFoundException when retrieving admins using a user id', async () => {
  //     const userPromise = service.getAdminById(existingUser1.id);

  //     expect(userPromise).rejects.toThrowError(NotFoundException);
  //     expect(userPromise).rejects.toMatchObject({
  //       message: `No admin with id: ${existingUser1.id}`,
  //     });
  //   });
  // });

  describe('approveUserCreation', () => {
    it('should return allready approved user', async () => {
      expect(existingUser1.isApproved).toBe(true);

      const approveUser = await service.approveUserCreation(
        existingUser1.id,
        true,
      );

      expect(approveUser.isApproved).toBe(true);
    });

    it('should approve unapproved user', async () => {
      expect(existingUser2.isApproved).toBe(false);
      const approveUser = await service.approveUserCreation(
        existingUser2.id,
        true,
      );
      expect(approveUser.isApproved).toBe(true);
    });

    it('should be able to unapprove admin', async () => {
      expect(existingAdmin.isApproved).toBe(true);
      const unapproveAdmin = await service.approveUserCreation(
        existingAdmin.id,
        false,
      );

      expect(unapproveAdmin.isApproved).toBe(false);
    });

    it('should throw NotFoundException if user not found', async () => {
      const randomId = randomUUID();
      const approveUserPromise = service.approveUserCreation(randomId, true);

      expect(approveUserPromise).rejects.toThrowError(NotFoundException);
      expect(approveUserPromise).rejects.toMatchObject({
        message: `No user by id: ${randomId}`,
      });
    });
  });

  describe('makeAdmin', () => {
    it('should make user an admin', async () => {
      expect(existingUser1.isAdmin).toBe(false);
      const adminUser = await service.makeAdmin(existingUser1.id, true);

      expect(adminUser.isAdmin).toBe(true);
    });

    it('making an admin an admin does nothing', async () => {
      expect(existingAdmin.isAdmin).toBe(true);
      const adminUser = await service.makeAdmin(existingAdmin.id, true);

      expect(adminUser).toBe(existingAdmin);
    });

    it('can unapprove admin', async () => {
      expect(existingAdmin.isAdmin).toBe(true);
      const unapproveAdmin = await service.makeAdmin(existingAdmin.id, false);

      expect(unapproveAdmin.isAdmin).toBe(false);
    });

    it('should throw NotFoundException if user not found', async () => {
      const randomId = randomUUID();
      const adminUserPromise = service.makeAdmin(randomId, true);

      expect(adminUserPromise).rejects.toThrowError(NotFoundException);
      expect(adminUserPromise).rejects.toMatchObject({
        message: `No user by id: ${randomId}`,
      });
    });
  });
});
