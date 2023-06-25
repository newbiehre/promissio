import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AdminGuard } from '../src/app/admins/admin.guard';
import { AdminModule } from '../src/app/admins/admin.module';
import { DatabaseModule } from '../src/configs/database.module';
import { UserAdminProtectedDto } from '../src/app/users/user.response.dto';

describe('AdminController (e2e)', () => {
  let app: INestApplication;
  let db: DataSource;
  let httpServer: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, AdminModule],
    })
      .overrideGuard(AdminGuard)
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .compile();

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

  describe('/admin/admins (GET)', () => {
    it('get admins', async () => {
      return request(httpServer)
        .get('/admin')
        .then((res) => {
          const items = res.body;
          expect(Array.isArray(items)).toBe(true);

          const admin = items[0];
          expect(admin).toMatchObject<UserAdminProtectedDto>({
            firstName: expect.any(String),
            lastName: expect.any(String),
            email: expect.any(String),
            isApproved: expect.any(Boolean),
            isAdmin: expect.any(Boolean),
          });
        });
    });
  });
});
