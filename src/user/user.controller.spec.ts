import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import ormconfig from '../../orm.config';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(ormconfig), TypeOrmModule.forFeature([User])],
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  // Очищаем ресурсы после каждого теста
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('repository should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const user = new User();
      user.id = 1;
      user.username = 'test-user';
      user.password = 'test-password';
      // const result = [{ id: 1, name: 'John', age: 30 }];
      const result = [user];
      jest.spyOn(userService, 'findAll').mockImplementation(() => Promise.resolve(result));
      expect(await controller.findAll()).toBe(result);
      // expect(await controller.findAll()).toEqual(result);
    });
  });

  describe('findById', () => {
    it('should return a single user', async () => {
      const result = new User();
      result.id = 1;
      result.username = 'test-user';
      result.password = 'test-password';
      jest.spyOn(userService, 'findById').mockImplementation(() => Promise.resolve(result));
      expect(await controller.findById(1)).toBe(result);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const user = new User();
      user.id = 1;
      user.username = 'test-user';
      user.password = 'test-password';
      jest.spyOn(userService, 'create').mockImplementation(() => Promise.resolve(user));
      expect(await controller.create(user)).toBe(user);
    });
  });

  describe('update', () => {
    it('should update an existing user', async () => {
      const user = new User();
      user.id = 1;
      user.username = 'test-user';
      user.password = 'test-password';
      jest.spyOn(userService, 'update').mockImplementation(() => Promise.resolve());
      await controller.update(1, user);
      expect(userService.update).toHaveBeenCalledWith(1, user);
    });
  });

  describe('delete', () => {
    it('should delete an existing user', async () => {
      jest.spyOn(userService, 'delete').mockImplementation(() => Promise.resolve());
      await controller.delete(1);
      expect(userService.delete).toHaveBeenCalledWith(1);
    });
  });
});
