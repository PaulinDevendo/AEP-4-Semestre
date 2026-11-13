import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { PrismaService } from './prisma.service.js';

@Controller('health')
@SkipThrottle()
export class HealthController {
  constructor(private readonly db: PrismaService) {}

  @Get()
  async health() {
    try {
      await this.db.$queryRaw`SELECT 1`;
      return { ok: true };
    } catch {
      throw new ServiceUnavailableException({ ok: false });
    }
  }
}
