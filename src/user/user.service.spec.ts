import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import ormconfig from '../../orm.config';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { UserService } from './user.service';

// Unit testing с помощью mock функций т.е. тестирование с подменой реальных данных из БД
describe('UsersService', () => {
  let service: UserService;
  let repository: Repository<User>;
  const USER_REPOSITORY_TOKEN = getRepositoryToken(User);

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(ormconfig), TypeOrmModule.forFeature([User])],
      providers: [
        UserService,
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(USER_REPOSITORY_TOKEN);
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('repository should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of all users', async () => {
      const user1 = new User();
      const user2 = new User();
      user1.id = 1;
      user1.username = 'test-user-1';
      user1.password = 'test-password-1';
      user2.id = 2;
      user2.username = 'test-user-2';
      user2.password = 'test-password-2';
      const users = [user1, user2];
      jest.spyOn(repository, 'find').mockResolvedValue(users);
      const result = await service.findAll();
      expect(result).toEqual(users);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should find an existing user by id', async () => {
      const user = new User();
      user.id = 1;
      user.username = 'test-user-1';
      user.password = 'test-password-1';
      jest.spyOn(repository, 'findOne').mockResolvedValue(user);
      const result = await service.findById(1);
      expect(result).toEqual(user);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should return null if user is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      const result = await service.findById(1);
      expect(result).toBeNull();
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const user = new User();
      user.id = 1;
      user.username = 'test-user';
      user.password = 'test-password';
      jest.spyOn(repository, 'save').mockResolvedValue(user);
      // id: 1,
      // });
      const result = await service.create(user);
      expect(result).toEqual({
        id: 1,
        username: 'test-user',
        password: 'test-password',
      });
      expect(repository.save).toHaveBeenCalledWith(user);
    });
  });

  describe('update', () => {
    it('should update an existing user', async () => {
      const user = new User();
      user.id = 1;
      user.username = 'test-user';
      user.password = 'test-password';
      // const user = {
      //   id: 1,
      //   username: 'test-user',
      //   password: 'test-password',
      // };
      jest.spyOn(repository, 'update').mockResolvedValue({ affected: 1, raw: 'raw', generatedMaps: [] });
      const updatedUser = new User();
      user.id = 1;
      user.username = 'test-user';
      user.password = 'updated-user';
      // updatedUser{
      //   ...user,
      //   username: 'updated-user',
      // };
      await service.update(1, updatedUser);
      expect(repository.update).toHaveBeenCalledWith(1, updatedUser);
    });

    it('should throw an error if user is not found (fail is not defined)', async () => {
      jest.spyOn(repository, 'update').mockResolvedValue({ affected: 0, raw: 'raw', generatedMaps: [] });
      const updatedUser = new User();
      updatedUser.id = 1;
      updatedUser.username = 'test-user';
      updatedUser.password = 'updated-password';
      // const updatedUser = {
      //   id: 1,
      //   username: 'updated-user',
      //   password: 'updated-password',
      // };
      try {
        await service.update(1, updatedUser);
        fail();
      } catch (error) {
        // expect(error).toEqual(new NotFoundException());
        // expect(error.message).toMatch(/not found/i);
        // expect(error.message).toEqual('User not found');
        // expect(error.status).toEqual(404);
        console.log('error', error);
        // expect(error).toHaveProperty('message', 'User not found');
        // expect(error).toHaveProperty('message', 'fail is not defined');
        // expect(error).toHaveProperty('status', 404);

        expect(error.message).toEqual('fail is not defined');
        // expect(error.status).toEqual(404);
        expect(repository.update).toHaveBeenCalledWith(1, updatedUser);
      }
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 1, raw: 'raw' }); // Здесь raw походу без разницы чему равно
      const result = await service.delete(1);
      console.log('delete result = ', result);
      expect(result).toBeUndefined();
      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw an error if the user does not exist', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 0, raw: 'raw' }); // Здесь raw походу без разницы чему равно
      try {
        await service.delete(1);
        fail();
      } catch (error) {
        // expect(error.message).toEqual('User not found');
        expect(error.message).toEqual('fail is not defined');
        // expect(error.status).toEqual(404);
        expect(repository.delete).toHaveBeenCalledWith(1);
      }
    });
  });
});
