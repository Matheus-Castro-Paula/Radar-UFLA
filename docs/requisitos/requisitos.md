# Requisitos da aplicação

> **Artefato central da Sprint 2.** Não repita apenas o problema; descreva o comportamento e as condições que o sistema deverá atender.

## 1. Método de levantamento

Os requisitos do sistema **Radar UFLA** foram identificados e estruturados a partir da análise do problema de gestão de objetos e documentos achados e perdidos no campus da Universidade Federal de Lavras. O processo envolveu discussões internas com a equipe de desenvolvimento, mapeamento de necessidades da comunidade universitária (discentes, docentes e servidores) e levantamento das regras institucionais, operacionais e de segurança (como a conformidade com a LGPD). A partir dessa elicitação, os comportamentos esperados foram formalizados em módulos funcionais, requisitos não funcionais mensuráveis e histórias de usuário.

## 2. Atores e perfis

| Ator/perfil                     | Objetivo no sistema                                                                                 | Permissões ou limitações principais                                                                                               |
| ------------------------------- | --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `Usuário Visitante (Anônimo)`   | Consultar pertences e pesquisar na vitrine pública.                                                 | Permissão apenas de leitura e busca; não pode cadastrar pertences, comentar ou reivindicar itens.                                 |
| `Comunidade UFLA (Autenticado)` | Cadastrar pertences achados/perdidos, gerenciar seus próprios anúncios e interagir via comentários. | Requer autenticação local. Pode publicar, editar/encerrar os seus próprios anúncios e publicar comentários públicos nos posts.    |
| `Administrador Geral`           | Gerenciar o sistema, moderar anúncios denunciados e parametrizar categorias e locais.               | Acesso irrestrito a painéis administrativos, gestão de parâmetros do campus (categorias/locais) e moderação/exclusão de anúncios. |

## 3. Requisitos funcionais

| ID      | Nome                                         | Descrição verificável                                                                                                                                   | Prioridade | História/Issue      | Situação final |
| ------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------- | -------------- |
| `RF-01` | Autenticação Local e Cadastro de Usuário     | O sistema deve permitir o cadastro local e a autenticação de usuários através de e-mail e senha com criptografia bcrypt.                                | Alta       | `#04`               | Planejado      |
| `RF-02` | Controle de Acesso Baseado em Papéis (RBAC)  | O sistema deve gerenciar permissões de acordo com o perfil do usuário logado (Visitante, Comunidade UFLA e Administrador).                              | Alta       | `#04`               | Planejado      |
| `RF-03` | Painel do Usuário ("Meus Anúncios")          | O sistema deve fornecer uma área centralizada para o usuário consultar e gerenciar apenas as suas publicações.                                          | Média      | `#05`, `#11`        | Planejado      |
| `RF-04` | Vitrine Pública de Achados e Perdidos        | O sistema deve exibir os pertences cadastrados em cards responsivos organizados por abas ("Achados" e "Perdidos") com contadores.                       | Alta       | `#05`               | Concluído      |
| `RF-05` | Filtros Combinados de Pesquisa               | O sistema deve permitir ao usuário filtrar os pertences na vitrine por categoria, local do campus e período de forma combinada.                         | Média      | `#08`               | Planejado      |
| `RF-06` | Pesquisa Textual                             | O sistema deve permitir pesquisas por texto livre no campo de busca principal, de forma insensível a maiúsculas e acentos em Título, Descrição e Local. | Média      | `#08`               | Planejado      |
| `RF-07` | Cadastrar Novo Anúncio de Pertence           | O sistema deve permitir que usuários logados cadastrem novos pertences informando Tipo, Título, Categoria, Local do Campus, Data/Hora e Descrição.      | Alta       | `#06`, `#07`, `#11` | Planejado      |
| `RF-08` | Upload de Mídia e Dicas Visuais de Segurança | O sistema deve permitir o upload de até 3 fotos (máx 5MB) e apresentar orientações de segurança para a devolução presencial.                            | Média      | `#10`               | Planejado      |
| `RF-09` | Editar e Encerrar Anúncio Próprio            | O sistema deve permitir que o criador do anúncio altere informações ou o marque como "Entregue / Resolvido".                                            | Média      | `#11`               | Planejado      |
| `RF-10` | Seção de Comentários no Anúncio              | O sistema deve permitir que usuários logados interajam nos anúncios por meio de comentários públicos para alinhar a devolução.                          | Média      | `#11`               | Planejado      |
| `RF-11` | Gestão de Parâmetros                         | O sistema deve permitir ao Administrador Geral gerenciar (cadastrar/editar) os locais do campus e categorias de objetos.                                | Baixa      | `#09`               | Planejado      |
| `RF-12` | Moderação e Central de Denúncias             | O sistema deve permitir denúncias de posts indevidos, aplicando suspensão automática por quarentena ao atingir 3 denúncias.                             | Média      | `#14`               | Planejado      |
| `RF-13` | Algoritmo de Notificação Automática de Match | O sistema deve cruzar dados de novos anúncios e notificar por e-mail os usuários em caso de correspondência de categoria, local e título.               | Baixa      | `#14`               | Planejado      |
| `RF-14` | Expiração Automática de Posts (60 Dias)      | O sistema deve ocultar automaticamente do feed posts ativos que completarem 60 dias sem resolução via rotina diária.                                    | Baixa      | `#14`               | Planejado      |

## 4. Requisitos não funcionais

| ID       | Categoria                  | Descrição verificável                                                                                                                                 | Como será avaliado                                                                                 | Issue        |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ------------ |
| `RNF-01` | Usabilidade                | A interface web deve ser responsiva (mobile-first) e respeitar a identidade visual da UFLA (verde #1E4D3B, creme e tipografia sans-serif).            | Inspeção visual do layout e testes de responsividade em navegadores mobile e desktop.              | `#05`        |
| `RNF-02` | Desempenho                 | As operações de filtragem e busca devem responder em menos de 800ms e a página inicial deve carregar em no máximo 2s em redes 4G.                     | Testes automatizados de desempenho e auditoria via Google Lighthouse.                              | `#08`        |
| `RNF-03` | Segurança                  | Toda comunicação deve usar HTTPS/TLS 1.3, senhas em hash bcrypt, além de proteção contra OWASP Top 10 (SQLi, XSS, CSRF) e conformidade com LGPD.      | Análise estática de código e verificação de políticas de privacidade/ocultação de dados sensíveis. | `#04`        |
| `RNF-04` | Auditoria e Confiabilidade | Operações de alteração/exclusão devem gerar logs de auditoria inalteráveis (Audit Log) com Timestamp UTC, ID e IP, mantendo disponibilidade de 99,5%. | Verificação da tabela/arquivo de logs e monitoramento do tempo de atividade do servidor.           | `#02`, `#03` |
| `RNF-05` | Acessibilidade             | A interface gráfica deve estar em conformidade com a WCAG 2.1 (Nível AA), permitindo navegabilidade por teclado e marcadores ARIA.                    | Validação com ferramentas de acessibilidade web (Axe, WAVE) e navegação exclusiva por teclado.     | `#05`        |
| `RNF-06` | Arquitetura                | O sistema deve ser estruturado em arquitetura cliente-servidor modular com banco de dados relacional e armazenamento seguro de mídias.                | Revisão de código e verificação do isolamento dos serviços no ambiente Docker.                     | `#02`, `#03` |

## 5. Regras de negócio

| ID      | Regra                               | Origem/justificativa                                                                                                                                                     | Requisitos afetados        |
| ------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------- |
| `RN-01` | Quarentena Automática por Denúncias | Ao atingir 3 denúncias de usuários distintos, o post deve ter seu status alterado para "EM QUARENTENA" e ser removido do feed público até avaliação do Admin.            | `RF-12`                    |
| `RN-02` | Restrição de Gestão de Anúncios     | Somente o usuário criador do anúncio ou o Administrador Geral possuem permissão para editar os dados do post ou marcá-lo como "Entregue/Resolvido".                      | `RF-03`, `RF-09`           |
| `RN-03` | Janela de Expiração de 60 Dias      | Anúncios que completarem 60 dias sem atualização de status devem ser automaticamente alterados para "EXPIRADO" para evitar acúmulo de posts antigos na vitrine.          | `RF-14`                    |
| `RN-04` | Ocultação de Dados Sensíveis (LGPD) | O sistema não deve exibir publicamente na vitrine dados sensíveis como CPF, telefone pessoal, e-mail do proprietário ou fotos de documentos sem tarjas numeradas.        | `RF-04`, `RF-08`, `RNF-03` |
| `RN-05` | Cruzamento de Match                 | O algoritmo de correspondência só deve disparar alertas se houver coincidência de Categoria e alta similaridade de Título e Local entre um item "Achado" e um "Perdido". | `RF-13`                    |

## 6. Histórias de usuário e critérios de aceitação

### US-01 — Cadastrar Anúncio de Pertence Achado ou Perdido

Como **Membro da Comunidade UFLA**, quero **cadastrar um anúncio de um pertence achado ou perdido contendo fotos e localização**, para **que a comunidade possa visualizar o item e ajudar na devolução**.

**Requisitos relacionados:** `RF-07`, `RF-08`, `RNF-01`

**Critérios de aceitação:**

1. **Dado que** o usuário está autenticado e no formulário de cadastro, **quando** preencher todos os campos obrigatórios (Tipo, Título, Categoria, Local do Campus, Data/Hora e Descrição) e clicar em "Publicar Anúncio", **então** o sistema deve salvar o registro com status "ATIVO" e exibi-lo na vitrine pública.
2. **Dado que** o usuário seleciona arquivos de foto, **quando** enviar até 3 imagens nos formatos JPG, PNG ou WEBP com tamanho de até 5MB, **então** o sistema deve validar os ficheiros, comprimi-los e exibir as orientações visuais de segurança para entrega presencial.

**Issue:** `#06`, `#07`, `#10`, `#11`

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

| Item                                                              | Motivo                                                                                                          | Possível trabalho futuro                                                                         |
| ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Chat / Mensageria Privada Interna em Tempo Real                   | Reduzir a complexidade do MVP da Sprint 2, utilizando comentários públicos nos próprios posts para alinhamento. | Implementação de sistema de chat direto entre usuários via WebSockets em sprints futuras.        |
| Autenticação Institucional via Single Sign-On (SSO / OAuth2 UFLA) | Dependência de APIs institucionais externas e credenciais de acesso não disponíveis para ambiente de testes.    | Integração com o provedor de identidade centralizado da UFLA nas próximas etapas de homologação. |
| Reconhecimento de Imagens por IA (Computer Vision para Match)     | Custo computacional elevado e complexidade fora do foco do incremento mínimo validável.                         | Módulo experimental de comparação visual automática de fotos de pertences.                       |

## 8. Histórico de alterações

| Sprint   | Requisito alterado | Alteração                                                 | Motivo                                                          | Issue/commit |
| -------- | ------------------ | --------------------------------------------------------- | --------------------------------------------------------------- | ------------ |
| Sprint 2 | Todos              | Criação e estruturação inicial do documento de requisitos | Padronização e detalhamento completo conforme modelo do projeto | `#14`        |
