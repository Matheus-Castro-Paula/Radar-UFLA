# Requisitos da aplicação

> **Artefato central da Sprint 2 (Atualizado na Sprint 6).** Não repita apenas o problema; descreva o comportamento e as condições que o sistema deverá atender.

## 1. Método de levantamento

Os requisitos do sistema **Radar UFLA** foram identificados e estruturados a partir da análise do problema de gestão de objetos e documentos achados e perdidos no campus da Universidade Federal de Lavras. O processo envolveu discussões internas com a equipe de desenvolvimento, mapeamento de necessidades da comunidade universitária (discentes, docentes e servidores) e levantamento das regras institucionais, operacionais e de segurança (como a conformidade com a LGPD). A partir dessa elicitação, os comportamentos esperados foram formalizados em módulos funcionais, requisitos não funcionais mensuráveis e histórias de usuário.

## 2. Atores e perfis

| Ator/perfil | Objetivo no sistema | Permissões ou limitações principais |
| --- | --- | --- |
| `Usuário Visitante (Anônimo)` | Consultar pertences e pesquisar na vitrine pública. | Permissão apenas de leitura e busca; não pode cadastrar pertences, comentar ou reivindicar itens. |
| `Comunidade UFLA (Autenticado)` | Cadastrar pertences achados/perdidos, gerenciar seus próprios anúncios e interagir via comentários. | Requer autenticação local. Pode publicar, editar/encerrar os seus próprios anúncios e publicar comentários públicos nos posts. |
| `Administrador Geral` | Gerenciar o sistema, moderar anúncios denunciados e parametrizar categorias e locais. | Acesso irrestrito a painéis administrativos, gestão de parâmetros do campus (categorias/locais) e moderação/exclusão de anúncios. |

## 3. Requisitos funcionais

| ID | Nome | Descrição verificável | Prioridade | História/Issue | Situação final |
| --- | --- | --- | --- | --- | --- |
| `RF-01` | Autenticação Local e Cadastro de Usuário | O sistema deve permitir o cadastro local e a autenticação de usuários através de e-mail e senha com criptografia bcrypt. | Alta | `#04` | Concluído |
| `RF-02` | Controle de Acesso Baseado em Papéis (RBAC) | O sistema deve gerenciar permissões de acordo com o perfil do usuário logado (Visitante, Comunidade UFLA e Administrador). | Alta | `#04` | Concluído |
| `RF-03` | Painel do Usuário ("Meus Anúncios") | O sistema deve fornecer uma área centralizada para o usuário consultar e gerenciar apenas as suas publicações. | Média | `#05`, `#11` | Concluído |
| `RF-04` | Vitrine Pública de Achados e Perdidos | O sistema deve exibir os pertences cadastrados em cards responsivos organizados por abas ("Achados" e "Perdidos") com contadores. | Alta | `#05` | Concluído |
| `RF-05` | Filtros Combinados de Pesquisa | O sistema deve permitir ao usuário filtrar os pertences na vitrine por categoria, local do campus e período de forma combinada. | Média | `#08` | Concluído |
| `RF-06` | Pesquisa Textual | O sistema deve permitir pesquisas por texto livre no campo de busca principal, de forma insensível a maiúsculas e acentos em Título, Descrição e Local. | Média | `#08` | Concluído |
| `RF-07` | Cadastrar Novo Anúncio de Pertence | O sistema deve permitir que usuários logados cadastrem novos pertences informando Tipo, Título, Categoria, Local do Campus, Data/Hora e Descrição. | Alta | `#06`, `#07`, `#11` | Concluído |
| `RF-08` | Upload de Mídia Local (Multer/ADR-08) e Dicas Visuais | O sistema deve permitir upload de até 3 fotos (máx 5MB) salvas em volume local `/uploads` via Multer (ADR-08) e apresentar orientações de segurança. | Média | `#10`, `#41`, `#43` | Em integração |
| `RF-09` | Editar e Encerrar Anúncio Próprio | O sistema deve permitir que o criador do anúncio altere informações ou o marque como "Entregue / Resolvido". | Média | `#11` | Concluído |
| `RF-10` | Seção de Comentários no Anúncio | O sistema deve permitir que usuários logados interajam nos anúncios por meio de comentários públicos para alinhar a devolução. | Média | `#11` | Concluído |
| `RF-11` | Gestão de Parâmetros | O sistema deve permitir ao Administrador Geral gerenciar (cadastrar/editar) os locais do campus e categorias de objetos. | Baixa | `#09` | Planejado |
| `RF-12` | Moderação e Central de Denúncias | O sistema deve permitir denúncias de posts indevidos, aplicando suspensão automática por quarentena ao atingir 3 denúncias. | Média | `#14` | Planejado |
| `RF-13` | Algoritmo de Notificação Automática de Match | O sistema deve cruzar dados de novos anúncios e notificar por e-mail os usuários em caso de correspondência de categoria, local e título. | Baixa | `#14` | Planejado |
| `RF-14` | Expiração Automática de Posts (60 Dias) | O sistema deve ocultar automaticamente do feed posts ativos que completarem 60 dias sem resolução via rotina diária. | Baixa | `#14` | Planejado |

## 4. Requisitos não funcionais

| ID | Categoria | Descrição verificável | Decisões Arquiteturais e Evidências | Situação Atual (Sprint 6) | Issue |
| --- | --- | --- | --- | --- | --- |
| `RNF-01` | Usabilidade | Interface web responsiva com breakpoint em 720px (`styles.css`), integrada diretamente à API REST. | Front-End estático sem frameworks JS; CSS próprio desktop-first. | **Parcial.** Layout responsivo funcional, mas não construído como mobile-first nativo. | `#05`, `#40` |
| `RNF-02` | Desempenho | Operações de busca/filtro responsivas (< 800ms) e carregamento inicial em até 2s. | Filtros no navegador em `app.js`; índice de banco `idx_anuncio_tipo_status`. | **Não medido.** Aferição em 4G agendada para a Sprint 7. Paginação pendente (M-12). | `#08`, `#40` |
| `RNF-03` | Segurança | Senhas com bcrypt, JWT sem estado (ADR-02), SQL parametrizado no Sequelize (ADR-06) e LGPD (`RN-04`). | Validação LGPD em `RegraLGPDHandler.js`, `INCLUDE_PUBLICO` em `AnuncioService.js` e `escapeHTML` em `app.js`. | **Parcial.** API responde em HTTP sem TLS (M-08) e CORS aberto (M-10). Ajustes de JWT e erro 500 no PR #41. | `#04`, `#40`, `#41` |
| `RNF-04` | Auditoria e Confiabilidade | Operações críticas com integridade relacional e reinício automático de serviços. | Transações SQL em `AnuncioService.js` e política `restart: always` no `docker-compose.yml`. | **Não atendido.** Ausência de Audit Log (M-09). Instância única não garante meta de 99,5% de uptime. | `#02`, `#03`, `#40` |
| `RNF-05` | Acessibilidade | Marcação HTML acessível com suporte a leitores de tela e navegação por teclado. | Atributos `role="tablist"`, `aria-selected` e `aria-live` em `index.html`. | **Parcial.** Conformidade integral WCAG 2.1 AA pendente de testes automatizados (Axe/WAVE). | `#05`, `#40` |
| `RNF-06` | Arquitetura | Estrutura cliente-servidor modular em camadas (ADR-05), banco MySQL (ADR-06), Docker (ADR-07) e mídias locais (ADR-08). | Divisão Front/Back em contêineres e persistência de mídia via volume local `/uploads`. | **Atendido.** Monólito em camadas e banco MySQL operacionais. Mídias em integração via PRs #41, #42 e #43. | `#02`, `#03`, `#40` |

## 5. Regras de negócio

| ID | Regra | Origem/justificativa | Requisitos afetados |
| --- | --- | --- | --- |
| `RN-01` | Quarentena Automática por Denúncias | Ao atingir 3 denúncias de usuários distintos, o post deve ter seu status alterado para "EM QUARENTENA" e ser removido do feed público até avaliação do Admin. | `RF-12` |
| `RN-02` | Restrição de Gestão de Anúncios | Somente o usuário criador do anúncio ou o Administrador Geral possuem permissão para editar os dados do post ou marcá-lo como "Entregue/Resolvido". | `RF-03`, `RF-09` |
| `RN-03` | Janela de Expiração de 60 Dias | Anúncios que completarem 60 dias sem atualização de status devem ser automaticamente alterados para "EXPIRADO" para evitar acúmulo de posts antigos na vitrine. | `RF-14` |
| `RN-04` | Ocultação de Dados Sensíveis (LGPD) | O sistema não deve exibir publicamente na vitrine dados sensíveis como CPF, telefone pessoal ou e-mail do proprietário. Anúncios da categoria "Documento" não podem conter foto: a API recusa o envio (HTTP 400), na criação e na edição, e o item é publicado apenas com descrição textual (ADR-03 / ADR-08). | `RF-04`, `RF-08`, `RNF-03` |
| `RN-05` | Cruzamento de Match | O algoritmo de correspondência só deve disparar alertas se houver coincidência de Categoria e alta similaridade de Título e Local entre um item "Achado" e um "Perdido". | `RF-13` |

## 6. Histórias de usuário e critérios de aceitação

### US-01 — Cadastrar Anúncio de Pertence Achado ou Perdido

Como **Membro da Comunidade UFLA**, quero **cadastrar um anúncio de um pertence achado ou perdido contendo fotos e localização**, para **que a comunidade possa visualizar o item e ajudar na devolução**.

**Requisitos relacionados:** `RF-07`, `RF-08`, `RNF-01`, `RNF-06`

**Critérios de aceitação:**

1. **Dado que** o usuário está autenticado e no formulário de cadastro, **quando** preencher todos os campos obrigatórios (Tipo, Título, Categoria, Local do Campus, Data/Hora e Descrição) e clicar em "Publicar Anúncio", **então** o sistema deve salvar o registro com status "ATIVO" e exibi-lo na vitrine pública.
2. **Dado que** o usuário seleciona arquivos de foto, **quando** enviar até 3 imagens nos formatos JPG, PNG ou WEBP com tamanho de até 5MB, **então** o sistema deve processar o upload via Multer, gravar os arquivos no volume local `/uploads` (ADR-08) e exibir as orientações visuais de segurança para entrega presencial.
3. **Dado que** o usuário escolheu a categoria "Documento", **quando** tentar publicar ou editar o anúncio com fotos, **então** o sistema deve recusar a operação com uma mensagem explicando que fotos de documentos não são permitidas (`RN-04`), e o anúncio só pode ser publicado com descrição textual.

**Issue:** `#06`, `#07`, `#10`, `#11`, `#41`, `#43`

---

### US-02 — Buscar e Filtrar Pertences na Vitrine Pública

Como **Usuário Visitante ou Membro da Comunidade UFLA**, quero **filtrar e pesquisar pertences por categoria, local do campus e palavra-chave**, para **encontrar rapidamente um objeto perdido ou verificar se ele já foi cadastrado**.

**Requisitos relacionados:** `RF-04`, `RF-05`, `RF-06`, `RNF-02`

**Critérios de aceitação:**

1. **Dado que** o usuário está na vitrine pública, **quando** ele alternar entre as abas "Achados" e "Perdidos", **então** o sistema deve atualizar a grade de cards com os itens correspondentes sem recarregar a página.
2. **Dado que** o usuário seleciona filtros de Categoria e Local e digita um termo no campo de busca, **quando** a pesquisa for executada, **então** o sistema deve retornar apenas os itens correspondentes aos critérios combinados em menos de 800ms.

**Issue:** `#05`, `#08`

---

### US-03 — Moderar Anúncios em Quarentena

Como **Administrador Geral**, quero **avaliar denúncias de posts colocados em quarentena**, para **garantir que conteúdos inadequados, falsos ou indevidos sejam removidos do sistema**.

**Requisitos relacionados:** `RF-12`, `RN-01`

**Critérios de aceitação:**

1. **Dado que** um anúncio atinge 3 denúncias de usuários, **quando** a terceira denúncia for registrada, **então** o sistema deve alterar automaticamente o status para "EM QUARENTENA" e ocultar o post do feed público.
2. **Dado que** o administrador acessa a Central de Denúncias, **quando** ele selecionar "Aprovar Denúncia", **então** o post deve ser excluído definitivamente; caso selecione "Rejeitar Denúncia", o post deve retornar ao status "ATIVO" na vitrine pública.

**Issue:** `#14`

## 7. Fora do escopo

| Item | Motivo | Possível trabalho futuro |
| --- | --- | --- |
| Chat / Mensageria Privada Interna em Tempo Real | Reduzir a complexidade do MVP da Sprint 2, utilizando comentários públicos nos próprios posts para alinhamento. | Implementação de sistema de chat direto entre usuários via WebSockets em sprints futuras. |
| Autenticação Institucional via Single Sign-On (SSO / OAuth2 UFLA) | Dependência de APIs institucionais externas e credenciais de acesso não disponíveis para ambiente de testes. | Integração com o provedor de identidade centralizado da UFLA nas próximas etapas de homologação. |
| Reconhecimento de Imagens por IA (Computer Vision para Match) | Custo computacional elevado e complexidade fora do foco do incremento mínimo validável. | Módulo experimental de comparação visual automática de fotos de pertences. |
| Armazenamento Externo de Fotos em Nuvem (Cloudinary / AWS S3) | Substituído por solução local via Multer e volumes Docker para simplificação de infraestrutura e execução offline. | Migração para Bucket S3 ou CDN caso a aplicação entre em ambiente de produção em escala. |

## 8. Histórico de alterações

| Sprint | Requisito alterado | Alteração | Motivo | Issue/commit |
| --- | --- | --- | --- | --- |
| Sprint 2 | Todos | Criação e estruturação inicial do documento de requisitos | Padronização e detalhamento completo conforme modelo do projeto | `#14` |
| Sprint 4 | `RN-04`, `US-01` | `RN-04` deixa de aceitar "fotos de documentos com tarja" e passa a proibir foto na categoria "Documento", com recusa pela API (HTTP 400); novo critério de aceitação 3 em `US-01` | Decisão ADR-03 de [`decisoes-de-projeto.md`](../projeto/decisoes-de-projeto.md): a tarja exigiria processamento de imagem, fora do escopo | `#25`, commits `0bffa9f` e `593156b` |
| Sprint 6 | `RNF-01` a `RNF-06`, `RF-08`, `US-01` | Refinamento e avaliação da situação atual dos RNFs com base na Seção 7 de `arquitetura.md`; atualização da infraestrutura de mídias para armazenamento local com Multer (`/uploads`) conforme ADR-08 | Decisões arquiteturais ADR-05 a ADR-08 e mapeamento do PR #45 pelo Tech Lead | `#40`, `#45` |