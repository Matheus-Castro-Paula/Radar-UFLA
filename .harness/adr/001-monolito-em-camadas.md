# ADR-001 — Monólito em camadas, cliente-servidor

- **Status:** Aceito
- **Data:** 2026-10-20 (registro retroativo da estrutura adotada desde a Sprint 2)
- **Requisitos relacionados:** RNF-06

## Contexto

O Radar UFLA é essencialmente um CRUD de anúncios com autenticação, regras de privacidade e busca. A equipe tem 5 pessoas, o prazo é um semestre, e o deploy é único. O RNF-06 pede arquitetura cliente-servidor modular com banco relacional.

## Decisão

Front-end estático (HTML/CSS/JS) consumindo uma **API REST única** em Express, organizada em camadas: `routes → middlewares → controllers → services → models`, com MySQL via Sequelize.

## Alternativas consideradas

- **Microsserviços** (ex.: serviço de auth separado do de anúncios) — custo de deploy, rede e consistência desproporcional ao tamanho do sistema e do time.
- **Clean/Hexagonal completa** (ports & adapters, repositórios abstratos) — mais arquivos e indireção do que o domínio justifica; o Sequelize já isola o acesso ao banco razoavelmente.
- **Tudo no controller** (padrão inicial do `authController`) — mistura HTTP, regra e banco; difícil de testar e de rastrear regras (ver ADR-002).

## Consequências

- Um único processo para subir, depurar e publicar (Docker).
- Modularidade vem das camadas, não de serviços separados — exige disciplina para não pular camadas.
- Se algum módulo crescer muito (ex.: match automático, RN-05), pode ser extraído depois sem reescrever o resto.
