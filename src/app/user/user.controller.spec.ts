import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { randomUUID } from 'crypto';
import { FindUserDto, UpdateUserDto } from './user.request.dto';
import { User } from './user.entity';

describe('UserController', () => {
  let controller: UserController;
  let spyService: UserService;

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
    logs: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useFactory: () => ({
            findById: jest.fn(() => {}),
            update: jest.fn(() => {}),
            findAllApprovedUsers: jest.fn(() => []),
            findApprovedByEmail: jest.fn(() => {}),
          }),
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    spyService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getSelf', () => {
    it('called the service with expected params', () => {
      controller.getSelf(user);
      expect(spyService.findById).toHaveBeenCalledWith(user.id);
    });
  });

  describe('update self', () => {
    it('called the service with expected params', () => {
      const dto = new UpdateUserDto();
      controller.update(dto, user);
      expect(spyService.update).toHaveBeenCalledWith(dto, user.id);
    });
  });

  describe('get all approved users', () => {
    it('called the service with expected params', () => {
      controller.getAllUsers();
      expect(spyService.findAllApprovedUsers).toHaveBeenCalled();
    });
  });

  describe('get approved user by email', () => {
    it('called the service with expected params', () => {
      const dto = new FindUserDto();
      controller.getUserById(dto);
      expect(spyService.findApprovedByEmail).toHaveBeenCalledWith(dto.email);
    });
  });
});
