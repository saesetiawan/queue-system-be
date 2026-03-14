import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import fs from 'fs';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

dotenv.config();

type Ssl = {
  ca?: Buffer;
};

const ssl: Ssl = {};
if (process.env.DB_SSL === 'true')
  ssl.ca = fs.readFileSync(`./ssl/${process.env.DB_IS_SECURE_CA}`);
export default new DataSource({
  type: 'mariadb',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [
    __dirname + '/**/*.entity{.ts,.js}',
    __dirname + '/src/**/entities/*.entity{.ts,.js}',
    __dirname + '/src/**/**/entities/*.entity{.ts,.js}',
  ],
  migrations: [__dirname + '/src/migrations/*{.ts,.js}'],
  synchronize: false,
  ssl: process.env.DB_SSL === 'true' ? ssl : undefined,
});
