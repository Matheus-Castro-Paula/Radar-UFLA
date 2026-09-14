# Visão geral do produto

## 1. Problema escolhido

**Título:** Falta de um canal centralizado para achados e perdidos na UFLA

**Descrição concreta:**
Estudantes, professores e servidores da UFLA perdem e encontram objetos com frequência nos diversos espaços do campus (salas, corredores, laboratórios, biblioteca, refeitórios). Atualmente não existe um canal oficial e centralizado para lidar com essas situações: a comunicação depende de grupos informais de WhatsApp (geralmente restritos a um curso ou turma específica), de avisos fixados em murais físicos, ou do boca a boca entre colegas. Como consequência, quem encontra um objeto muitas vezes não sabe como avisar o dono, e quem perde um objeto não tem como buscar de forma centralizada se ele já foi encontrado — o que faz com que muitos itens nunca sejam devolvidos.

**Evidências ou exemplos do problema:**

- Um aluno esquece a carteira em uma sala após uma aula e só percebe horas depois; sem saber em qual grupo de WhatsApp avisar, a carteira permanece na sala até ser encontrada (ou não) por acaso.
- Um estudante encontra um cartão de estudante caído no corredor do bloco de salas, mas não tem uma forma simples de avisar o dono, já que não sabe a quem pertence.
- Grupos de WhatsApp de "achados e perdidos" existem de forma isolada por curso ou turma, então um item encontrado por alguém de outro curso muitas vezes não chega até quem perdeu.
- Murais físicos com avisos de objetos perdidos dependem de que a pessoa passe fisicamente pelo local e, por acaso, veja o aviso antes que ele seja removido.

## 2. Público e stakeholders

| Stakeholder                     | Necessidade/interesse                                                             | Como será envolvido ou representado                                      |
| ------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Estudante que perdeu um item    | Saber rapidamente se alguém encontrou seu objeto, sem depender de grupos fechados | Publica na aba "Perdidos" e usa a busca para consultar itens encontrados |
| Estudante que encontrou um item | Ter uma forma simples e visível de avisar o dono do objeto encontrado             | Publica na aba "Achados", com foto, local, horário e ponto de entrega    |
| Professores e servidores        | Mesma necessidade dos estudantes, dentro do mesmo campus                          | Podem publicar e consultar itens normalmente, como qualquer usuário      |
| UFLA (instituição)              | Ter um campus mais organizado e uma comunidade mais colaborativa                  | Beneficiada indiretamente pela redução de itens não recuperados          |

## 3. Visão do produto

**Nome da solução:** Radar UFLA

**Proposta de valor:** Para a comunidade da UFLA que perde ou encontra objetos no campus, o Radar UFLA é uma aplicação web em formato de feed que centraliza publicações de achados e perdidos, permitindo busca rápida e reduzindo o tempo até a recuperação do item.

**Objetivo geral:** Oferecer um canal único, público e de fácil uso para publicação e busca de itens achados e perdidos na UFLA.

**Objetivos específicos:**

- Facilitar o cruzamento entre quem perdeu e quem encontrou um item, por meio de busca;
- Reduzir a dependência de canais informais e fragmentados (grupos de WhatsApp, murais físicos);
- Criar uma base que permita, futuramente, a expansão da solução para outros campi ou instituições.

## 4. Escopo inicial

### Dentro do escopo

- Publicação de itens encontrados (aba "Achados"), com foto, local, horário e ponto de entrega;
- Publicação de itens perdidos (aba "Perdidos"), com foto e/ou descrição;
- Busca/pesquisa nos feeds, por palavras-chave, para facilitar o cruzamento entre achados e perdidos;
- Publicação de documentos pessoais (RG, carteirinha estudantil, cartões, etc.) como categoria de item, porém **sem exposição de foto do documento em si** — apenas descrição textual (tipo do documento e, se visível, nome do titular), como medida de proteção de dados pessoais.

### Fora do escopo

- Expansão para outros campus ou instituições além da UFLA (objetivo de longo prazo, não desta versão);
- Sistema de intermediação para entrega física dos itens (ex: logística de correios internos) — o contato entre quem perdeu e quem encontrou será feito diretamente pela plataforma, cabendo às partes combinarem a devolução;
- Verificação formal de identidade dos usuários além do cadastro básico.

## 5. Restrições e premissas

| Tipo      | Item                                                                                           | Impacto no projeto                                                |
| --------- | ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Restrição | Prazo do semestre letivo (entregas incrementais até 30/11/2026)                                | Define o ritmo de evolução das funcionalidades a cada sprint      |
| Restrição | Stack definida: Node.js + Express + Sequelize + MySQL (back-end) e HTML/CSS/JS (front-end)     | Orienta as decisões de arquitetura e padrões nas próximas sprints |
| Restrição | Documentos pessoais não podem expor foto com dados sensíveis                                   | Limita o formato de publicação dessa categoria de item            |
| Premissa  | Usuários têm acesso a e-mail institucional ou pessoal para cadastro/login                      | Base para o fluxo de autenticação (JWT)                           |
| Premissa  | O público-alvo inicial (comunidade UFLA) já está habituado ao formato de feed de redes sociais | Justifica a escolha da interface no padrão de feed                |

## 6. Diferenciais da solução

O Radar UFLA não é um formulário ou CRUD genérico de "cadastro de itens": a proposta central é o **cruzamento ativo** entre dois públicos (quem perdeu e quem encontrou) por meio de busca, dentro de um formato de feed já familiar ao público universitário. Isso reduz a curva de aprendizado, amplia o alcance da informação para além de grupos fechados de WhatsApp ou murais físicos restritos a um local físico, e centraliza em um único canal público algo que hoje está fragmentado por curso, turma ou bloco do campus.

## 7. Histórico de mudanças

| Data/sprint | Mudança                  | Motivo            | Issue/decisão relacionada |
| ----------- | ------------------------ | ----------------- | ------------------------- |
| Sprint 1    | Criação da visão inicial | Início do projeto | ``                        |
