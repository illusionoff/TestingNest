import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { UserController } from '../src/user/user.controller';
import { UserService } from '../src/user/user.service';
import { User } from '../src/entities/user.entity';
import ormconfig from '../orm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../src/user/user.module';
import { UserRepository } from '../src/repository/user.repository';

// С Использованием реальных данных в бд и подключением реальных данных
describe('UserController', () => {
  let app: INestApplication;

  // Можно так вариант 1
  // const userService = {
  //   findAll() {
  //     return [{ id: 89, username: 'test-user', password: 'test-password' }];
  //   },
  // };

  // Можно так вариант 2
  const userService = { findAll: () => [{ id: 89, username: 'test-user', password: 'test-password' }] };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [UserModule, TypeOrmModule.forRoot(ormconfig), TypeOrmModule.forFeature([User, UserRepository])],
      // providers: [UserService],
    })
      .overrideProvider(userService)
      .useValue(userService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/GET users`, () => {
    const usersRequest = request(app.getHttpServer()).get('/users').expect(200).expect(userService.findAll());
    // следующий вариант из офф источника не работает
    // https://docs.nestjs.com/fundamentals/testing
    // const usersRequest = request(app.getHttpServer()).get('/users').expect(200).expect({
    //   data: userService.findAll(),
    // });

    console.log('userService.findAll()= ', userService.findAll());
    return usersRequest;
  });

  afterAll(async () => {
    await app.close();
  });
});
