import 'dotenv/config';

import {
  Injectable,
  OnModuleDestroy,
} from '@nestjs/common';

import { PrismaClient } from '../../../generated/users/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleDestroy {

  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.USERS_DATABASE_URL!,
    });

    super({ adapter });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}