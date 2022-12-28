import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import ormconfig from '../../orm.config';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { UserService } from './user.service';

describe('UsersService', () => {
  let service: UserService;
  let repository: Repository<User>;
  // let ormconfigTet: ormconfig;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(ormconfig), TypeOrmModule.forFeature([User])],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
      // Delete testing value from bd
      await service.delete(result.id);
    });
  });
});
