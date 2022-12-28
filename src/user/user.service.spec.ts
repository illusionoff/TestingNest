import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import ormconfig from '../../orm.config';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { UserService } from './user.service';

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

  describe('create', () => {
    it('should create a new user', async () => {
      const user = new User();
      user.username = 'test-user';
      user.password = 'test-password';
      const result = await service.create(user);
      // console.log('result = ', result); // Работает
      expect(result).toEqual({
        id: expect.any(Number),
        username: 'test-user',
        password: 'test-password',
      });
      const count = await repository.count();
      expect(count).toEqual(1);
    });
  });

  // // findById без использование реальной БД
  // describe('findById', () => {
  //   it('should find an existing user by id', async () => {
  //     const user = new User();
  //     //   {
  //     //   id: 1,
  //     //   username: 'test-user',
  //     //   password: 'test-password',
  //     // });
  //     user.id = 1;
  //     user.username = 'test-user-findById';
  //     user.password = 'test-password-findById';
  //     jest.spyOn(repository, 'findOne').mockResolvedValue(user);
  //     const result = await service.findById(1);
  //     console.log('findById result = ', result);
  //     expect(result).toEqual(user);
  //     expect(repository.findOne).toHaveBeenCalledWith({
  //       where: { id: 1 },
  //     });
  //   });

  //   it('should return null if user is not found', async () => {
  //     jest.spyOn(repository, 'findOne').mockResolvedValue(null);
  //     const result = await service.findById(1);
  //     expect(result).toBeNull();
  //     expect(repository.findOne).toHaveBeenCalledWith({
  //       where: { id: 1 },
  //     });
  //   });
  // });

  describe('update', () => {
    it('should update a test-user', async () => {
      const result = await service.findAll();
      console.log('update findAll result = ', result); // Работает
      expect(result.length).toEqual(1);
      const id = result[0].id;
      const user = result[0];
      user.password = 'update-test-password';
      await service.update(id, user);
      expect(result.length).toEqual(1);
      console.log('update id = ', id);
      const result2 = await service.findAll();
      console.log('update findAll result2 = ', result2);
      const findById = await service.findById(id);
      console.log('update findById = ', findById);
      expect(findById).toEqual({
        id: expect.any(Number),
        username: 'test-user',
        password: user.password,
      });
    });
  });

  // describe('delete', () => {
  //   it('should delete a new user', async () => {
  //     const result = await service.findAll();
  //     console.log('findAll result = ', result); // Работает
  //     expect(result.length).toEqual(1);
  //     // Delete testing value from bd
  //     const id = result[0].id;
  //     await service.delete(id);
  //     expect(result.length).toEqual(1);
  //   });
  // });
});
