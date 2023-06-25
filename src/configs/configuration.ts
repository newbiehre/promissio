import { PromiseLog } from '../app/promise-logs/promise-log.entity';
import { Promise } from '../app/promises/promise.entity';
import { User } from '../app/users/user.entity';

export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  jwtKey: process.env.JWT_SECRET,
  database: {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    configurationType: process.env.DB_CONFIG_TYPE,
    database: process.env.DB_DATABASE,
    entities: [User, Promise, PromiseLog], //  [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true,
  },
});
