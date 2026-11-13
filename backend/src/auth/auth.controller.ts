import { Body, ConflictException, Controller, HttpCode, Post, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Throttle } from '@nestjs/throttler';
import bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma.service.js';
import { email, str } from '../domain.js';
import type { TokenPayload } from './guards.js';

const DUMMY = '$2b$10$AysglWlbrDc/S213CXJPtO6XjqdnE6JRe7MfA.6jXC93m7u8wDZHq';
const LOGIN_LIMIT = { default: { limit: 5, ttl: 60_000 } };

@Controller('auth')
export class AuthController {
  constructor(private readonly db: PrismaService, private readonly jwt: JwtService) {}

  private token(p: TokenPayload) {
    return this.jwt.signAsync(p);
  }

  @Post('login')
  @HttpCode(200)
  @Throttle(LOGIN_LIMIT)
  async login(@Body() body: Record<string, unknown>) {
    const mail = email(body?.email);
    const senha = str(body?.senha, 'senha', 200);
    const u = await this.db.usuaria.findUnique({ where: { email: mail } });
    const ok = await bcrypt.compare(senha, u?.senha_hash ?? DUMMY);
    if (!u || !ok) throw new UnauthorizedException('E-mail ou senha incorretos.');
    await this.db.usuaria.update({ where: { id: u.id }, data: { ultimo_acesso: new Date() } });
    const apelido = u.apelido || 'Cliente';
    return { token: await this.token({ sub: u.id, perfil: 'usuaria', nome: apelido }), apelido };
  }

  @Post('cadastro')
  @Throttle(LOGIN_LIMIT)
  async cadastro(@Body() body: Record<string, unknown>) {
    const apelido = str(body?.apelido, 'apelido', 60);
    const mail = email(body?.email);
    const senha = str(body?.senha, 'senha', 200, 6);
    const pin = body?.pin ? String(body.pin) : '';
    if (pin && !/^\d{4,6}$/.test(pin)) throw new BadRequestException('O PIN deve ter de 4 a 6 números.');
    if (await this.db.usuaria.findUnique({ where: { email: mail }, select: { id: true } }))
      throw new ConflictException('Este e-mail já está cadastrado.');
    const u = await this.db.usuaria.create({
      data: {
        apelido,
        email: mail,
        senha_hash: await bcrypt.hash(senha, 10),
        pin_coacao: pin ? await bcrypt.hash(pin, 10) : null,
        ultimo_acesso: new Date(),
      },
    });
    return { token: await this.token({ sub: u.id, perfil: 'usuaria', nome: apelido }), apelido };
  }

  @Post('atendente/login')
  @HttpCode(200)
  @Throttle(LOGIN_LIMIT)
  async loginAtendente(@Body() body: Record<string, unknown>) {
    const mail = email(body?.email);
    const senha = str(body?.senha, 'senha', 200);
    const a = await this.db.atendente.findUnique({ where: { email: mail } });
    const ok = await bcrypt.compare(senha, a?.senha_hash ?? DUMMY);
    if (!a || !ok || a.ativo === false) throw new UnauthorizedException('E-mail ou senha incorretos.');
    return {
      token: await this.token({ sub: a.id, perfil: 'atendente', nome: a.nome_exibicao }),
      id: a.id,
      nomeExibicao: a.nome_exibicao,
      maxConversas: a.max_conversas_simultaneas ?? 3,
    };
  }
}
