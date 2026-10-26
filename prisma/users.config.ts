import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'users/schema.prisma',

  migrations: {
    path: 'users/migrations',
  },

  datasource: {
    url: env('USERS_DATABASE_URL'),
  },
});