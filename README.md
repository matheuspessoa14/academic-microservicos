# Academic Microservices — NestJS, TCP, RabbitMQ, Prisma e PostgreSQL

Projeto desenvolvido durante a Unidade Curricular de **Programação Web 2 — Senac RJ**, utilizando **NestJS, TypeScript, Microserviços, TCP, RabbitMQ, Prisma ORM, PostgreSQL e Docker**.

---

# 1. Descrição

Este projeto implementa uma arquitetura baseada em **microserviços**, evoluindo as implementações dos Tutoriais 01 e 02 para introduzir comunicação assíncrona e arquitetura orientada a eventos.

Nesta etapa, a aplicação passa a possuir:

- API Gateway;
- Microserviço de usuários;
- Microserviço de pedidos;
- Microserviço de notificações;
- CRUD completo;
- DTOs e validação;
- Comunicação síncrona via TCP;
- Comunicação assíncrona via RabbitMQ;
- Publicação e consumo de eventos;
- ACK e NACK;
- Dead Letter Queue;
- Transactional Outbox;
- Bancos PostgreSQL separados;
- Prisma ORM;
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
                                           │
                                           ▼
                                     OutboxEvent
                                           │
                                           ▼
                                    OutboxPublisher
                                           │
                                           │ RabbitMQ
                                           ▼
                                     RabbitMQ
                                           │
                                           ▼
                                  Notifications Service
```

O **API Gateway** recebe as requisições HTTP e encaminha as operações para os microserviços.

O **Users Service** é responsável pelo domínio de usuários.

O **Orders Service** é responsável pelo domínio de pedidos, consulta o Users Service e persiste os pedidos em seu próprio banco.

O **Notifications Service** recebe eventos através do RabbitMQ e simula o envio de notificações.

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
- Comunicação assíncrona utilizando RabbitMQ;
- Publicação do evento `order.created`;
- Consumo de eventos através de `@EventPattern`;
- Confirmação manual de mensagens com ACK;
- Rejeição de mensagens com NACK;
- Dead Letter Queue;
- Simulação de falhas no processamento de notificações;
- Identificação única de eventos;
- Transactional Outbox;
- Publicação periódica de eventos pendentes;
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
- **@nestjs/schedule**
- **class-validator**
- **class-transformer**
- **Prisma ORM 7**
- **@prisma/adapter-pg**
- **PostgreSQL**
- **pg**
- **RabbitMQ**
- **AMQP**
- **amqplib**
- **amqp-connection-manager**
- **Docker**
- **Docker Compose**
- **RxJS**
- **TCP**
- **Rspack**
- **npm**
- **Git**
- **GitHub**

---

# 4. Arquitetura da Aplicação

A aplicação utiliza uma arquitetura distribuída composta por quatro aplicações NestJS.

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
                          │
                          ▼
                     OutboxEvent
                          │
                          ▼
                   OutboxPublisher
                          │
                          │ AMQP
                          ▼
                     RabbitMQ
                          │
                          ▼
                 Notifications Service
```

Além da comunicação síncrona entre Orders e Users, o projeto também utiliza comunicação assíncrona através do RabbitMQ.

```text
Orders Service
      │
      │ evento order.created
      ▼
RabbitMQ
      │
      ▼
Notifications Service
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
- Persistir dados em `orders_db`;
- Criar eventos na Outbox;
- Publicar eventos pendentes no RabbitMQ.

## Notifications Service

Responsável por:

- Consumir eventos `order.created`;
- Processar notificações;
- Registrar notificações através de logs;
- Confirmar mensagens com ACK;
- Rejeitar mensagens com NACK em caso de falha.

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
│   ├── orders/
│   │   └── src/
│   │       ├── main.ts
│   │       ├── prisma.service.ts
│   │       ├── orders.module.ts
│   │       ├── orders.controller.ts
│   │       ├── orders.service.ts
│   │       └── outbox.publisher.ts
│   │
│   └── notifications/
│       └── src/
│           ├── main.ts
│           ├── notifications.module.ts
│           ├── notifications.controller.ts
│           └── notifications.service.ts
│
├── libs/
│   └── contracts/
│       └── src/
│           ├── index.ts
│           ├── users.dto.ts
│           ├── orders.dto.ts
│           ├── events.ts
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
├── scripts/
│   └── setup-rabbitmq.cjs
│
├── docker-compose.yml
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
- PostgreSQL;
- Docker;
- Docker Compose.

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

## 8.3 Acesse a branch do Tutorial 03

```bash
git switch branch_20261027
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
OrderCreatedEvent
HttpToRpcExceptionFilter
```

Os serviços compartilham contratos e estruturas de comunicação.

Eles não compartilham diretamente suas regras de negócio ou acesso aos bancos de dados.

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

O `transform` permite transformar valores recebidos para os tipos esperados.

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

O Notifications Service não possui banco próprio nesta implementação.

---

# 12. Variáveis de Ambiente

Crie um arquivo `.env` na raiz:

```env
USERS_DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/users_db"

ORDERS_DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/orders_db"

RABBITMQ_URL="amqp://app:app123@localhost:5672"

RABBITMQ_NOTIFICATIONS_QUEUE="notifications_queue"
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

Modelo de pedido:

```prisma
model Order {
  id          Int      @id @default(autoincrement())
  userId      Int
  description String
  total       Decimal  @db.Decimal(10, 2)
  createdAt   DateTime @default(now())
}
```

Modelo da Outbox:

```prisma
model OutboxEvent {
  id          String    @id @default(uuid())
  eventType   String
  payload     Json
  createdAt   DateTime  @default(now())
  publishedAt DateTime?
}
```

O campo `userId` não possui uma relação Prisma direta com `User`, porque o usuário pertence a outro microserviço.

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

Migration inicial:

```bash
npx prisma migrate dev --config prisma/orders.config.ts --name init_orders
```

Migration da Outbox:

```bash
npx prisma migrate dev --config prisma/orders.config.ts --name add_outbox
```

Gerar client:

```bash
npx prisma generate --config prisma/orders.config.ts
```

---

# 16. PrismaService

Cada microserviço que utiliza PostgreSQL possui seu próprio `PrismaService`.

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

A aplicação utiliza comunicação síncrona e assíncrona.

Comunicação síncrona:

```text
Transport.TCP
```

Comunicação assíncrona:

```text
Transport.RMQ
```

Portas utilizadas:

| Aplicação | Porta | Protocolo |
| --- | ---: | --- |
| API Gateway | 3000 | HTTP |
| Users Service | 3001 | TCP |
| Orders Service | 3002 | TCP |
| RabbitMQ | 5672 | AMQP |
| RabbitMQ Management | 15672 | HTTP |

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

Essa operação continua utilizando comunicação síncrona através de TCP.

Depois da validação, o pedido e seu evento são persistidos no banco de Orders.

---

# 21. Request-Response com `send()`

A comunicação síncrona utiliza:

```ts
client.send(...)
```

O emissor envia uma mensagem e aguarda uma resposta.

Exemplo:

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

Quando necessário, o Observable é convertido utilizando:

```ts
firstValueFrom(...)
```

---

# 22. Comunicação Assíncrona com `emit()`

Para eventos, o projeto utiliza:

```ts
client.emit(...)
```

Diferentemente de `send()`, o evento não representa uma solicitação de resposta de negócio.

Fluxo:

```text
Orders
   │
   │ emit('order.created')
   ▼
RabbitMQ
   │
   ▼
Notifications
```

Isso permite que o processamento de notificações fique separado da criação do pedido.

---

# 23. Evento `order.created`

O evento utilizado é:

```text
order.created
```

Contrato compartilhado:

```ts
export interface OrderCreatedEvent {
  eventId: string;
  orderId: number;
  userId: number;
  total: string;
  occurredAt: string;
}
```

Cada evento recebe um identificador único através de:

```ts
randomUUID()
```

Exemplo:

```json
{
  "eventId": "uuid",
  "orderId": 1,
  "userId": 1,
  "total": "4500",
  "occurredAt": "2026-10-27T20:00:00.000Z"
}
```

---

# 24. RabbitMQ

O RabbitMQ é responsável pela mensageria assíncrona.

Ele é executado através do Docker utilizando:

```bash
docker compose up -d
```

Verificação:

```bash
docker compose ps
```

O painel administrativo fica disponível em:

```text
http://localhost:15672
```

Credenciais locais:

```text
Usuário: app
Senha: app123
```

---

# 25. Docker Compose

Arquivo:

```text
docker-compose.yml
```

Configuração:

```yaml
services:
  rabbitmq:
    image: rabbitmq:4-management
    container_name: nest-rabbitmq

    ports:
      - "5672:5672"
      - "15672:15672"

    environment:
      RABBITMQ_DEFAULT_USER: app
      RABBITMQ_DEFAULT_PASS: app123

    volumes:
      - rabbitmq_data:/var/lib/rabbitmq

volumes:
  rabbitmq_data:
```

---

# 26. Notifications Service

O Notifications Service utiliza:

```ts
@EventPattern('order.created')
```

para consumir eventos.

Quando uma mensagem válida é recebida, são registrados logs semelhantes a:

```text
Notificação do pedido 1
Usuário: 1
Total: R$ 4500
Evento: uuid
```

Nesta etapa, o envio de notificações é simulado através de logs.

---

# 27. ACK e NACK

O consumidor utiliza confirmação manual de mensagens.

Configuração:

```ts
noAck: false
```

Quando o processamento termina corretamente:

```ts
channel.ack(message);
```

Fluxo:

```text
Mensagem
   ↓
Notifications
   ↓
Processamento concluído
   ↓
ACK
```

Quando ocorre uma falha:

```ts
channel.nack(
  message,
  false,
  false,
);
```

Fluxo:

```text
Mensagem
   ↓
Notifications
   ↓
Falha
   ↓
NACK
```

---

# 28. Dead Letter Queue

O projeto utiliza:

```text
notifications_queue
notifications_dlq
```

Fluxo:

```text
RabbitMQ
   │
   ▼
notifications_queue
   │
   ▼
Notifications Service
   │
   ├── sucesso ──► ACK
   │
   └── falha ────► NACK
                       │
                       ▼
               notifications_dlq
```

A Dead Letter Queue armazena mensagens rejeitadas pela fila principal.

---

# 29. Configuração da DLQ

O script:

```text
scripts/setup-rabbitmq.cjs
```

configura:

```text
notifications.dlx
notifications_queue
notifications_dlq
notifications.failed
```

Execute:

```bash
node --env-file=.env scripts/setup-rabbitmq.cjs
```

Resultado esperado:

```text
Filas configuradas
```

---

# 30. Teste da Dead Letter Queue

Para testar a DLQ, o Notifications Service simula uma falha quando:

```text
total = 9999
```

Exemplo:

```json
{
  "userId": 1,
  "description": "Teste DLQ",
  "total": 9999
}
```

Fluxo:

```text
POST /orders
     ↓
Order criado
     ↓
OutboxEvent
     ↓
RabbitMQ
     ↓
Notifications
     ↓
Falha simulada
     ↓
NACK
     ↓
notifications_dlq
```

A mensagem pode ser verificada através do painel RabbitMQ.

---

# 31. Transactional Outbox

O padrão Transactional Outbox reduz o risco de inconsistência entre o PostgreSQL e o RabbitMQ.

Sem Outbox:

```text
Salvar pedido
     ↓
Pedido persistido
     ↓
Aplicação falha
     ↓
Evento não publicado
```

Com Outbox:

```text
Prisma Transaction
       │
       ├── Order
       │
       └── OutboxEvent
```

O pedido e o evento são persistidos na mesma transação do banco.

Se a transação falhar:

```text
Order       ❌
OutboxEvent ❌
```

Se a transação for confirmada:

```text
Order       ✅
OutboxEvent ✅
```

---

# 32. OutboxPublisher

O arquivo:

```text
apps/orders/src/outbox.publisher.ts
```

é responsável por procurar eventos ainda não publicados.

O agendamento utiliza:

```ts
@Cron('*/5 * * * * *')
```

Assim, aproximadamente a cada cinco segundos o serviço consulta:

```text
OutboxEvent
```

procurando registros onde:

```text
publishedAt = null
```

Fluxo:

```text
OutboxEvent pendente
       ↓
OutboxPublisher
       ↓
RabbitMQ
       ↓
evento publicado
       ↓
publishedAt atualizado
```

---

# 33. Idempotência

Mensagens podem ser entregues mais de uma vez em arquiteturas distribuídas.

Por isso cada evento possui:

```text
eventId
```

O `eventId` identifica o acontecimento e pode ser utilizado para implementar controle de eventos já processados.

Nesta etapa, o projeto cria o identificador do evento, enquanto uma persistência completa dos eventos processados representa uma evolução adicional da arquitetura.

---

# 34. Retries

O projeto demonstra o conceito de retries, mas não implementa uma estratégia completa de novas tentativas com atraso.

Uma arquitetura possível seria:

```text
notifications_queue
        │
        │ falha
        ▼
notifications_retry
        │
        │ aguarda
        ▼
notifications_queue
        │
        ▼
nova tentativa
```

Uma implementação real deve limitar a quantidade de tentativas para evitar loops infinitos.

---

# 35. API Gateway

O Gateway continua sendo o único ponto HTTP utilizado pelo cliente.

```text
http://localhost:3000
```

O cliente não precisa acessar diretamente:

```text
localhost:3001
localhost:3002
RabbitMQ
Notifications Service
```

A comunicação interna continua sendo responsabilidade das aplicações.

---

# 36. Endpoints de Users

| Método | Endpoint | Descrição |
| --- | --- | --- |
| `POST` | `/users` | Cria um usuário |
| `GET` | `/users` | Lista os usuários |
| `GET` | `/users/:id` | Busca usuário por ID |
| `PATCH` | `/users/:id` | Atualiza usuário |
| `DELETE` | `/users/:id` | Exclui usuário |

---

# 37. Endpoints de Orders

| Método | Endpoint | Descrição |
| --- | --- | --- |
| `POST` | `/orders` | Cria um pedido |
| `GET` | `/orders` | Lista os pedidos |
| `GET` | `/orders/:id` | Busca pedido por ID |
| `GET` | `/orders/user/:userId` | Lista pedidos de um usuário |
| `PATCH` | `/orders/:id` | Atualiza pedido |
| `DELETE` | `/orders/:id` | Exclui pedido |

---

# 38. Exemplos de Requisições

## Criar usuário

```http
POST /users
Content-Type: application/json
```

```json
{
  "name": "Ana",
  "email": "ana.tutorial3@email.com"
}
```

## Criar pedido

```http
POST /orders
Content-Type: application/json
```

```json
{
  "userId": 1,
  "description": "Notebook Dell",
  "total": 4500
}
```

Exemplo de resposta:

```json
{
  "id": 1,
  "userId": 1,
  "description": "Notebook Dell",
  "total": "4500",
  "createdAt": "2026-10-27T20:00:00.000Z"
}
```

Depois da criação, o evento correspondente é armazenado na Outbox e posteriormente publicado no RabbitMQ.

---

# 39. Execução do Projeto

Antes dos serviços, inicie o RabbitMQ:

```bash
docker compose up -d
```

Configure as filas:

```bash
node --env-file=.env scripts/setup-rabbitmq.cjs
```

São necessários quatro terminais para as aplicações NestJS.

## Terminal 1 — Users Service

```bash
npx nest start users --watch
```

## Terminal 2 — Orders Service

```bash
npx nest start orders --watch
```

## Terminal 3 — Notifications Service

```bash
npx nest start notifications --watch
```

## Terminal 4 — API Gateway

```bash
npx nest start api-gateway --watch
```

---

# 40. Build

Para validar o Users Service:

```bash
npx nest build users
```

Para validar o Orders Service:

```bash
npx nest build orders
```

Para validar o Notifications Service:

```bash
npx nest build notifications
```

Para validar o API Gateway:

```bash
npx nest build api-gateway
```

Os quatro projetos devem compilar sem erros antes do envio.

---

# 41. Testes Realizados

Foram testadas as operações HTTP já existentes:

```text
POST   /users
GET    /users
GET    /users/:id
PATCH  /users/:id
DELETE /users/:id

POST   /orders
GET    /orders
GET    /orders/:id
GET    /orders/user/:userId
PATCH  /orders/:id
DELETE /orders/:id
```

Também foram validados:

- Comunicação TCP entre API Gateway e microserviços;
- Comunicação entre Orders e Users;
- Persistência com PostgreSQL;
- Criação de pedidos;
- Criação de eventos na Outbox;
- Execução periódica do OutboxPublisher;
- Publicação de `order.created`;
- Comunicação através do RabbitMQ;
- Consumo de eventos no Notifications Service;
- Logs de notificação;
- ACK em mensagens processadas corretamente;
- NACK em mensagens com falha;
- Funcionamento da Dead Letter Queue;
- Simulação de falha utilizando total `9999`;
- Identificação de eventos através de `eventId`;
- Compilação dos quatro projetos.

---

# 42. Fluxo Completo de Criação de Pedido

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
users_db
   │
   ▼
Usuário válido
   │
   ▼
Orders Service
   │
   ▼
Prisma Transaction
   │
   ├── Order
   └── OutboxEvent
           │
           ▼
      orders_db
           │
           ▼
    OutboxPublisher
           │
           ▼
       RabbitMQ
           │
           │ order.created
           ▼
Notifications Service
           │
           ├── ACK
           │
           └── NACK ──► DLQ
```

---

# 43. Conceitos Estudados

Durante o Tutorial 03 foram trabalhados:

- Microserviços;
- Arquitetura orientada a eventos;
- Comunicação síncrona;
- Comunicação assíncrona;
- TCP;
- RabbitMQ;
- AMQP;
- Docker;
- Docker Compose;
- `ClientProxy.send()`;
- `ClientProxy.emit()`;
- `@MessagePattern`;
- `@EventPattern`;
- Request-response;
- Publicação de eventos;
- Consumo de eventos;
- ACK;
- NACK;
- Dead Letter Queue;
- Filas duráveis;
- `prefetchCount`;
- Eventos identificados por UUID;
- Idempotência;
- Retries;
- Transactional Outbox;
- Prisma Transaction;
- `OutboxEvent`;
- `@nestjs/schedule`;
- `@Cron`;
- OutboxPublisher;
- Comunicação entre microserviços;
- Persistência separada por domínio;
- Tratamento de falhas em sistemas distribuídos.

---

# 44. Limitações da Implementação

O projeto possui finalidade acadêmica e demonstra os principais conceitos da arquitetura.

Em uma aplicação de produção ainda seriam necessárias evoluções como:

- Autenticação;
- Autorização;
- Logs estruturados;
- Métricas;
- Correlation IDs;
- Rastreamento distribuído;
- Retry com limite de tentativas;
- Fila específica de retry;
- Circuit breaker;
- Publisher confirms;
- Controle de concorrência no Outbox;
- Locking ou claim de eventos;
- Persistência completa de eventos processados;
- Idempotência do efeito real da operação;
- Segurança da comunicação interna;
- Monitoramento do RabbitMQ;
- Estratégias avançadas de recuperação de falhas.

O `OutboxPublisher` utilizado é uma implementação didática.

---

# 45. Evolução do Projeto

No Tutorial 01:

```text
API Gateway
     ↓
Users Service
     ↓
PostgreSQL
```

No Tutorial 02:

```text
                   ┌──► Users Service ──► users_db
                   │
API Gateway ───────┤
                   │
                   └──► Orders Service ─► orders_db
                              │
                              └──► Users Service
```

No Tutorial 03:

```text
API Gateway
     │
     ▼
Orders Service
     │
     ├──► Users Service
     │        │
     │        ▼
     │     users_db
     │
     ▼
 orders_db
     │
     ▼
   Outbox
     │
     ▼
RabbitMQ
     │
     ▼
Notifications Service
```

A principal evolução consiste na introdução de comunicação assíncrona baseada em eventos.

---

# 46. Versionamento e Organização das Branches

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

O Tutorial 03 foi desenvolvido na branch:

```text
branch_20261027
```

Cada tutorial evolui a implementação anterior, mantendo o histórico das diferentes etapas estudadas durante a disciplina.

---

# 47. Autor

**Nome:** Matheus Pessoa Telles de Oliveira  
**Unidade Curricular:** Programação Web 2  
**Instituição:** Senac RJ

GitHub:

```text
https://github.com/matheuspessoa14
```

---

# 48. Licença e Uso Acadêmico

Projeto desenvolvido para fins acadêmicos na Unidade Curricular de **Programação Web 2 — Senac RJ**.

O código poderá ser utilizado para avaliação e acompanhamento acadêmico durante o curso.