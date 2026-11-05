// Constantes espelhando os CHECKs do banco (database/save_our_skin_web.sql).
// O banco não pode mudar: o código se adapta a estes valores.
export const SIGNIFICADOS = ['violencia_fisica','violencia_psicologica','violencia_sexual','violencia_patrimonial','ameaca','cerceamento','outro'] as const;
export const URGENCIAS = ['baixa','media','alta','emergencia'] as const;
export const ORIGENS_OCORRENCIA = ['pedido_web','chat','contato_manual'] as const;
export const STATUS_OCORRENCIA = ['aberta','em_atendimento','encaminhada','encerrada','falso_positivo'] as const;

export type Significado = (typeof SIGNIFICADOS)[number];
export type Urgencia = (typeof URGENCIAS)[number];
export type OrigemOcorrencia = (typeof ORIGENS_OCORRENCIA)[number];
export type StatusOcorrencia = (typeof STATUS_OCORRENCIA)[number];
