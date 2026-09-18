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
2. Acompanhe o fluxo de trabalho no [GitHub Project](https://github.com/users/Matheus-Castro-Paula/projects/2).
3. Verifique o detalhamento da entrega no relatório da [Sprint 2](docs/sprints/sprint-02.md).

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

## 6. Estrutura do repositório

```text
API/
├── .github/
│   └── ISSUE_TEMPLATE/
├── Back-End/
│   ├── node_modules/
│   ├── src/
│   │   ├── migrations/
│   │   │   ├── 20260918000000-create-usuarios.js
│   │   │   ├── 20260918000001-create-anuncios.js
│   │   │   ├── 20260918000002-create-fotos-anuncio.js
│   │   │   └── 20260918000003-create-comentarios.js
│   │   └── server.js
│   ├── .dockerignore
│   ├── .env
│   ├── .env.example
│   ├── docker-compose.yml
│   ├── Dockerfile
│   ├── package.json
│   └── yarn.lock
├── Front-End/
│   ├── app.js
│   ├── index.html
│   ├── publicar.html
│   └── styles.css
├── docs/
│   ├── arquitetura/
│   │   └── arquitetura.md
│   ├── modelagem/
│   │   ├── imagens/
│   │   └── modelagem.md
│   ├── padroes/
│   │   └── padroes-de-projeto.md
│   ├── projeto/
│   │   └── decisoes-de-projeto.md
│   ├── requisitos/
│   │   └── requisitos.md
│   ├── sprints/
│   │   ├── evidencias/
│   │   │   ├── sprint-01-execucao.png
│   │   │   ├── sprint-01-project.png
│   │   │   ├── sprint-02-Back-end-rodando.png
│   │   │   ├── sprint-02-projects.png
│   │   │   └── sprint-02-publicar.png
│   │   ├── sprint-01.md
│   │   ├── sprint-02.md
│   │   ├── sprint-03.md
│   │   ├── sprint-04.md
│   │   ├── sprint-05.md
│   │   ├── sprint-06.md
│   │   ├── sprint-07.md
│   │   └── sprint-08.md
│   ├── testes/
│   │   ├── evidencias-testes.md
│   │   └── plano-de-testes.md
│   ├── backlog-produto.md
│   ├── uso-de-ia.md
│   └── visao-geral.md
├── rubrica/
│   └── autoavaliacao-entregas.md
├── tests/
├── .gitignore
└── README.md

```

## 7. Tecnologias utilizadas

- **Front-end:** HTML, CSS e JavaScript
- **Back-end:** Node.js, Express.js
- **ORM / Banco de dados:** Sequelize, MySQL 8.0
- **Autenticação & Upload:** JWT, Bcrypt, Multer, Cloudinary
- **Containerização:** Docker, Docker Compose

## 8. Documentação

- [Visão geral do produto](docs/visao-geral.md)
- [Backlog do produto](docs/backlog-produto.md)
- [Requisitos](docs/requisitos/requisitos.md)
- [Documentação das sprints](docs/sprints/)

## 9. Execução da aplicação

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

## 10. Regra de ouro da rastreabilidade

Sempre que possível, o fluxo do projeto segue o caminho:
`Problema → Requisito → Issue → Sprint → Modelo/Decisão → Código → Teste → Evidência`

A tabela central desse vínculo é mantida em `docs/backlog-produto.md` e `docs/requisitos/requisitos.md`.

## 11. Entrega final

Até 30/11/2026, o repositório estará consolidado na tag `versao-final` contendo código-fonte completo, instruções de execução, gravações demonstrativas e todos os artefatos de documentação atualizados.
