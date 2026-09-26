# Documentação de Modelagem UML — Sprint 3

## 1. Introdução
Este documento apresenta os modelos UML (Estruturais e Comportamentais) do projeto **Radar UFLA**, bem como a Matriz de Rastreabilidade que conecta os requisitos do produto às suas implementações e modelos.

---

## 2. Diagramas UML

### 2.1 Diagrama de Casos de Uso (Comportamental)
*(Diagrama de Casos de Uso mapeando os atores e as funcionalidades do sistema)*

### 2.2 Diagrama de Sequência / Atividades (Comportamental)
*(Diagrama do fluxo de publicação de anúncio e validações)*

### 2.3 Diagrama de Classes / MER (Estrutural)
*(Diagrama com as entidades Usuario, Anuncio, FotoAnuncio e Comentario)*

---

## 3. Matriz de Rastreabilidade

A Matriz de Rastreabilidade abaixo estabelece o elo entre os Requisitos Funcionais (RF), os Requisitos Não-Funcionais (RNF), as Regras de Negócio (RN), as Issues do GitHub, os Diagramas UML e o Código-fonte correspondente.

| ID Requisito / Regra | Descrição Sintética | Issue GitHub | Diagrama UML Associado | Artefato / Código Correspondente |
| :--- | :--- | :--- | :--- | :--- |
| **RF-001** | Cadastro e Autenticação Local (JWT / Bcrypt) | `#4` | Diagrama de Casos de Uso / Sequência | `API/Back-End/src/server.js`<br>`API/Back-End/src/migrations/*create-usuarios.js` |
| **RF-004** | Vitrine Pública de Achados e Perdidos | `#1` | Diagrama de Casos de Uso | `API/Front-End/index.html`<br>`API/Front-End/app.js` |
| **RF-007** | Cadastrar Novo Anúncio | `#2` | Diagrama de Casos de Uso / Sequência | `API/Back-End/src/migrations/*create-anuncios.js`<br>`API/Front-End/publicar.html` |
| **RF-008** | Upload de Fotos de Anúncios | `#3` | Diagrama de Classes | `API/Back-End/src/migrations/*create-fotos-anuncio.js` |
| **RN-004** | Ocultar dados/fotos sensíveis de "Documentos" | `#2` | Diagrama de Sequência | `API/Back-End/src/server.js` |
| **RNF-001** | Criptografia de senhas com Bcrypt | `#4` | Diagrama de Sequência | `API/Back-End/src/server.js` |