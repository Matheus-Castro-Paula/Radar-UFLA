# Radar UFLA

> Trabalho de Engenharia de Software — 2026/2 | Universidade Federal de Lavras (UFLA)

## 1. Identificação do projeto

| Campo                       | Informação                                                                       |
| --------------------------- | -------------------------------------------------------------------------------- |
| Nome do projeto             | Radar UFLA                                                                       |
| Problema escolhido          | Achados e perdidos no campus da UFLA                                             |
| Turma/semestre              | Engenharia de Software — 2026/2                                                  |
| Professor                   | Prof. Johnatan Oliveira                                                          |
| Link do GitHub Project      | [Radar UFLA - Backlog](https://github.com/users/Matheus-Castro-Paula/projects/2) |
| Link da aplicação publicada | `[A PREENCHER NAS SPRINTS FUTURAS]`                                              |
| Link do vídeo final         | `[PREENCHER NA ENTREGA FINAL]`                                                   |

### Integrantes

| Nome completo                      | Usuário no GitHub       | Responsabilidade principal                                                     | Outras contribuições                |
| ---------------------------------- | ----------------------- | ------------------------------------------------------------------------------ | ----------------------------------- |
| Luis Gustavo Borges Vilela Marques | `@Luis-Marques06`       | PO / Scrum Master — backlog, Issues, organização das sprints, atas de reunião  | Apoio na documentação geral         |
| Bernardo Thomaz de Oliveira        | `@BernarDEVthomaz`      | Tech Lead — decisões de arquitetura e de projeto, apoio técnico a Front e Back | Apoio no plano e execução de testes |
| Rodrigo Penha Silva                | `@rodrigopenha13`       | Front-end — telas de feed, formulário de postagem, busca                       | Apoio na documentação de requisitos |
| Matheus de Castro Paula            | `@Matheus-Castro-Paula` | Back-end — API, autenticação, regras de negócio                                | Apoio na execução de testes         |
| Arthur Ramos Xisto                 | `@Artxisto`             | Back-end — API, modelagem de dados, banco de dados                             | Apoio na execução de testes         |

## 2. Resumo da solução

**Problema:** É comum que objetos sejam perdidos ou encontrados nos diversos espaços da UFLA (salas, corredores, refeitórios, biblioteca), sem que exista um canal centralizado para reconectar quem perdeu com quem encontrou. A comunicação atual depende de grupos informais de WhatsApp ou murais físicos, dificultando a busca e fazendo com que muitos itens nunca sejam devolvidos.

**Solução proposta:** O Radar UFLA é uma aplicação web em formato de feed dividida em duas abas principais: "Achados", onde qualquer estudante pode publicar foto e descrição de um objeto encontrado (local, horário e ponto de entrega), e "Perdidos", onde estudantes publicam itens que perderam. A plataforma conta com busca textual e filtros para acelerar a devolução.

**Público principal:** Estudantes, professores e servidores da UFLA.

**Funcionalidades prioritárias:**

- Publicação de itens encontrados (aba "Achados") e perdidos (aba "Perdidos")
- Filtros combinados e pesquisa por palavra-chave nos feeds
- Autenticação e gestão de anúncios pelo próprio usuário

## 3. Comece por aqui

1. Consulte o documento de [Visão Geral](docs/visao-geral.md) e a [Especificação de Requisitos](docs/requisitos/requisitos.md).
2. Veja os modelos do sistema e a matriz de rastreabilidade em [Modelagem](docs/modelagem/modelagem.md).
3. Acompanhe o fluxo de trabalho no [GitHub Project](https://github.com/users/Matheus-Castro-Paula/projects/2).
4. Verifique o detalhamento da entrega mais recente no relatório da [Sprint 3](docs/sprints/sprint-03.md).

## 4. Cronograma e pontuação

| Etapa         |       Data | Entrega central                                             |   Pontos | Tag obrigatória |
| ------------- | ---------: | ----------------------------------------------------------- | -------: | --------------- |
| Sprint 1      | 24/08/2026 | Problema, visão do produto, Scrum, GitHub e backlog inicial |      2,5 | `sprint-01`     |
| Sprint 2      | 14/09/2026 | Requisitos verificáveis e escopo da aplicação               |      2,5 | `sprint-02`     |
| Sprint 3      | 28/09/2026 | Modelagem e rastreabilidade                                 |      2,5 | `sprint-03`     |
| Sprint 4      | 13/10/2026 | Princípios de projeto e decisões locais                     |      2,5 | `sprint-04`     |
| Sprint 5      | 26/10/2026 | Padrões de projeto aplicados ao código                      |      2,5 | `sprint-05`     |
| Sprint 6      | 09/11/2026 | Arquitetura global da aplicação                             |      2,5 | `sprint-06`     |
| Sprint 7      | 16/11/2026 | Plano de testes e primeiras execuções                       |      2,5 | `sprint-07`     |
| Sprint 8      | 23/11/2026 | Validação final e estabilização                             |      2,5 | `sprint-08`     |
| Entrega final | 30/11/2026 | GitHub consolidado, slides e vídeo no YouTube               |      5,0 | `versao-final`  |
| **Total**     |            |                                                             | **25,0** |                 |

## 5. Como cada sprint é avaliada

Cada sprint vale **2,5 pontos**:

| Dimensão                               | Pontos | O que deve estar verificável                                               |
| -------------------------------------- | -----: | -------------------------------------------------------------------------- |
| Artefato central da disciplina         |   0,75 | Documento específico da etapa, tecnicamente consistente e completo         |
| Incremento da aplicação web            |   0,75 | Código, protótipo, teste ou funcionalidade que demonstre evolução concreta |
| Scrum e gestão do trabalho             |   0,50 | Issues, Sprint Backlog, responsáveis, critérios de aceitação e revisão     |
| GitHub, documentação e rastreabilidade |   0,50 | Commits, links, tag, organização e relação entre artefatos e código        |

## 6. Estado atual do projeto

| Funcionalidade                                              | Requisito          | Situação                                                                 |
| ----------------------------------------------------------- | ------------------ | ------------------------------------------------------------------------ |
| Vitrine com abas Achados/Perdidos, busca e filtros          | `RF-04` a `RF-06`  | Interface funcional com dados de exemplo (integração com a API pendente) |
| Formulário de publicação de item                            | `RF-07`, `RN-04`   | Interface pronta; envio real para a API pendente                         |
| Cadastro e login com senha criptografada e token JWT        | `RF-01`, `RNF-03`  | **Implementado** (Sprint 3)                                              |
| Rota protegida por token (`/api/auth/perfil`)               | `RF-01`            | **Implementado** (Sprint 3)                                              |
| Modelagem do banco (migrations e Models Sequelize)          | `RNF-06`           | **Implementado** (Sprints 2 e 3)                                         |
| Controle de acesso por papéis, upload de fotos, comentários | `RF-02`, `RF-08`, `RF-10` | Planejado                                                         |

## 7. Estrutura do repositório

```text
.
├── API/
│   ├── Back-End/
│   │   ├── src/
│   │   │   ├── config/            # Configuração do Sequelize (config.js)
│   │   │   ├── controllers/       # authController.js
│   │   │   ├── middlewares/       # authMiddleware.js (verificação do JWT)
│   │   │   ├── migrations/        # usuarios, anuncio, foto_anuncio, comentario
│   │   │   ├── models/            # Models Sequelize e associações
│   │   │   ├── routes/            # authRoutes.js
│   │   │   ├── seeders/           # Usuário de demonstração
│   │   │   └── server.js
│   │   ├── .env.example
│   │   ├── .sequelizerc
│   │   ├── docker-compose.yml
│   │   ├── Dockerfile
│   │   └── package.json
│   └── Front-End/
│       ├── app.js
│       ├── index.html
│       ├── login.html
│       ├── publicar.html
│       ├── registro.html
│       └── styles.css
├── docs/
│   ├── arquitetura/
│   ├── modelagem/
│   ├── padroes/
│   ├── projeto/
│   ├── requisitos/
│   ├── sprints/
│   │   ├── evidencias/            # Capturas de tela das sprints
│   │   └── sprint-01.md ... sprint-08.md
│   ├── testes/
│   ├── backlog-produto.md
│   ├── uso-de-ia.md
│   └── visao-geral.md
├── rubrica/
│   └── autoavaliacao-entregas.md
└── README.md
```

## 8. Tecnologias utilizadas

- **Front-end:** HTML, CSS e JavaScript
- **Back-end:** Node.js 20, Express.js 5
- **ORM / Banco de dados:** Sequelize, MySQL 8.0
- **Autenticação:** JWT (`jsonwebtoken`) e bcrypt (`bcryptjs`)
- **Upload (planejado):** Multer e Cloudinary
- **Containerização:** Docker, Docker Compose

## 9. Documentação

- [Visão geral do produto](docs/visao-geral.md)
- [Backlog do produto](docs/backlog-produto.md)
- [Requisitos](docs/requisitos/requisitos.md)
- [Modelagem e matriz de rastreabilidade](docs/modelagem/modelagem.md)
- [Documentação das sprints](docs/sprints/)

## 10. Execução da aplicação

Pré-requisitos: [Git](https://git-scm.com/), [Docker](https://www.docker.com/) com Docker Compose e Python 3 (apenas para servir o Front-End localmente).

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/Matheus-Castro-Paula/Radar-UFLA.git
   cd Radar-UFLA/API/Back-End
   ```

2. **Configure o ambiente:**
   - Copie o modelo `.env.example` para `.env` (dentro de `API/Back-End`):

   ```bash
   cp .env.example .env
   ```

   - Preencha as variáveis. Com o `docker-compose.yml` atual, `DB_PASSWORD` deve ser `root` (o mesmo valor de `MYSQL_ROOT_PASSWORD`) e `DB_HOST` deve continuar `db`. Defina também um valor para `JWT_SECRET`.

3. **Suba a infraestrutura (API e banco MySQL via Docker):**
   - O primeiro comando roda os contêineres em segundo plano e deixa o terminal livre:

   ```bash
   docker compose up -d --build
   ```

   - **OU** o segundo, que mostra os logs da API no terminal (é preciso abrir outro terminal para os próximos comandos):

   ```bash
   docker compose up --build
   ```

   - A API ficará disponível em `http://localhost:3000`.

4. **Execute as migrations e o seeder** (dentro do contêiner da API, que enxerga o banco pelo host `db`):

   ```bash
   docker compose exec backend npx sequelize-cli db:migrate
   docker compose exec backend npx sequelize-cli db:seed:all
   ```

   O seeder cria o usuário de demonstração `admin@ufla.br` (senha `admin321`), apenas para testes locais.

5. **Sirva o Front-End** (a partir da raiz do repositório, em outro terminal):

   ```bash
   # Linux/Mac
   python3 -m http.server 8000 --directory API/Front-End

   # Windows
   python -m http.server 8000 --directory API/Front-End
   ```

6. **Acesse a aplicação:**
   - Feed: `http://localhost:8000`
   - Cadastro: `http://localhost:8000/registro.html`
   - Login: `http://localhost:8000/login.html`

## 11. Endpoints da API

Base: `http://localhost:3000`

| Método | Rota                | Acesso    | Descrição                                                        |
| ------ | ------------------- | --------- | ---------------------------------------------------------------- |
| GET    | `/`                 | Público   | Verifica se a API está no ar                                     |
| POST   | `/api/auth/registro`| Público   | Cadastra usuário (`nome`, `email`, `senha`), senha salva com hash |
| POST   | `/api/auth/login`   | Público   | Autentica (`email`, `senha`) e devolve o token JWT (24h)         |
| GET    | `/api/auth/perfil`  | Protegido | Retorna os dados do usuário; exige `Authorization: Bearer <token>` |

Exemplo rápido:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ufla.br","senha":"admin321"}'
```

## 12. Regra de ouro da rastreabilidade

Sempre que possível, o fluxo do projeto segue o caminho:
`Problema → Requisito → Issue → Sprint → Modelo/Decisão → Código → Teste → Evidência`

A tabela central desse vínculo é mantida em `docs/backlog-produto.md`, `docs/requisitos/requisitos.md` e, a partir da Sprint 3, na matriz de rastreabilidade de `docs/modelagem/modelagem.md`.

## 13. Entrega final

Até 30/11/2026, o repositório estará consolidado na tag `versao-final` contendo código-fonte completo, instruções de execução, gravações demonstrativas e todos os artefatos de documentação atualizados.