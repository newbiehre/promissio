import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AuthModule } from '../src/app/auth/auth.module';

import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { DatabaseModule } from 'src/configs/database.module';
import { User } from '../src/app/users/user.entity';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let db: DataSource;
  let httpServer: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, AuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    db = moduleFixture.get<DataSource>(DataSource);

    await app.init();
    // app.useLogger(false);
    httpServer = app.getHttpServer();
  });

  afterAll(async () => {
    // await db.dropDatabase();
    await db.destroy();
    await app.close();
  });

  describe('/auth/signup (POST)', () => {
    const signupUrl = '/auth/signup';
    const signupDto = {
      firstName: 'random',
      lastName: 'randomer',
      email: 'random@gmail.com',
      password: '123',
    };

    it('should sign up new user successfully', () => {
      return request(httpServer)
        .post(signupUrl)
        .send(signupDto)
        .expect(201, {});
    });

    it('should throw ConflictException if signing up with existing email', () => {
      return request(httpServer)
        .post(signupUrl)
        .send(signupDto)
        .expect({
          statusCode: 409,
          message: `Duplicate email: ${signupDto.email}`,
          error: 'Conflict',
        });
    });

    afterAll(() => {
      db.createQueryBuilder()
        .delete()
        .from(User)
        .where('email = :email', { email: signupDto.email })
        .execute();
    });
  });

  describe('/auth/login (POST)', () => {
    const loginUrl = '/auth/login';

    it('should sign up new user successfully', async () => {
      return request(httpServer)
        .post(loginUrl)
        .send({
          email: 'jodi@gmail.com',
          password: '123',
        })
        .expect(201)
        .then((res) => {
          expect(res.body.access_token).toBeDefined();
        });
    });

    it('should throw NotFoundException if user enters unregistered email', () => {
      const unregisteredEmail = 'random@gmail.com';
      return request(httpServer)
        .post(loginUrl)
        .send({
          email: unregisteredEmail,
          password: '123',
        })
        .expect({
          statusCode: 404,
          message: `No user by email: ${unregisteredEmail}`,
          error: 'Not Found',
        });
    });

    it('should throw BadRequestException if user enters invalid password', () => {
      return request(httpServer)
        .post(loginUrl)
        .send({
          email: 'jodi@gmail.com',
          password: 'invalid-password',
        })
        .expect(400, {
          statusCode: 400,
          message: `Bad password`,
          error: 'Bad Request',
        });
    });
  });
});
