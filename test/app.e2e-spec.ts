import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { UserService } from '../src/user/user.service';
import { User } from '../src/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormconfig from '../orm.config';

describe('UserController E2E', () => {
  let app: INestApplication;
  let userService: UserService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(ormconfig), TypeOrmModule.forFeature([User]), AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    userService = moduleRef.get(UserService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('/GET users', async () => {
    // const user: User = { username: 'test-user', password: 'test-password' };
    const user = new User();
    // user.id = 200;
    user.username = 'test-user-get';
    user.password = 'test-password-get';
    await userService.create(user);

    // eslint-disable-next-line prettier/prettier
    return await request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual([user]);
      });
  });

  it('/POST user', async () => {
    // const user: User = { username: 'test-user-create', password: 'test-password-create' };
    const user = new User();
    // id не знаем до записи в БД
    user.username = 'test-user-post';
    user.password = 'test-password-post';
    const result = await request(app.getHttpServer())
      .post('/users')
      .send(user)
      .expect(201)
      .expect((res) => {
        user.id = res.body.id; // записываем id для полного сравнения
        console.log('res.body.id= ', res.body.id);
        expect(res.body).toEqual(user);
      });
    console.log('POST user result.body= ', result.body);
    await userService.deleteAll();
    return;
  });

  it('/GET user by id', async () => {
    // const user: User = { username: 'test-user', password: 'test-password' };
    const user = new User();
    // id не знаем до записи в БД
    user.username = 'test-user-post';
    user.password = 'test-password-post';
    const createdUser = await userService.create(user);

    const result = await request(app.getHttpServer())
      .get(`/users/${createdUser.id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(createdUser);
      });
    console.log('/GET user by id result.body= ', result.body);
    await userService.deleteAll();
    return result;
  });

  it('/PUT user', async () => {
    // const user: User = { username: 'test-user', password: 'test-password' };
    const user = new User();
    // id не знаем до записи в БД
    user.username = 'test-user-post';
    user.password = 'test-password-post';
    const createdUser = await userService.create(user);

    const updatedUser = {
      id: createdUser.id,
      username: 'updated-username',
      password: 'updated-password',
    };

    const result = await request(app.getHttpServer())
      .put(`/users/${createdUser.id}`)
      .send(updatedUser)
      .expect(200)
      // .expect(updatedUser);
      .expect((res) => {
        expect(res.body).toEqual(updatedUser);
      });
    console.log('/PUT user result.body= ', result.body);
    await userService.deleteAll();
    return result;
  });

  it('/DELETE user', async () => {
    // const user: User = { username: 'test-user', password: 'test-password' };
    const user = new User();
    // id не знаем до записи в БД
    user.username = 'test-user-post';
    user.password = 'test-password-post';
    const createdUser = await userService.create(user);

    const result = await request(app.getHttpServer())
      .delete(`/users/${createdUser.id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual({ "raw": [], "affected": 1 });
      });
    console.log('/DELETE user result.body= ', result.body);
    return result;
  });

  afterEach(async () => {
    await userService.deleteAll();
  });
});
