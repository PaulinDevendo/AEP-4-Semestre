import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { PrismaService } from './prisma.service.js';
import { HealthController } from './health.controller.js';
import { AuthController } from './auth/auth.controller.js';
import { AtendenteGuard, UsuariaGuard } from './auth/guards.js';
import { CatalogoService } from './loja/catalogo.service.js';
import { LojaController } from './loja/loja.controller.js';
import { PainelController } from './painel/painel.controller.js';

function jwtSecret() {
  const s = process.env.JWT_SECRET;
  if (s && s.length >= 32) return s;
  if (process.env.NODE_ENV === 'production') throw new Error('JWT_SECRET ausente ou curto (mínimo 32 caracteres).');
  return 'dev-only-secret-nao-usar-em-producao-0123456789';
}

@Module({
  imports: [
    JwtModule.register({ global: true, secret: jwtSecret(), signOptions: { expiresIn: '8h' } }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 300 }]),
  ],
  controllers: [HealthController, AuthController, LojaController, PainelController],
  providers: [PrismaService, CatalogoService, UsuariaGuard, AtendenteGuard, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
