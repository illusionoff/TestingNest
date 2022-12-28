import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
// import ormconfig from 'orm.config';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { UserService } from './user.service';
// import { User } from './entities/user.entity';
// import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UserService;
  let repository: Repository<User>;
  // let ormconfigTet: ormconfig;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(
          // ormconfig,
          {
            // type: 'postgres',
            // host: 'localhost',
            // port: 5432,
            // username: 'postgres',
            // password: 'postgres',
            // database: 'test',
            // entities: [User],
            // synchronize: true,
            // dropSchema: true,
            type: 'postgres',
            username: 'admin',
            password: 'admin',
            database: 'learningTesting',
            port: 5433,
            logging: false,
            // subscribers: [ActSubscriber],
            entities: [User],
            synchronize: true,
            // autoLoadEntities: true,
          },
        ),
        TypeOrmModule.forFeature([User]),
      ],
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
      expect(result).toEqual({
        id: expect.any(Number),
        username: 'test-user',
        password: 'test-password',
      });
      const count = await repository.count();
      expect(count).toEqual(1);
    });
  });
});
