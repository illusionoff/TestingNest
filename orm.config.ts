import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import 'dotenv/config';
import { User } from 'src/entities/user.entity';

const ormconfig: TypeOrmModuleOptions = {
  type: 'postgres',
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  port: Number(process.env.TYPEORM_PORT),
  logging: false,
  // subscribers: [ActSubscriber],
  entities: [User],
  synchronize: true,
  // autoLoadEntities: true,
};

export default ormconfig;
