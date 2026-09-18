# Sprint 2 — Requisitos e escopo validável da solução

- **Data de entrega:** 14/09/2026
- **Pontuação:** 2,5 pontos
- **Tag obrigatória:** `sprint-02`
- **Responsável por conferir este arquivo:** Luis Gustavo Borges Vilela Marques (@Luis-Marques06)

## 1. Pergunta que esta sprint deve responder

**O que o sistema deverá fazer e quais condições verificáveis deverá atender?**

## 2. Objetivo e resultado da sprint

**Objetivo planejado:** Mapear e formalizar a especificação completa de requisitos funcionais (`RF-01` a `RF-14`), requisitos não funcionais (`RNF-01` a `RNF-06`) e regras de negócio (`RN-01` a `RN-05`), vinculando-os diretamente às histórias de usuário e ao backlog no GitHub Projects. Manter o incremento de front-end executável, estruturar os containers Docker e modelar as entidades do banco de dados relacional.

**Resultado efetivamente alcançado:** O artefato central `docs/requisitos/requisitos.md` foi completamente construído e validado. Os artefatos de apoio (`docs/visao-geral.md` e `docs/backlog-produto.md`) foram refinados. No código, o front-end navegável permaneceu operacional, o ambiente em contêineres (Docker Compose para API e MySQL) foi configurado e a modelagem inicial do banco de dados relacional foi consolidada através da criação e execução das 4 _migrations_ via Sequelize (`usuarios`, `anuncio`, `foto_anuncio` e `comentario`).

## 3. Checklist do artefato central — 0,75 ponto

**Entrega esperada:** `docs/requisitos/requisitos.md`, histórias/casos, critérios de aceitação, escopo excluído e backlog refinado.

- [x] Atores/perfis identificados.
- [x] Requisitos funcionais com IDs e prioridade.
- [x] Requisitos não funcionais verificáveis.
- [x] Histórias/casos vinculados aos requisitos.
- [x] Critérios de aceitação nas Issues ou em links diretos.

### Links dos artefatos

| Artefato criado/atualizado      | Link na tag da sprint                                                                                            | O que mudou                                                                                                  |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `docs/requisitos/requisitos.md` | [requisitos.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-02/docs/requisitos/requisitos.md) | Especificação completa de requisitos funcionais, não funcionais, regras de negócio e histórias de usuário.   |
| `docs/visao-geral.md`           | [visao-geral.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-02/docs/visao-geral.md)          | Refinamento da visão do produto, detalhamento de premissas, restrições e consolidação do escopo da Sprint 2. |
| `docs/backlog-produto.md`       | [backlog-produto.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-02/docs/backlog-produto.md)  | Atualização da matriz do Product Backlog com mapeamento de RFs/RNFs e estratégias de priorização.            |

## 4. Incremento da aplicação web — 0,75 ponto

**Incremento mínimo esperado:** Implementação de pelo menos um fluxo prioritário ou protótipo navegável ligado a requisitos e critérios de aceitação.

### O que foi implementado ou evoluído

A interface navegável em HTML/CSS/JS abrange a vitrine pública com abas de itens "Achados" e "Perdidos" (`RF-04`), filtros por categoria/local (`RF-05`), pesquisa por palavras-chave (`RF-06`) e formulário de cadastro de anúncios (`RF-07`) aplicando a regra visual de proteção de dados (`RN-04`). No back-end, foi introduzida a estrutura inicial do servidor Express e os arquivos de containerização via Docker.

### Como executar e verificar

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/Matheus-Castro-Paula/Radar-UFLA.git
   cd Radar-UFLA
   ```

2. **Instale as dependências:**
   - (Necessário para executar a CLI do Sequelize e demais pacotes locais.)

   ```bash
   yarn install
   ```

3. **Configuração de Ambiente:**
   - Crie um arquivo `.env` na raiz do projeto copiando o modelo `.env.example`.
   - Preencha com as suas credenciais.

4. **Suba a infraestrutura (API e Banco de Dados via Docker):**
   - Você pode optar por rodar qualquer um desses dois comandos abaixo:
   - O primeiro constrói a imagem do container e deixa o terminal livre para próximos comandos, devido ao fato de rodar o cotêiner em segundo plano.
   - Já o segundo constrói a imagem do container e ocupa aquele terminal para mostrar os Logs da API, tendo que abrir um segundo terminal para rodar os próximos comandos.

   ```bash
   docker compose up -d --build
   ```

   - **OU**

   ```bash
   docker compose up --build
   ```

   - A API estará rodando em `http://localhost:3000` e pronta para receber requisições.

5. Execute as Migrations do Banco de Dados:
   - Com os containers ativos, rode as migrations do Sequelize para estruturar as tabelas MySQL (`usuarios`, `anuncio`, `foto_anuncio` e `comentario`):

   ```bash
   npx sequelize-cli db:migrate
   ```

6. Rode o servidor local apontando para a pasta do front-end:

```bash
   # Linux/Mac
   python3 -m http.server 8000 --directory API/Front-End

   # Windows
   python -m http.server 8000 --directory API/Front-End
```

7. Abra `http://localhost:8000` no navegador.

> Na Sprint 2, a estrutura do banco de dados MySQL via Sequelize migrations e os containers Docker da API/Banco foram completamente consolidados.

| Requisito/Issue          | Código ou protótipo                                         | Evidência de execução                                               |
| ------------------------ | ----------------------------------------------------------- | ------------------------------------------------------------------- |
| `RF-04`, `RF-05` / `#5`  | [index.html](../../API/Front-End/index.html)                | ![Radar UFLA rodando localmente](evidencias/sprint-01-execucao.png) |
| `RF-07`, `RN-04` / `#11` | [publicar.html](../../API/Front-End/publicar.html)          | ![Radar UFLA publicar](evidencias/sprint-02-publicar.png)           |
| `RNF-06` / `#3`          | [docker-compose.yml](../../API/Back-End/docker-compose.yml) | ![Radar UFLA back-end](evidencias/sprint-02-Back-end-rodando.png)   |

## 5. Scrum e gestão do trabalho — 0,50 ponto

### Sprint Backlog

| Issue                                                               | Descrição                                     | Responsável                    | Critério de aceitação/conclusão                                                            | Situação     |
| ------------------------------------------------------------------- | --------------------------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------ | ------------ |
| [#1](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/1)   | Estruturar repositório e documentação inicial | Luis Gustavo (@Luis-Marques06) | README, visão-geral e backlog-produto preenchidos                                          | Concluída    |
| [#2](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/2)   | Modelar entidades iniciais do banco de dados  | Matheus Castro/Arthur Ramos    | Migrations de Usuários, Anúncios, Fotos e Comentários                                      | Concluída    |
| [#3](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/3)   | Configurar banco de dados MySQL via Docker    | Matheus Castro/Arthur Ramos    | Banco sobe com `docker compose up`                                                         | Concluída    |
| [#4](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/4)   | Cadastro e login de usuário (JWT)             | Matheus Castro/Arthur Ramos    | Rotas de cadastro e login funcionais                                                       | Pendente     |
| [#5](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/5)   | Estrutura inicial do front-end                | Rodrigo (@rodrigopenha13)      | Página inicial navegável com as duas abas                                                  | Concluída    |
| [#12](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/12) | Instruções de instalação e execução           | Luis Gustavo (@Luis-Marques06) | Seção "Como executar" do README preenchida porém passível de alteração ao longo do projeto | Em andamento |
| [#14](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/14) | Documentação e artefatos da Sprint 2          | Luis Gustavo / Matheus Castro  | Especificação de requisitos e relatórios finalizados                                       | Concluída    |
| [#15](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/15) | Relatório da Sprint 2 e Tag Git               | Luis Gustavo (@Luis-Marques06) | Tag `sprint-02` criada e enviada ao GitHub                                                 | Concluída    |

### Acompanhamento

- **GitHub Project:** [Projects](https://github.com/users/Matheus-Castro-Paula/projects/2)
- **Reuniões/decisões:** Reuniões via Discord para estruturação da matriz de requisitos, adequação às normas da LGPD para proteção de dados de pertences e definição das regras do Docker.
- **Impedimentos:** Nenhum impedimento técnico.
- **Mudanças de escopo:** Nenhuma mudança de escopo registrada.

## 6. GitHub, documentação e rastreabilidade — 0,50 ponto

| Tipo de evidência       | Link                                                                                                                                                                                                                                                                                                                                                                | O que comprova                                                                                                                                                 |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Issue                   | [Issues](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues)                                                                                                                                                                                                                                                                                                 | Duas novas Issues criadas focadas na Sprint 02                                                                                                                 |
| Pull Request            | [Pull Request 01](https://github.com/Matheus-Castro-Paula/Radar-UFLA/commit/1ffb60044393ff3af5c0e1376e7c07e6d817a696), [Pull Request 02](https://github.com/Matheus-Castro-Paula/Radar-UFLA/commit/0edf1f881246d4154a7ec804e603e4affbae4efb), [Pull Request 03](https://github.com/Matheus-Castro-Paula/Radar-UFLA/commit/729ae99520e4bd47678ab3736324ad7609ac979a) | Três novos `Pull Request`, 1º para a estrutura inicial do Back-End, 2º com as `migrations` do banco de dados, e o 3º com uma correção da arquitetura de pastas |
| Commit                  | [f3c3f79](https://github.com/Matheus-Castro-Paula/Radar-UFLA/commit/f7c6b5d37b51b4daf4595f3fb1198f69796fe95e), [1ffb600](https://github.com/Matheus-Castro-Paula/Radar-UFLA/commit/4cb769c29e5ac1c4aa48ea23eb8649f300bd81b8), [4cb769c](https://github.com/Matheus-Castro-Paula/Radar-UFLA/commit/1f5a1b70537055e6e90b714e58582635a74ad6f3)                         | São basicamente as mesmas coisas dos `Pull Request` devido a inexperiência da equipe                                                                           |
| Código/arquivo          | [requisitos.md](../requisitos/requisitos.md)                                                                                                                                                                                                                                                                                                                        | Especificação de requisitos formalizada                                                                                                                        |
| Teste/captura/relatório | ![Project - Radar UFLA](/docs/sprints/evidencias/sprint-02-projects.png)                                                                                                                                                                                                                                                                                            | Estado do quadro no GitHub Projects                                                                                                                            |

### Rastreabilidade resumida

| Requisito        | Issue            | Artefato/modelo/decisão                      | Código                                                      | Teste/evidência                                                      |
| ---------------- | ---------------- | -------------------------------------------- | ----------------------------------------------------------- | -------------------------------------------------------------------- |
| `RF-01`, `RF-02` | `#4`             | [requisitos.md](../requisitos/requisitos.md) | `Sprint 03`                                                 | A realizar                                                           |
| `RF-04`          | `#5`             | [requisitos.md](../requisitos/requisitos.md) | [index.html](../../API/Front-End/index.html)                | ![index.html](../sprints/evidencias/sprint-01-execucao.png)          |
| `RF-05`, `RF-06` | `#8`             | [requisitos.md](../requisitos/requisitos.md) | [app.js](../../API/Front-End/app.js)                        | ![app.js](../sprints/evidencias/sprint-01-execucao.png)              |
| `RF-07`, `RN-04` | `#6`, `#7`, `#9` | [requisitos.md](../requisitos/requisitos.md) | [publicar.html](../../API/Front-End/publicar.html)          | ![publicar.html](../sprints/evidencias/sprint-02-publicar.png)       |
| `RNF-06`         | `#3`             | [requisitos.md](../requisitos/requisitos.md) | [docker-compose.yml](../../API/Back-End/docker-compose.yml) | ![API rodando](../sprints/evidencias/sprint-02-Back-end-rodando.png) |
| `RNF-06`         | `#2`             | [requisitos.md](../requisitos/requisitos.md) | [migrations/](../../API/Back-End/src/migrations/)           | —                                                                    |
|                  |

## 7. Revisão do incremento

- **O que foi demonstrado:** A especificação detalhada de 14 Requisitos Funcionais, 6 Requisitos Não Funcionais, 5 Regras de Negócio e Histórias de Usuário, a interface de front-end, a subida da infraestrutura Docker e a criação das migrations do Sequelize no banco de dados relacional.
- **Critérios atendidos:** Atendimento ao checklist do artefato central (`docs/requisitos/requisitos.md`), rastreabilidade no GitHub Projects e ambiente de execução instruído no `README.md`.
- **Itens não concluídos:** Rotas completas de autenticação via JWT (`#4`) e integração final do front-end com os endpoints, mantidas para a Sprint 3.
- **Motivo das pendências:** Etapa focada na formalização de requisitos, estruturação da infraestrutura de contêineres e modelagem do banco de dados antes do desenvolvimento dos endpoints.
- **Feedback recebido e ajustes:** —

## 8. Retrospectiva e próxima sprint

- **Funcionou bem:** Clareza no mapeamento de requisitos funcionais e regras de negócio; integração rápida da configuração de ambiente via Docker no `README.md`.
- **Precisa melhorar:** Conectar as chamadas de API do front-end com as rotas que serão disponibilizadas no back-end.
- **Ação concreta para a próxima sprint:** Finalizar o mapeamento ORM (Sequelize) e implementar a rota de autenticação de usuários na Sprint 3.

## 9. O que não será considerado suficiente

- Repetir a descrição do problema da Sprint 1.
- Listar funcionalidades sem identificadores ou critérios.
- Apresentar telas sem relacioná-las a requisitos.

## 10. Links enviados no UFLA Virtual

- **Tag `sprint-02`:** [Sprint 02](https://github.com/Matheus-Castro-Paula/Radar-UFLA/tree/sprint-02)
- **Este arquivo na tag:** [sprint-02.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-01/docs/sprints/sprint-02.md)
- **Observação adicional:** Documentação centralizada e estruturada conforme os modelos oficiais da disciplina.
