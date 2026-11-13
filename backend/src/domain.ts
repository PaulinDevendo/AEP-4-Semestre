import { BadRequestException } from '@nestjs/common';

export const SIGNIFICADOS = ['violencia_fisica', 'violencia_psicologica', 'violencia_sexual', 'violencia_patrimonial', 'ameaca', 'cerceamento', 'outro'] as const;
export const URGENCIAS = ['baixa', 'media', 'alta', 'emergencia'] as const;
export const STATUS_OCORRENCIA = ['aberta', 'em_atendimento', 'encaminhada', 'encerrada', 'falso_positivo'] as const;

export const urgenciaRank = (u: string | null | undefined) => Math.max(0, URGENCIAS.indexOf((u ?? 'baixa') as never));

export const slugify = (s: string) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export function splitDescricao(d: string | null) {
  const i = (d ?? '').lastIndexOf(' | ');
  return i < 0 ? { descricao: d ?? '', tag: '' } : { descricao: d!.slice(0, i), tag: d!.slice(i + 3) };
}

export function str(v: unknown, campo: string, max: number, min = 1): string {
  if (typeof v !== 'string') throw new BadRequestException(`${campo} inválido`);
  const t = v.trim();
  if (t.length < min || t.length > max) throw new BadRequestException(`${campo} inválido`);
  return t;
}
export function oneOf<T extends readonly string[]>(v: unknown, lista: T, campo: string): T[number] {
  if (typeof v !== 'string' || !lista.includes(v)) throw new BadRequestException(`${campo} inválido`);
  return v as T[number];
}
export function intId(v: unknown, campo = 'id'): number {
  const n = Number(v);
  if (!Number.isInteger(n) || n <= 0 || n > 2_147_483_647) throw new BadRequestException(`${campo} inválido`);
  return n;
}
export const email = (v: unknown) => {
  const e = str(v, 'e-mail', 150).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) throw new BadRequestException('e-mail inválido');
  return e;
};
