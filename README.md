# Academic Microservices — NestJS, TCP, Prisma e PostgreSQL

Projeto desenvolvido durante a Unidade Curricular de **Programação Web 2 — Senac RJ**, utilizando **NestJS, TypeScript, Microserviços, TCP, Prisma ORM e PostgreSQL**.

---

# 1. Descrição

Este projeto implementa uma arquitetura baseada em **microserviços**, evoluindo a estrutura inicial do Tutorial 01 para uma aplicação com:

- API Gateway;
- Microserviço de usuários;
- Microserviço de pedidos;
- CRUD completo;
- DTOs e validação;
- Comunicação entre microserviços;
- Bancos de dados separados;
- Prisma ORM;
- PostgreSQL;
- Tratamento de erros RPC;
- Timeout entre serviços.

A arquitetura utilizada é:

```text
Cliente HTTP
    │
    ▼
API Gateway
    │
    ├────────────── TCP ──────────────► Users Service
    │                                      │
    │                                      ▼
    │                                   users_db
    │
    └────────────── TCP ──────────────► Orders Service
                                           │
                                           ├── TCP ─────► Users Service
                                           │
                                           ▼
                                        orders_db
```

O **API Gateway** recebe as requisições HTTP e encaminha as operações para os microserviços.

O **Users Service** é responsável pelo domínio de usuários.

O **Orders Service** é responsável pelo domínio de pedidos e consulta o Users Service para verificar se um usuário existe antes de criar ou atualizar um pedido.

Cada microserviço possui seu próprio banco de dados.

---

# 2. Funcionalidades

O projeto possui as seguintes funcionalidades:

- Criação de usuários;
- Listagem de usuários;
- Consulta de usuário por ID;
- Atualização de usuários;
- Exclusão de usuários;
- Criação de pedidos;
- Listagem de pedidos;
- Consulta de pedido por ID;
- Atualização de pedidos;
- Exclusão de pedidos;
- Listagem de pedidos por usuário;
- Validação de existência do usuário antes da criação de pedidos;
- Bloqueio da exclusão de usuários que possuem pedidos;
- Validação de dados através de DTOs;
- Comunicação TCP entre aplicações NestJS;
- Comunicação entre Orders Service e Users Service;
- Persistência com Prisma ORM;
- Bancos PostgreSQL independentes;
- Timeout nas chamadas realizadas pelo API Gateway;
- Tratamento de erros em comunicação RPC.

---

# 3. Tecnologias Utilizadas

- **Node.js**
- **NestJS**
- **TypeScript**
- **@nestjs/microservices**
- **class-validator**
- **class-transformer**
- **Prisma ORM 7**
- **@prisma/adapter-pg**
- **PostgreSQL**
- **pg**
- **RxJS**
- **TCP**
- **Rspack**
- **npm**
- **Git**
- **GitHub**

---

# 4. Arquitetura da Aplicação

A aplicação utiliza uma arquitetura distribuída composta por três aplicações NestJS.

```text
Cliente
   │
   │ HTTP
   ▼
┌──────────────────┐
│   API Gateway    │
│     :3000        │
└────────┬─────────┘
         │
         │ TCP
         │
    ┌────┴───────────────┐
    │                    │
    ▼                    ▼
┌──────────────┐   ┌──────────────┐
│ Users Service│   │Orders Service│
│    :3001     │   │    :3002     │
└──────┬───────┘   └──────┬───────┘
       │                  │
       ▼                  ▼
   Prisma ORM         Prisma ORM
       │                  │
       ▼                  ▼
   users_db           orders_db
```

Além disso, o Orders Service realiza comunicação síncrona com o Users Service:

```text
Orders Service
      │
      │ users.findOne
      ▼
Users Service
      │
      ▼
users_db
```

---

# 5. Responsabilidades dos Serviços

## API Gateway

Responsável por:

- Receber requisições HTTP;
- Validar DTOs;
- Encaminhar mensagens TCP;
- Aplicar timeout nas chamadas;
- Traduzir erros RPC para respostas HTTP;
- Orquestrar operações entre serviços quando necessário.

## Users Service

Responsável por:

- Criar usuários;
- Consultar usuários;
- Atualizar usuários;
- Excluir usuários;
- Persistir dados em `users_db`.

## Orders Service

Responsável por:

- Criar pedidos;
- Consultar pedidos;
- Atualizar pedidos;
- Excluir pedidos;
- Listar pedidos por usuário;
- Validar usuários através do Users Service;
- Persistir dados em `orders_db`.

---

# 6. Estrutura do Projeto

A aplicação utiliza o modelo de **monorepo do NestJS**.

```text
academic-microservicos/
├── apps/
│   ├── api-gateway/
│   │   └── src/
│   │       ├── app.module.ts
│   │       ├── main.ts
│   │       ├── users.controller.ts
│   │       ├── orders.controller.ts
│   │       └── rpc-to-http-exception.filter.ts
│   │
│   ├── users/
│   │   └── src/
│   │       ├── main.ts
│   │       ├── prisma.service.ts
│   │       ├── users.module.ts
│   │       ├── users.controller.ts
│   │       └── users.service.ts
│   │
│   └── orders/
│       └── src/
│           ├── main.ts
│           ├── prisma.service.ts
│           ├── orders.module.ts
│           ├── orders.controller.ts
│           └── orders.service.ts
│
├── libs/
│   └── contracts/
│       └── src/
│           ├── index.ts
│           ├── users.dto.ts
│           ├── orders.dto.ts
│           └── http-to-rpc-exception.filter.ts
│
├── prisma/
│   ├── users/
│   │   ├── schema.prisma
│   │   └── migrations/
│   │
│   ├── orders/
│   │   ├── schema.prisma
│   │   └── migrations/
│   │
│   ├── users.config.ts
│   └── orders.config.ts
│
├── generated/
│   ├── users/
│   └── orders/
│
├── .env
├── nest-cli.json
├── package.json
├── package-lock.json
└── tsconfig.json
```

---

# 7. Pré-requisitos

Antes de executar o projeto, é necessário possuir:

- Node.js;
- npm;
- Git;
- NestJS CLI;
- PostgreSQL.

Instalação do NestJS CLI:

```bash
npm install -g @nestjs/cli
```

---

# 8. Instalação

## 8.1 Clone o repositório

```bash
git clone https://github.com/matheuspessoa14/academic-microservicos.git
```

## 8.2 Acesse a pasta

```bash
cd academic-microservicos
```

## 8.3 Acesse a branch do Tutorial 02

```bash
git switch branch_20261020
```

## 8.4 Instale as dependências

```bash
npm install
```

---

# 9. Bibliotecas Compartilhadas

O projeto possui uma biblioteca compartilhada:

```text
libs/contracts
```

Ela contém contratos utilizados pelas aplicações, como:

```text
CreateUserDto
UpdateUserDto
CreateOrderDto
UpdateOrderDto
HttpToRpcExceptionFilter
```

Os serviços compartilham apenas contratos e estruturas de comunicação.

Eles não compartilham diretamente regras de negócio ou acesso aos bancos de dados.

---

# 10. DTOs e Validação

O projeto utiliza:

```text
class-validator
class-transformer
```

Os DTOs são responsáveis pela validação dos dados recebidos.

Exemplo de usuário:

```text
CreateUserDto
├── name
└── email
```

Exemplo de pedido:

```text
CreateOrderDto
├── userId
├── description
└── total
```

A aplicação utiliza:

```ts
new ValidationPipe({
  whitelist: true,
  transform: true,
});
```

O `whitelist` remove propriedades que não fazem parte do DTO.

O `transform` permite transformar os valores recebidos para os tipos esperados.

---

# 11. Configuração dos Bancos

O projeto utiliza dois bancos PostgreSQL independentes.

```text
Users Service
     ↓
users_db
```

```text
Orders Service
     ↓
orders_db
```

Criação:

```sql
CREATE DATABASE users_db;
```

```sql
CREATE DATABASE orders_db;
```

Essa separação evita que os microserviços acessem diretamente os dados pertencentes a outros domínios.

---

# 12. Variáveis de Ambiente

Crie um arquivo `.env` na raiz:

```env
USERS_DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/users_db"

ORDERS_DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/orders_db"
```

Substitua:

```text
SUA_SENHA
```

pela senha local do PostgreSQL.

O `.env` não deve ser versionado.

```gitignore
.env
```

---

# 13. Prisma — Users Service

Schema:

```text
prisma/users/schema.prisma
```

Modelo:

```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  createdAt DateTime @default(now())
}
```

Cada usuário possui:

```text
User
├── id
├── name
├── email
└── createdAt
```

---

# 14. Prisma — Orders Service

Schema:

```text
prisma/orders/schema.prisma
```

Modelo:

```prisma
model Order {
  id          Int      @id @default(autoincrement())
  userId      Int
  description String
  total       Decimal  @db.Decimal(10, 2)
  createdAt   DateTime @default(now())
}
```

Cada pedido possui:

```text
Order
├── id
├── userId
├── description
├── total
└── createdAt
```

Não existe uma relação Prisma direta entre `Order` e `User`.

O campo `userId` representa apenas o identificador do usuário pertencente ao outro microserviço.

---

# 15. Migrations

## Users

```bash
npx prisma migrate dev --config prisma/users.config.ts --name init_users
```

Gerar client:

```bash
npx prisma generate --config prisma/users.config.ts
```

## Orders

```bash
npx prisma migrate dev --config prisma/orders.config.ts --name init_orders
```

Gerar client:

```bash
npx prisma generate --config prisma/orders.config.ts
```

---

# 16. PrismaService

Cada microserviço possui seu próprio `PrismaService`.

```text
UsersService
    ↓
Users PrismaService
    ↓
users_db
```

```text
OrdersService
    ↓
Orders PrismaService
    ↓
orders_db
```

O API Gateway não utiliza Prisma diretamente.

---

# 17. Comunicação entre os Serviços

A comunicação interna utiliza:

```text
Transport.TCP
```

Portas utilizadas:

| Aplicação | Porta | Protocolo |
| --- | ---: | --- |
| API Gateway | 3000 | HTTP |
| Users Service | 3001 | TCP |
| Orders Service | 3002 | TCP |

O API Gateway utiliza:

```ts
ClientProxy.send()
```

O microserviço recebe utilizando:

```ts
@MessagePattern()
```

---

# 18. Message Patterns — Users

O Users Service disponibiliza:

```text
users.create
users.findAll
users.findOne
users.update
users.remove
```

Exemplo:

```text
Gateway
   │
   │ users.findOne
   ▼
Users Service
```

---

# 19. Message Patterns — Orders

O Orders Service disponibiliza:

```text
orders.create
orders.findAll
orders.findOne
orders.findByUser
orders.update
orders.remove
```

Exemplo:

```text
Gateway
   │
   │ orders.create
   ▼
Orders Service
```

---

# 20. Comunicação Orders → Users

Ao criar um pedido, Orders precisa verificar se o usuário existe.

O fluxo é:

```text
Orders Service
      │
      │ users.findOne
      ▼
Users Service
      │
      ▼
users_db
```

Somente depois da validação:

```text
Orders Service
      │
      ▼
orders_db
```

Fluxo completo:

```text
POST /orders
      │
      ▼
API Gateway
      │
      │ orders.create
      ▼
Orders Service
      │
      │ users.findOne
      ▼
Users Service
      │
      ▼
users_db
      │
      ▼
usuário existe
      │
      ▼
Orders Service
      │
      ▼
orders_db
```

---

# 21. Request-Response com `send()`

A comunicação síncrona utiliza:

```ts
client.send(...)
```

O método retorna um `Observable`.

Quando é necessário aguardar diretamente a resposta, é utilizado:

```ts
firstValueFrom(...)
```

Exemplo conceitual:

```text
Orders
   │
   │ send('users.findOne')
   ▼
Users
   │
   │ resposta
   ▼
Orders
```

---

# 22. Timeout

O projeto utiliza timeout de:

```text
3000 ms
```

Exemplo:

```ts
.pipe(
  timeout(3000),
)
```

O objetivo é evitar que uma requisição fique aguardando indefinidamente um serviço indisponível.

---

# 23. Tratamento de Erros RPC

Em uma arquitetura de microserviços, uma exceção HTTP criada dentro de um serviço TCP não deve ser tratada automaticamente como uma resposta HTTP.

Por isso o projeto utiliza filtros para conversão de erros.

Fluxo:

```text
Erro interno
    ↓
HttpToRpcExceptionFilter
    ↓
Erro RPC
    ↓
API Gateway
    ↓
RpcToHttpExceptionFilter
    ↓
Resposta HTTP
```

Isso permite padronizar os erros entre as aplicações.

---

# 24. API Gateway

O Gateway disponibiliza as rotas HTTP para o cliente.

O cliente não precisa conhecer:

```text
localhost:3001
localhost:3002
```

Ele acessa apenas:

```text
http://localhost:3000
```

O Gateway decide qual microserviço deverá atender cada operação.

---

# 25. Endpoints de Users

| Método | Endpoint | Descrição |
| --- | --- | --- |
| `POST` | `/users` | Cria um usuário |
| `GET` | `/users` | Lista os usuários |
| `GET` | `/users/:id` | Busca usuário por ID |
| `PATCH` | `/users/:id` | Atualiza usuário |
| `DELETE` | `/users/:id` | Exclui usuário |

---

# 26. Endpoints de Orders

| Método | Endpoint | Descrição |
| --- | --- | --- |
| `POST` | `/orders` | Cria um pedido |
| `GET` | `/orders` | Lista os pedidos |
| `GET` | `/orders/:id` | Busca pedido por ID |
| `GET` | `/orders/user/:userId` | Lista pedidos de um usuário |
| `PATCH` | `/orders/:id` | Atualiza pedido |
| `DELETE` | `/orders/:id` | Exclui pedido |

---

# 27. Exemplos — Users

## Criar usuário

```http
POST /users
Content-Type: application/json
```

```json
{
  "name": "Matheus",
  "email": "matheus@email.com"
}
```

Exemplo de resposta:

```json
{
  "id": 1,
  "name": "Matheus",
  "email": "matheus@email.com",
  "createdAt": "2026-10-26T20:00:00.000Z"
}
```

---

## Listar usuários

```http
GET /users
```

---

## Buscar usuário

```http
GET /users/1
```

---

## Atualizar usuário

```http
PATCH /users/1
Content-Type: application/json
```

```json
{
  "name": "Matheus Pessoa"
}
```

---

## Excluir usuário

```http
DELETE /users/1
```

---

# 28. Exemplos — Orders

## Criar pedido

```http
POST /orders
Content-Type: application/json
```

```json
{
  "userId": 1,
  "description": "Notebook",
  "total": 4500
}
```

Exemplo de resposta:

```json
{
  "id": 1,
  "userId": 1,
  "description": "Notebook",
  "total": "4500",
  "createdAt": "2026-10-26T20:00:00.000Z"
}
```

---

## Listar pedidos

```http
GET /orders
```

---

## Buscar pedido

```http
GET /orders/1
```

---

## Pedidos por usuário

```http
GET /orders/user/1
```

---

## Atualizar pedido

```http
PATCH /orders/1
Content-Type: application/json
```

```json
{
  "description": "Notebook Gamer",
  "total": 5500
}
```

---

## Excluir pedido

```http
DELETE /orders/1
```

---

# 29. Validação de Usuário no Orders Service

O Orders Service não cria pedidos para usuários inexistentes.

Ao receber:

```text
POST /orders
```

o serviço consulta:

```text
users.findOne
```

Se o usuário não existir, o pedido não é persistido.

Exemplo inválido:

```json
{
  "userId": 999999,
  "description": "Teste",
  "total": 100
}
```

Resultado esperado:

```text
Usuário inválido
```

---

# 30. Regra para Exclusão de Usuários

Um usuário que possui pedidos não pode ser excluído.

Antes da exclusão:

```text
DELETE /users/:id
```

o Gateway consulta:

```text
orders.findByUser
```

Fluxo:

```text
DELETE /users/1
       │
       ▼
API Gateway
       │
       │ orders.findByUser
       ▼
Orders Service
       │
       ▼
Pedidos encontrados?
       │
   ┌───┴────┐
   │        │
  SIM      NÃO
   │        │
   ▼        ▼
Bloqueia   Users Service
exclusão       │
               ▼
           remove user
```

Mensagem utilizada:

```text
Não é possível excluir um usuário que possui pedidos
```

---

# 31. Execução do Projeto

São necessários três terminais.

## Terminal 1 — Users Service

```bash
npx nest start users --watch
```

Porta:

```text
3001
```

---

## Terminal 2 — Orders Service

```bash
npx nest start orders --watch
```

Porta:

```text
3002
```

---

## Terminal 3 — API Gateway

```bash
npx nest start api-gateway --watch
```

Porta:

```text
3000
```

---

# 32. Build

Para validar o Users Service:

```bash
npx nest build users
```

Para validar o Orders Service:

```bash
npx nest build orders
```

Para validar o API Gateway:

```bash
npx nest build api-gateway
```

Os três projetos devem compilar sem erros antes do envio.

---

# 33. Testes Realizados

Foram testadas as seguintes operações:

```text
POST   /users
GET    /users
GET    /users/:id
PATCH  /users/:id
DELETE /users/:id
```

Também foram testadas:

```text
POST   /orders
GET    /orders
GET    /orders/:id
GET    /orders/user/:userId
PATCH  /orders/:id
DELETE /orders/:id
```

Também foram validados:

- Criação de pedido com usuário existente;
- Rejeição de pedido para usuário inexistente;
- Comunicação entre Orders e Users;
- Persistência separada em PostgreSQL;
- Atualização de pedidos;
- Exclusão de pedidos;
- Busca de pedidos por usuário;
- Bloqueio de exclusão de usuário que possui pedidos;
- Timeout entre serviços;
- Tratamento de erros RPC;
- Compilação dos três projetos.

---

# 34. Fluxo Completo de Criação de Pedido

```text
Cliente
   │
   │ POST /orders
   ▼
API Gateway
   │
   │ orders.create
   ▼
Orders Service
   │
   │ users.findOne
   ▼
Users Service
   │
   ▼
Prisma Users
   │
   ▼
users_db
   │
   ▼
Resposta do usuário
   │
   ▼
Orders Service
   │
   ▼
Prisma Orders
   │
   ▼
orders_db
   │
   ▼
API Gateway
   │
   ▼
Cliente
```

---

# 35. Monólito x Microserviços

Em uma aplicação monolítica:

```text
Controller
    ↓
Service
    ↓
Repository / ORM
    ↓
Banco
```

Neste projeto:

```text
HTTP Controller
      ↓
API Gateway
      ↓
ClientProxy
      ↓
TCP
      ↓
MessagePattern
      ↓
Microserviço
      ↓
Prisma
      ↓
Banco próprio
```

Os serviços são executados como aplicações independentes.

---

# 36. Banco por Microserviço

A aplicação segue o princípio de que cada serviço controla seus próprios dados.

```text
Users Service
     │
     ▼
users_db
```

```text
Orders Service
     │
     ▼
orders_db
```

O Orders Service não acessa diretamente `users_db`.

O Users Service não acessa diretamente `orders_db`.

A comunicação entre domínios acontece por mensagens.

---

# 37. `send()` e Comunicação Síncrona

Neste tutorial foi utilizado principalmente:

```ts
client.send(...)
```

Essa abordagem implementa o padrão:

```text
Request
   ↓
Microserviço
   ↓
Response
```

O serviço que envia a mensagem aguarda uma resposta.

Isso cria uma dependência síncrona entre os serviços.

---

# 38. Limitações da Implementação

O projeto possui características de estudo e laboratório.

Em aplicações de produção ainda seriam necessários recursos adicionais, como:

- Autenticação;
- Autorização;
- Logs estruturados;
- Métricas;
- Correlation IDs;
- Rastreamento distribuído;
- Retries controlados;
- Circuit breaker;
- Tratamento mais avançado de indisponibilidade;
- Persistência de mensagens;
- Segurança da comunicação interna;
- Estratégias de consistência distribuída.

---

# 39. Conceitos Estudados

Durante o Tutorial 02 foram trabalhados:

- Microserviços;
- Monorepo NestJS;
- API Gateway;
- Comunicação TCP;
- `ClientProxy`;
- `@MessagePattern`;
- DTOs;
- `class-validator`;
- `class-transformer`;
- `ValidationPipe`;
- Prisma ORM;
- PostgreSQL;
- Banco por microserviço;
- Comunicação entre microserviços;
- Request-response;
- `Observable`;
- `firstValueFrom`;
- `timeout`;
- CRUD distribuído;
- Tratamento de erros RPC;
- Separação de responsabilidades;
- Dependência síncrona entre serviços;
- Orquestração pelo Gateway.

---

# 40. Evolução do Projeto

No Tutorial 01, a arquitetura possuía:

```text
API Gateway
     ↓
Users Service
     ↓
PostgreSQL
```

No Tutorial 02, a arquitetura evoluiu para:

```text
                   ┌──► Users Service ──► users_db
                   │
API Gateway ───────┤
                   │
                   └──► Orders Service ─► orders_db
                              │
                              └──► Users Service
```

Isso permite demonstrar comunicação entre diferentes domínios da aplicação.

---

# 41. Versionamento e Organização das Branches

O projeto utiliza Git e GitHub para controle de versão.

Repositório:

```text
https://github.com/matheuspessoa14/academic-microservicos
```

O Tutorial 01 foi desenvolvido na branch:

```text
branch_20261006
```

O Tutorial 02 foi desenvolvido na branch:

```text
branch_20261020
```

A branch do Tutorial 02 foi criada a partir da implementação anterior, permitindo continuar a evolução do projeto sem alterar o histórico da atividade anterior.

---

# 42. Autor

**Nome:** Matheus Pessoa Telles 
**Unidade Curricular:** Programação Web 2  
**Instituição:** Senac RJ

GitHub:

```text
https://github.com/matheuspessoa14
```

---

# 43. Licença e Uso Acadêmico

Projeto desenvolvido para fins acadêmicos na Unidade Curricular de **Programação Web 2 — Senac RJ**.

O código poderá ser utilizado para avaliação e acompanhamento acadêmico durante o curso.