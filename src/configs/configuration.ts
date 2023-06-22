import { PromiseLog } from 'src/app/promise-logs/promise-log.entity';
import { Promise } from 'src/app/promises/promise.entity';
import { User } from 'src/app/users/user.entity';

export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  jwtKey: process.env.JWT_SECRET,
  database: {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [User, Promise, PromiseLog],
    synchronize: true,
  },
});
