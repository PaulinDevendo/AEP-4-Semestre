import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client.js';

function poolConfig() {
  const raw = process.env.DATABASE_URL;
  if (!raw) throw new Error('DATABASE_URL não definida (veja backend/.env.example).');
  const url = new URL(raw);
  url.searchParams.delete('sslmode');
  const local = ['localhost', '127.0.0.1'].includes(url.hostname);
  const ssl = process.env.DATABASE_SSL === 'false' || local ? false : { rejectUnauthorized: false };
  return { connectionString: url.toString(), ssl, max: Number(process.env.DATABASE_POOL_MAX ?? 5) };
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  constructor() {
    super({ adapter: new PrismaPg(poolConfig()) });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
