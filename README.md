# Radar UFLA

> Trabalho Engenharia de Software — 2026/2

## 1. Identificação do projeto

| Campo                       | Informação                                                          |
| --------------------------- | ------------------------------------------------------------------- |
| Nome do projeto             | Radar UFLA                                                          |
| Problema escolhido          | Achados e perdidos na UFLA                                          |
| Turma/semestre              | Engenharia de Software — 2026/2                                     |
| Professor                   | Prof. Johnatan Oliveira                                             |
| Link do GitHub Project      | [Project](https://github.com/users/Matheus-Castro-Paula/projects/2) |
| Link da aplicação publicada | —                                                                   |
| Link do vídeo final         | —                                                                   |

### Integrantes

| Nome completo                      | Usuário no GitHub       | Responsabilidade principal                                                     | Outras contribuições                |
| ---------------------------------- | ----------------------- | ------------------------------------------------------------------------------ | ----------------------------------- |
| Luis Gustavo Borges Vilela Marques | `@Luis-Marques06`       | PO / Scrum Master — backlog, Issues, organização das sprints, atas de reunião  | Apoio na documentação geral         |
| Bernardo Thomaz de Oliveira        | `@BernarDEVthomaz`      | Tech Lead — decisões de arquitetura e de projeto, apoio técnico a Front e Back | Apoio no plano e execução de testes |
| Rodrigo Penha Silva                | `@rodrigopenha13`       | Front-end — telas de feed, formulário de postagem, busca                       | Apoio na documentação de requisitos |
| Matheus de Castro Paula            | `@Matheus-Castro-Paula` | Back-end — API, autenticação, regras de negócio                                | Apoio na execução de testes         |
| Arthur Ramos Xisto                 | `@Artxisto`             | Back-end — API, modelagem de dados, banco de dados                             | Apoio na execução de testes         |

> O grupo possui 5 integrantes. A atribuição de uma responsabilidade principal não dispensa a participação colaborativa nas demais atividades.

## 2. Resumo da solução

**Problema:** É comum que objetos sejam perdidos ou encontrados nos diversos espaços da UFLA (salas, corredores, refeitórios, biblioteca, etc.), sem que exista um canal centralizado e ágil para reconectar quem perdeu com quem encontrou. Hoje essa comunicação depende de grupos informais de WhatsApp, avisos em murais físicos ou boca a boca, o que dificulta a busca e faz com que muitos itens nunca sejam devolvidos.

**Solução proposta:** O Radar UFLA é uma aplicação web em formato de feed, semelhante a uma rede social, dividida em duas abas principais: "Achados", onde qualquer estudante pode publicar uma foto e uma breve descrição de um objeto encontrado (local, horário e onde foi deixado), e "Perdidos", onde estudantes publicam fotos e/ou descrições de itens que perderam. A aplicação conta com busca para facilitar o cruzamento entre os dois feeds.

**Público principal:** Estudantes, professores e servidores da UFLA que perderam ou encontraram objetos dentro do campus.

**Funcionalidades prioritárias:**

- Publicação de itens encontrados (aba "Achados"), com foto, local, horário e ponto de entrega
- Publicação de itens perdidos (aba "Perdidos"), com foto e/ou descrição
- Busca/pesquisa nos feeds para facilitar o cruzamento entre achados e perdidos

## 3. Estrutura do repositório

```text
Radar UFLA/
│
├── .github/
│   └── ISSUE_TEMPLATE/
│
├── docs/
│   ├── arquitetura/
│   │   └── arquitetura.md
│   │
│   ├── modelagem/
│   │   ├── imagens/
│   │   └── modelagem.md
│   │
│   ├── padroes/
│   │   └── padroes-de-projeto.md
│   │
│   ├── projeto/
│   │   └── decisoes-de-projeto.md
│   │
│   ├── requisitos/
│   │   └── requisitos.md
│   │
│   ├── sprints/
│   │   ├── evidencias/
│   │   │   ├── sprint-01-execucao.png
│   │   │   └── sprint-01-project.png
│   │   │
│   │   ├── sprint-01.md
│   │   ├── sprint-02.md
│   │   ├── sprint-03.md
│   │   ├── sprint-04.md
│   │   ├── sprint-05.md
│   │   ├── sprint-06.md
│   │   ├── sprint-07.md
│   │   └── sprint-08.md
│   │
│   ├── testes/
│   │   ├── evidencias-testes.md
│   │   └── plano-de-testes.md
│   │
│   ├── backlog-produto.md
│   ├── uso-de-ia.md
│   └── visao-geral.md
│
├── rubrica/
│   └── autoavaliacao-entregas.md
│
├── src/
│   └── Front-End/
│       ├── app.js
│       ├── index.html
│       ├── publicar.html
│       └── styles.css
│
├── tests/
│
└── README.md
```

## 4. Tecnologias utilizadas

- **Front-end:** HTML, CSS e JavaScript
- **Back-end:** Node.js + Express.js
- **ORM:** Sequelize
- **Banco de dados:** MySQL (via Docker)
- **Autenticação:** JWT + Bcrypt
- **Upload de imagens:** Cloudinary + Multer
- **Containerização:** Docker + Docker Compose

## 5. Documentação

- [Visão geral do produto](docs/visao-geral.md)
- [Backlog do produto](docs/backlog-produto.md)
- [Requisitos](docs/requisitos/requisitos.md)
- [Documentação das sprints](docs/sprints/)

## 6. Execução da aplicação

Pré-requisitos: Python 3 instalado (usado apenas para servir os arquivos estáticos localmente).

1. Clone o repositório:

```bash
   git clone https://github.com/Matheus-Castro-Paula/Radar-UFLA.git
   cd Radar-UFLA
```

2. Rode o servidor local apontando para a pasta do front-end:

```bash
   # Linux/Mac
   python3 -m http.server 8000 --directory src/Front-End

   # Windows
   python -m http.server 8000 --directory src/Front-End
```

3. Abra `http://localhost:8000` no navegador.

> Nesta etapa (Sprint 1), a aplicação é apenas o front-end estático, com dados de exemplo fixos no código. O back-end (Node.js/Express) será adicionado em `src/Back-End/` a partir da Sprint 2.
