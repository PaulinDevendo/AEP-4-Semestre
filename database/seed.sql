BEGIN;

INSERT INTO categoria (nome, slug, descricao, ordem) VALUES
  ('Batons', 'batons', 'Cores intensas, acabamento cremoso e longa duração.', 1),
  ('Esmaltes', 'esmaltes', 'Cores vibrantes, secagem rápida e brilho de salão.', 2),
  ('Rosto', 'rosto', 'Bases, blushes e iluminadores para uma pele uniforme.', 3),
  ('Skincare', 'skincare', 'Rituais de cuidado para hidratar, tratar e proteger.', 4),
  ('Acessórios', 'acessorios', 'Pincéis, esponjas e necessaires para o dia a dia.', 5);

INSERT INTO produto (categoria_id, nome, descricao, preco, cor_hex, estoque)
SELECT c.id, v.nome, v.descricao, v.preco, v.cor_hex, v.estoque
FROM (VALUES
  ('batons', 'Rouge Intense', 'Batom cremoso de cor intensa e acabamento acetinado. Hidrata enquanto colore. | Batom cremoso · Vermelho', 49.90::numeric, '#B3263F', 40),
  ('batons', 'Rosa Violáceo', 'Batom matte de textura aveludada em um rosa clássico para o dia a dia. | Batom matte · Rosa', 44.90::numeric, '#B76B7D', 35),
  ('batons', 'Nude Laço', 'Nude quente que combina com todos os tons de pele, com toque de seda. | Batom cremoso · Nude', 44.90::numeric, '#C98F86', 28),
  ('batons', 'Bordô Noturno', 'Bordô profundo e sofisticado, ideal para ocasiões especiais. | Batom matte · Bordô', 54.90::numeric, '#6E1A2E', 22),
  ('esmaltes', 'Esmalte Vermelho Vivo', 'O novo vermelho vivo da coleção: cobertura em duas camadas e brilho espelhado. | Esmalte cremoso · 9 ml', 19.90::numeric, '#C8102E', 80),
  ('esmaltes', 'Esmalte Rosa Névoa', 'Rosa suave e luminoso, de secagem rápida. | Esmalte cremoso · 9 ml', 17.90::numeric, '#E8A0B4', 60),
  ('esmaltes', 'Esmalte Nude Posse', 'Nude empoeirado que alonga e uniformiza as unhas. | Esmalte cremoso · 9 ml', 17.90::numeric, '#D7B8A8', 55),
  ('esmaltes', 'Base Fortalecedora', 'Fortalece e protege as unhas antes da cor. | Base para unhas · 9 ml', 22.90::numeric, '#F1DCBF', 45),
  ('rosto', 'Velvet Skin Toque', 'Base de cobertura média com acabamento acetinado, em 12 tons. | Base acetinada · 12 tons', 69.90::numeric, '#E3B7A0', 30),
  ('rosto', 'Blush Romantic', 'Blush compacto de pigmento macio que se constrói em camadas. | Blush compacto · Rosa antigo', 39.90::numeric, '#D98B9B', 38),
  ('rosto', 'Pó Invisível', 'Sela a maquiagem e controla o brilho sem pesar. | Pó solto · 10 g', 52.90::numeric, '#F3DCCB', 26),
  ('rosto', 'Glow Vigia', 'Luminosidade perolada para as maçãs do rosto. | Iluminador líquido · 15 ml', 59.90::numeric, '#EBCBD3', 24),
  ('skincare', 'Essence Rosé', 'Sérum iluminador com extrato de rosa que uniformiza o viço da pele. | Sérum iluminador · 30 ml', 89.90::numeric, '#EBCBD3', 20),
  ('skincare', 'Creme Reparador', 'Hidratação leve por 24 horas, para todos os tipos de pele. | Hidratante · 50 g', 74.90::numeric, '#F8EDEF', 33),
  ('skincare', 'Água Micelar', 'Remove a maquiagem e limpa suavemente, sem enxágue. | Demaquilante · 200 ml', 36.90::numeric, '#EAF1F4', 50),
  ('skincare', 'Protetor Escudo FPS 50', 'Toque seco, sem resíduo branco e com cor universal. | Protetor · 40 g', 64.90::numeric, '#F6E6D0', 41),
  ('acessorios', 'Kit Pincéis Cerca', 'Seis pincéis de cerdas macias para rosto e olhos. | Kit com 6 pincéis', 79.90::numeric, '#B76B7D', 18),
  ('acessorios', 'Esponja Rosa', 'Esponja de acabamento uniforme, suave para a pele. | Esponja para base', 19.90::numeric, '#E8A0B4', 70),
  ('acessorios', 'Necessaire Cofre', 'Necessaire com forro impermeável e fecho discreto. | Necessaire · Rosé', 49.90::numeric, '#EBCBD3', 25),
  ('acessorios', 'Espelho Eco', 'Espelho duplo com aumento, perfeito para a bolsa. | Espelho duplo', 24.90::numeric, '#C9A27A', 60)
) AS v(slug, nome, descricao, preco, cor_hex, estoque)
JOIN categoria c ON c.slug = v.slug;

INSERT INTO atendente (nome, nome_exibicao, email, senha_hash, ativo, disponivel, max_conversas_simultaneas)
VALUES ('Atendente Demonstração', 'Atendente Demo', 'atendente@gmail.com',
        '$2b$10$4/VuFbmAN4wt2hfHo4xST.kK1tm/9FFyDV2eALUwMTI3cpbBo6qVW', TRUE, FALSE, 3);

INSERT INTO usuaria (apelido, email, senha_hash)
VALUES ('Maria', 'mariadapenha@gmail.com', '$2b$10$ka3S6CJ/jjLCzvmrXcrYCOOYspugREH8OYFbIptc9InsCT6PHpmnC');

WITH e AS (
  INSERT INTO endereco (logradouro, numero, bairro, cidade, estado, cep) VALUES
    ('Rua Exemplo', '100', 'Centro', 'Maringá', 'PR', '87000-000'),
    ('Av. Modelo', '200', 'Centro', 'Maringá', 'PR', '87000-001'),
    ('Rua Sigilosa', 'S/N', 'Zona 1', 'Maringá', 'PR', '87000-002'),
    ('Rua das Flores', '300', 'Zona 2', 'Maringá', 'PR', '87000-003')
  RETURNING id, logradouro
)
INSERT INTO instituicao_apoio (nome, tipo, telefone, email, endereco_id, atende_24h)
SELECT v.nome, v.tipo, v.telefone, v.email, e.id, v.atende_24h
FROM (VALUES
  ('Delegacia da Mulher (fictícia)', 'delegacia',   '(44) 0000-0001', 'delegacia@exemplo.org', 'Rua Exemplo',    TRUE),
  ('CRAS Centro (fictício)',         'CRAS',        '(44) 0000-0002', 'cras@exemplo.org',      'Av. Modelo',     FALSE),
  ('Casa Abrigo Esperança (fictícia)','casa abrigo','(44) 0000-0003', NULL,                    'Rua Sigilosa',   TRUE),
  ('ONG Rede Acolher (fictícia)',    'ONG',         '(44) 0000-0004', 'rede@exemplo.org',      'Rua das Flores', FALSE)
) AS v(nome, tipo, telefone, email, logradouro, atende_24h)
JOIN e ON e.logradouro = v.logradouro;

INSERT INTO codigo_disfarce (produto_id, significado, urgencia, observacao)
SELECT p.id, v.significado, v.urgencia, v.observacao
FROM (VALUES
  ('Rouge Intense', 'ameaca', 'alta', 'Perguntar se está em local seguro antes de seguir.'),
  ('Rosa Violáceo', 'violencia_fisica', 'alta', 'Perguntar se há ferimentos e se precisa de atendimento médico.'),
  ('Nude Laço', 'cerceamento', 'media', 'Confirmar se pode falar agora e se o aparelho é monitorado.'),
  ('Bordô Noturno', 'violencia_sexual', 'alta', 'Acolher com cuidado; orientar sobre atendimento de saúde e delegacia.'),
  ('Esmalte Vermelho Vivo', 'outro', 'emergencia', 'Acionamento do botão de emergência: priorizar contato imediato.'),
  ('Esmalte Rosa Névoa', 'violencia_psicologica', 'media', 'Acolher sem julgar; evitar perguntas que culpem.'),
  ('Esmalte Nude Posse', 'violencia_patrimonial', 'media', 'Orientar sobre documentos e medidas protetivas.'),
  ('Base Fortalecedora', 'outro', 'baixa', 'Conversar para entender a situação antes de classificar.'),
  ('Velvet Skin Toque', 'violencia_sexual', 'alta', 'Acolher com cuidado; orientar sobre atendimento de saúde e delegacia.'),
  ('Blush Romantic', 'violencia_psicologica', 'media', 'Acolher sem julgar; evitar perguntas que culpem.'),
  ('Pó Invisível', 'outro', 'baixa', 'Conversar para entender a situação antes de classificar.'),
  ('Glow Vigia', 'cerceamento', 'media', 'Confirmar se pode falar agora e se o aparelho é monitorado.'),
  ('Essence Rosé', 'violencia_psicologica', 'media', 'Acolher sem julgar; evitar perguntas que culpem.'),
  ('Creme Reparador', 'violencia_fisica', 'alta', 'Perguntar se há ferimentos e se precisa de atendimento médico.'),
  ('Água Micelar', 'outro', 'baixa', 'Conversar para entender a situação antes de classificar.'),
  ('Protetor Escudo FPS 50', 'ameaca', 'media', 'Perguntar se está em local seguro antes de seguir.'),
  ('Kit Pincéis Cerca', 'cerceamento', 'media', 'Confirmar se pode falar agora e se o aparelho é monitorado.'),
  ('Esponja Rosa', 'outro', 'baixa', 'Conversar para entender a situação antes de classificar.'),
  ('Necessaire Cofre', 'violencia_patrimonial', 'media', 'Orientar sobre documentos e medidas protetivas.'),
  ('Espelho Eco', 'violencia_psicologica', 'baixa', 'Acolher sem julgar; evitar perguntas que culpem.')
) AS v(nome, significado, urgencia, observacao)
JOIN produto p ON p.nome = v.nome;

COMMIT;
