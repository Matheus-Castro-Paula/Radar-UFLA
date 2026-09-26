# Sprint 3 — Modelagem e rastreabilidade dos requisitos
Data de entrega: 28/09/2026
Pontuação: 2,5 pontos
Tag obrigatória: sprint-03
Responsável por conferir este arquivo: Luis Gustavo Borges Vilela Marques (@Luis-Marques06)

---

## 1. Pergunta que esta sprint deve responder
**Como a estrutura e os principais fluxos do sistema são representados?**

---

## 2. Objetivo e resultado da sprint
* **Objetivo planejado:** Desenhar e documentar os modelos UML estruturais (Diagrama de Classes / MER) e comportamentais (Casos de Uso e Sequência) do Radar UFLA, conectá-los com a Matriz de Rastreabilidade e implementar a autenticação JWT com criptografia no Back-End e consumo no Front-End.
* **Resultado efetivamente alcançado:** Modelos UML finalizados em `docs/modelagem/modelagem.md`, Matriz de Rastreabilidade concluída, rotas de Login e Cadastro com JWT funcionais no Back-End e integradas via `fetch` no Front-End.

---

## 3. Checklist do artefato central —
**Entrega esperada:** `docs/modelagem/modelagem.md`, ao menos um modelo comportamental e um estrutural, descrições e vínculo com requisitos.

- [x] Modelos legíveis e versionados no repositório.
- [x] Descrição textual da finalidade e decisões de cada modelo.
- [x] Requisitos ligados aos elementos dos modelos.
- [x] Backlog/requisitos refinados quando a modelagem revelar mudanças.
- [x] Links entre elementos modelados e código existente.

### Links dos artefatos

| Artefato criado/atualizado | Link na tag da sprint | O que mudou |
| :--- | :--- | :--- |
| Documento de Modelagem UML | [modelagem.md](../../docs/modelagem/modelagem.md) | Inclusão dos diagramas de Casos de Uso, Sequência e Classes, além da Matriz de Rastreabilidade. |
| Imagens dos Diagramas UML | [docs/modelagem/imagens/](../../docs/modelagem/imagens/) | Upload das imagens dos diagramas estruturais e comportamentais em versão de alta resolução. |
| Relatório de Sprint 3 | [sprint-03.md](sprint-03.md) | Preenchimento completo da ata, backlog da sprint, evidências e acompanhamento de tarefas. |

---

## 4. Incremento da aplicação web 
**Incremento mínimo esperado:** Evolução de um fluxo modelado, estrutura de dados/classes coerente e evidência de correspondência entre modelo e código.

### O que foi implementado ou evoluído
Implementação do fluxo de **Cadastro e Autenticação Local de Usuários (`RF-001`)** utilizando criptografia `bcrypt` para palavras-passe e geração de tokens **JWT** no Back-End (Express). A estrutura de dados baseou-se nos Models do Sequelize mapeados no Diagrama de Classes (`Usuario`, `Anuncio`, `FotoAnuncio` e `Comentario`). No Front-End, as páginas de Login e Cadastro foram conectadas à API através de requisições `fetch()`, salvando o token no `localStorage`.

### Como executar e verificar

```bash
# 1. Subir infraestrutura (API Express e MySQL em Docker)
docker compose up -d --build

# 2. Executar as migrations do Sequelize
npx sequelize-cli db:migrate

# 3. Executar o servidor local do Front-End
python -m http.server 8000 --directory API/Front-End
````

Aceder a http://localhost:8000 e testar os formulários de Login/Cadastro.

| Requisito/Issue | Código ou protótipo | Evidência de execução |
| :---- | :---- | :---- |
| **RF-001** / \#4 | [server.js](https://www.google.com/search?q=../../API/Back-End/src/server.js&utm_source=gemini) | Testes no Postman/Insomnia com geração do Token JWT. |
| **RF-001** / \#4 | [app.js](https://www.google.com/search?q=../../API/Front-End/app.js&utm_source=gemini) | Formulários de login e registo a enviar fetch para a API. |
| **RF-007** / \#2 | [create-anuncios.js](https://www.google.com/search?q=../../API/Back-End/src/migrations/20260918000001-create-anuncios.js&utm_source=gemini) | Migration e model do Sequelize espelhando a entidade Anúncio. |

## **5\. Scrum e gestão do trabalho**

### **Sprint Backlog**

| Issue | Descrição | Responsável | Critério de aceitação/conclusão | Situação |
| :---- | :---- | :---- | :---- | :---- |
| \#1 | Elaborar Matriz de Rastreabilidade e Relatório da Sprint 3 | @Luis-Marques06 | Documentação em modelagem.md e sprint-03.md completa e com links válidos. | Concluída |
| \#2 | Modelagem Comportamental (Casos de Uso e Sequência) | @BernarDEVthomaz | Diagramas em PNG exportados e explicados textualmente com a regra RN-04. | Concluída |
| \#3 | Modelagem Estrutural (Diagrama de Classes / MER) | @Artxisto | Diagrama de classes coerente com os Models/Migrations em API/src/models. | Concluída |
| \#4 | Implementar autenticação local via JWT e Bcrypt | @Matheus-Castro-Paula | Rotas de /login e /register devolvendo token JWT e validando credenciais. | Concluída |
| \#5 | Integração do formulário Front-End com a API via fetch | @rodrigopenha13 | Formulários a disparar requisições para o Back-End e guardar token no localStorage. | Concluída |

### **Acompanhamento**

* **GitHub Project:** [Projeto Radar UFLA \- Sprint 3](https://www.google.com/search?q=https://github.com/users/Matheus-Castro-Paula/projects/2&utm_source=gemini)  
* **Reuniões/decisões:** Discutido o fluxo de validação da regra RN-04 (ocultar dados sensíveis de documentos) durante o fluxo de publicação.  
* **Impedimentos:** Nenhum.  
* **Mudanças de escopo:** Nenhuma.

## **6\. GitHub, documentação e rastreabilidade**

| Tipo de evidência | Link | O que comprova |
| :---- | :---- | :---- |
| **Issue** | [\#4](https://www.google.com/search?q=https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/4&utm_source=gemini) | Tarefa de implementação de Autenticação JWT e Bcrypt. |
| **Commit** | [Ver Commits](https://www.google.com/search?q=https://github.com/Matheus-Castro-Paula/Radar-UFLA/commits/main&utm_source=gemini) | Commits individuais efetuados por todos os 5 membros da equipa. |
| **Código/arquivo** | [modelagem.md](https://www.google.com/search?q=../../docs/modelagem/modelagem.md&utm_source=gemini) | Presença dos modelos UML estruturais e comportamentais descritos. |
| **Relatório** | [sprint-03.md](https://www.google.com/search?q=sprint-03.md&utm_source=gemini) | Relatório da Sprint 3 preenchido e vinculado aos artefatos. |

### **Rastreabilidade resumida**

| Requisito | Issue | Artefato/modelo/decisão | Código | Teste/evidência |
| :---- | :---- | :---- | :---- | :---- |
| **RF-001** | \#4 | Diagrama de Casos de Uso e Sequência | API/Back-End/src/server.js | Testes de login/registo via Postman e fetch no Front |
| **RF-004** | \#1 | Diagrama de Casos de Uso | API/Front-End/index.html | Exibição das abas Achados e Perdidos |
| **RF-007** | \#2 | Diagrama de Classes e Sequência | API/Back-End/src/migrations/\* | Criação de tabelas no banco MySQL via Sequelize |
| **RN-004** | \#2 | Diagrama de Sequência | API/Back-End/src/server.js | Ocultação de dados sensíveis na publicação de documentos |

## **7\. Revisão do incremento**

* **O que foi demonstrado:** Fluxo de criação de conta e login na API funcionando com geração de token JWT, sincronizado com o diagrama estrutural de dados e consumido pelo Front-End.  
* **Critérios atendidos:** Modelos UML entregues, matriz de rastreabilidade completa, código alinhado aos modelos e commits realizados por todos os elementos.  
* **Itens não concluídos:** Nenhum.  
* **Motivo das pendências:** Não se aplicam.  
* **Feedback recebido e ajustes:** Abertura para melhoria visual dos diagramas nas próximas sprints.

## **8\. Retrospectiva e próxima sprint**

* **Funcionou bem:** Comunicação entre o desenvolvimento do Back-End e o desenho do Diagrama de Classes, facilitando a correspondência do código com a documentação.  
* **Precisa melhorar:** Antecipação na exportação e finalização das imagens dos diagramas para montagem rápida do documento final.  
* **Ação concreta para a próxima sprint:** Definir a arquitetura dos Princípios de Projeto (Sprint 4\) logo nas primeiras reuniões.

## **9\. O que não será considerado suficiente**

* Diagramas sem explicação.  
* Imagens externas sem versão no repositório.  
* Modelo genérico que não corresponde aos requisitos ou ao código.

## **10\. Links enviados no UFLA Virtual**

* **Tag sprint-03:** https://github.com/Matheus-Castro-Paula/Radar-UFLA/releases/tag/sprint-03  
* **Este arquivo na tag:** https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-03/docs/sprints/sprint-03.md  
* **Observação adicional:** Todas as entregas cumprem a rubrica estipulada para a disciplina.

