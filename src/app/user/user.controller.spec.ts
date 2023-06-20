import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { FindUserDto, UpdateUserDto } from './user.request.dto';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  const user: User = {
    id: randomUUID(),
    firstName: 'Jodi',
    lastName: 'Chan',
    email: 'jodiAdmin@gmail.com',
    password: '12345',
    isApproved: true,
    isAdmin: true,
    myPromises: [],
    othersPromises: [],
    promiseLogs: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            findById: jest.fn(() => {}),
            update: jest.fn(() => {}),
            findAllApprovedUsers: jest.fn(() => []),
            findApprovedByEmail: jest.fn(() => {}),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getSelf', () => {
    it('called the service with expected params', () => {
      controller.getSelf(user);
      expect(userService.findExistingById).toHaveBeenCalledWith(user.id);
    });
  });

  describe('update self', () => {
    it('called the service with expected params', () => {
      const dto = new UpdateUserDto();
      controller.update(dto, user);
      expect(userService.update).toHaveBeenCalledWith(dto, user.id);
    });
  });

  describe('get all approved users', () => {
    it('called the service with expected params', () => {
      controller.getAllUsers();
      expect(userService.findAllApproved).toHaveBeenCalled();
    });
  });

  describe('get approved user by email', () => {
    it('called the service with expected params', () => {
      const dto = new FindUserDto();
      controller.getUserById(dto);
      expect(userService.findApprovedByEmail).toHaveBeenCalledWith(dto.email);
    });
  });
});
