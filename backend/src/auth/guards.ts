import { CanActivate, createParamDecorator, ExecutionContext, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export type Perfil = 'usuaria' | 'atendente';
export interface TokenPayload { sub: number; perfil: Perfil; nome: string }

function bearer(ctx: ExecutionContext): string | null {
  const h = ctx.switchToHttp().getRequest().headers?.authorization as string | undefined;
  return h?.startsWith('Bearer ') ? h.slice(7) : null;
}

@Injectable()
abstract class PerfilGuard implements CanActivate {
  protected abstract perfil: Perfil;
  protected abstract negar(): Error;
  constructor(private readonly jwt: JwtService) {}

  async canActivate(ctx: ExecutionContext) {
    const token = bearer(ctx);
    if (!token) throw this.negar();
    try {
      const p = await this.jwt.verifyAsync<TokenPayload>(token);
      if (p.perfil !== this.perfil) throw new Error('perfil');
      ctx.switchToHttp().getRequest().auth = p;
      return true;
    } catch {
      throw this.negar();
    }
  }
}

@Injectable()
export class UsuariaGuard extends PerfilGuard {
  protected perfil = 'usuaria' as const;
  protected negar = () => new UnauthorizedException();
}

@Injectable()
export class AtendenteGuard extends PerfilGuard {
  protected perfil = 'atendente' as const;
  protected negar = () => new NotFoundException();
}

export const Auth = createParamDecorator((_: unknown, ctx: ExecutionContext): TokenPayload => ctx.switchToHttp().getRequest().auth);
