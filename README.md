# Academic Microservices — NestJS, TCP, Prisma e PostgreSQL

Projeto desenvolvido durante a Unidade Curricular de **Programação Web 2 — Senac RJ**, utilizando **NestJS, TypeScript, Microserviços, TCP, Prisma ORM e PostgreSQL**.

---

# 1. Descrição

Este projeto introduz uma arquitetura baseada em **microserviços**, separando a aplicação em dois serviços independentes:

```text
Cliente HTTP
    │
    ▼
┌──────────────┐
│ API Gateway  │
│   NestJS     │
└──────┬───────┘
       │ TCP
       ▼
┌──────────────┐
│ Users Service│
│ NestJS       │
│   + Prisma   │
└──────┬───────┘
       │
       ▼
   PostgreSQL
```

O **API Gateway** recebe as requisições HTTP dos clientes.

O **Users Microservice** é responsável pelas regras relacionadas aos usuários e pela persistência dos dados.

A comunicação entre os dois serviços é realizada através do transporte **TCP nativo do NestJS**.

A aplicação utiliza o **Prisma ORM** para comunicação com o banco de dados **PostgreSQL**.

---

# 2. Funcionalidades

O projeto possui as seguintes funcionalidades:

- API Gateway responsável pelas requisições HTTP;
- Users Service executado como microserviço independente;
- Comunicação entre serviços utilizando TCP;
- Utilização de `ClientProxy`;
- Utilização de `@MessagePattern`;
- Consulta de todos os usuários;
- Consulta de usuário por ID;
- Persistência dos usuários em PostgreSQL;
- Integração com Prisma ORM;
- Separação entre acesso HTTP e regras de negócio;
- Separação da responsabilidade de persistência;
- Execução independente do API Gateway e do Users Service.

---

# 3. Tecnologias Utilizadas

- **Node.js**
- **NestJS**
- **TypeScript**
- **@nestjs/microservices**
- **Prisma ORM 7**
- **PostgreSQL**
- **TCP**
- **Rspack**
- **npm**
- **Git**
- **GitHub**

---

# 4. Arquitetura e Organização do Projeto

A aplicação utiliza uma arquitetura distribuída composta por dois serviços.

```text
Cliente
   │
   │ HTTP
   ▼
API Gateway
   │
   │ ClientProxy
   │ TCP
   ▼
Users Microservice
   │
   │ @MessagePattern
   ▼
UsersService
   │
   ▼
PrismaService
   │
   ▼
Prisma ORM
   │
   ▼
PostgreSQL
```

Responsabilidades:

- `API Gateway` — recebe as requisições HTTP;
- `ClientProxy` — envia mensagens ao microserviço;
- `Users Microservice` — recebe mensagens TCP;
- `UsersController` — utiliza `@MessagePattern` para tratar mensagens;
- `UsersService` — contém a lógica relacionada aos usuários;
- `PrismaService` — disponibiliza o Prisma Client para a aplicação;
- `PostgreSQL` — realiza a persistência dos dados.

---

# 5. Estrutura do Projeto

A aplicação utiliza o modelo de **monorepo do NestJS**.

```text
academic-microservicos/
├── apps/
│   ├── api-gateway/
│   │   └── src/
│   │       ├── app.module.ts
│   │       ├── main.ts
│   │       └── users.controller.ts
│   │
│   └── users/
│       └── src/
│           ├── generated/
│           │   └── prisma/
│           ├── main.ts
│           ├── prisma.service.ts
│           ├── users.controller.ts
│           ├── users.module.ts
│           └── users.service.ts
│
├── prisma/
│   ├── migrations/
│   └── schema.prisma
│
├── .env
├── nest-cli.json
├── package.json
├── package-lock.json
└── tsconfig.json
```

---

# 6. Pré-requisitos

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

# 7. Instalação

## 7.1 Clone o repositório

```bash
git clone https://github.com/matheuspessoa14/academic-microservicos.git
```

## 7.2 Acesse o projeto

```bash
cd academic-microservicos
```

## 7.3 Acesse a branch da atividade

```bash
git switch branch_20261006
```

## 7.4 Instale as dependências

```bash
npm install
```

---

# 8. Configuração do PostgreSQL

O projeto utiliza PostgreSQL para persistência dos usuários.

Acesse o PostgreSQL:

```bash
psql -U postgres
```

Crie o banco:

```sql
CREATE DATABASE microservices_users;
```

Saia do PostgreSQL:

```sql
\q
```

---

# 9. Configuração das Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto.

Exemplo:

```env
DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/microservices_users"
```

Substitua:

```text
SUA_SENHA
```

pela senha configurada no PostgreSQL.

O arquivo `.env` contém informações específicas do ambiente e não deve ser enviado para o GitHub.

Ele deve permanecer no `.gitignore`.

```gitignore
.env
```

---

# 10. Prisma ORM

O Prisma é responsável pela comunicação entre o **Users Service** e o PostgreSQL.

O modelo utilizado é:

```prisma
model User {
  id   Int    @id @default(autoincrement())
  name String
}
```

Arquitetura:

```text
UsersService
     ↓
PrismaService
     ↓
Prisma Client
     ↓
PostgreSQL
```

O API Gateway não acessa diretamente o banco.

```text
              ❌ Evitar

API Gateway ──────────► PostgreSQL
     │
     └────► Users Service
```

A arquitetura utilizada é:

```text
              ✓ Utilizado

API Gateway
     ↓
Users Service
     ↓
Prisma
     ↓
PostgreSQL
```

---

# 11. Gerando o Prisma Client

Após configurar o banco e o arquivo `.env`, execute:

```bash
npx prisma generate
```

O Prisma Client será gerado em:

```text
apps/users/src/generated/prisma
```

---

# 12. Migrations

Para criar e aplicar a migration inicial:

```bash
npx prisma migrate dev --name init
```

As migrations ficam armazenadas em:

```text
prisma/migrations/
```

Para verificar o status:

```bash
npx prisma migrate status
```

---

# 13. Dados de Teste

Durante o desenvolvimento foram utilizados usuários para testar a persistência.

Exemplo:

```sql
INSERT INTO "User" (name)
VALUES
  ('Ana'),
  ('Matheus');
```

Consulta:

```sql
SELECT * FROM "User";
```

Exemplo de resultado:

```text
id | name
---+---------
1  | Ana
2  | Matheus
```

---

# 14. Users Microservice

O Users Service utiliza:

```ts
NestFactory.createMicroservice(...)
```

com transporte TCP.

Exemplo:

```ts
const app = await NestFactory.createMicroservice(UsersModule, {
  transport: Transport.TCP,
  options: {
    host: 'localhost',
    port: 3001,
  },
});
```

O microserviço fica aguardando mensagens na porta:

```text
3001
```

Essa porta utiliza **TCP**, e não HTTP.

---

# 15. MessagePattern

Diferentemente de uma API REST tradicional, o Users Microservice não utiliza `@Get()` para receber as requisições provenientes do Gateway.

Ele utiliza:

```ts
@MessagePattern('users.findAll')
```

e:

```ts
@MessagePattern('users.findOne')
```

Comparação:

```text
REST                         Microservice

@Get('/users')               @MessagePattern('users.findAll')
       │                                  │
       ▼                                  ▼
Requisição HTTP                     Mensagem TCP
```

---

# 16. API Gateway

O API Gateway é responsável por receber requisições HTTP.

Ele utiliza:

```ts
NestFactory.create(...)
```

e roda na porta:

```text
3000
```

O Gateway possui um cliente TCP registrado através do:

```text
ClientsModule
```

O serviço é identificado como:

```text
USERS_SERVICE
```

e se conecta ao microserviço através de:

```text
localhost:3001
```

---

# 17. Comunicação HTTP → TCP

Quando o cliente executa:

```http
GET /users
```

o API Gateway executa:

```ts
this.usersClient.send(
  'users.findAll',
  {},
);
```

O Users Microservice captura a mensagem através de:

```ts
@MessagePattern('users.findAll')
```

Fluxo completo:

```text
GET /users
    │
    ▼
API Gateway
    │
    │ ClientProxy.send()
    ▼
TCP
    │
    ▼
Users Microservice
    │
    │ @MessagePattern()
    ▼
UsersService
    │
    ▼
Prisma
    │
    ▼
PostgreSQL
    │
    ▼
Resultado
    │
    ▼
API Gateway
    │
    ▼
HTTP Response
```

---

# 18. Endpoints

| Método | Endpoint | Descrição |
| --- | --- | --- |
| `GET` | `/users` | Lista todos os usuários |
| `GET` | `/users/:id` | Busca um usuário pelo ID |

---

# 19. Exemplos de Requisição e Resposta

## Listar usuários

```http
GET /users
```

Exemplo de resposta:

```json
[
  {
    "id": 1,
    "name": "Ana"
  },
  {
    "id": 2,
    "name": "Matheus"
  }
]
```

## Buscar usuário por ID

```http
GET /users/1
```

Exemplo:

```json
{
  "id": 1,
  "name": "Ana"
}
```

---

# 20. Execução do Projeto

Como existem duas aplicações independentes, são necessários dois terminais.

## Terminal 1 — Users Microservice

```bash
npx nest start users --watch
```

O serviço utiliza:

```text
localhost:3001
```

através de TCP.

## Terminal 2 — API Gateway

```bash
npx nest start api-gateway --watch
```

O Gateway estará disponível em:

```text
http://localhost:3000
```

---

# 21. Build

Para verificar a compilação do Users Service:

```bash
npx nest build users
```

Para verificar a compilação do API Gateway:

```bash
npx nest build api-gateway
```

Os dois serviços devem compilar sem erros antes do envio da atividade.

---

# 22. Testes Realizados

Foram realizados testes de comunicação entre os serviços e acesso ao banco de dados.

Foram testados:

```text
GET /users
GET /users/1
GET /users/2
```

Também foram verificados:

```text
API Gateway → HTTP
API Gateway → ClientProxy
ClientProxy → TCP
TCP → Users Microservice
UsersController → @MessagePattern
UsersService → Prisma
Prisma → PostgreSQL
```

Além dos testes HTTP, foram realizados os builds:

```bash
npx nest build users
```

```bash
npx nest build api-gateway
```

---

# 23. Conceitos Estudados

Nesta atividade foram estudados:

- Arquitetura de microserviços;
- Monorepo NestJS;
- Separação entre aplicações;
- API Gateway;
- Comunicação entre serviços;
- Transporte TCP;
- `ClientsModule`;
- `ClientProxy`;
- `@MessagePattern`;
- Comunicação HTTP → TCP;
- Serviços independentes;
- Prisma ORM;
- PostgreSQL;
- Persistência de dados;
- Database per Service;
- Separação de responsabilidades.

---

# 24. Arquitetura Antes e Depois

Em uma aplicação tradicional:

```text
Controller
    ↓
Service
    ↓
Prisma
    ↓
PostgreSQL
```

Na arquitetura implementada:

```text
HTTP Controller
      ↓
API Gateway
      ↓
ClientProxy
      ↓
TCP
      ↓
@MessagePattern
      ↓
UsersService
      ↓
Prisma
      ↓
PostgreSQL
```

A principal diferença é que o Gateway e o serviço de usuários são executados como **processos/aplicações independentes**.

---

# 25. Versionamento e Organização das Branches

O projeto utiliza Git e GitHub para controle de versão.

Repositório:

```text
https://github.com/matheuspessoa14/academic-microservicos
```

A atividade do **Microserviços — Tutorial 01** foi desenvolvida na branch:

```text
branch_20261006
```

A branch `main` mantém o projeto-base, enquanto as branches das aulas são utilizadas para separar as implementações desenvolvidas durante a disciplina.

---

# 26. Autor

**Nome:** Matheus Pessoa Telles de Oliveira  
**Unidade Curricular:** Programação Web 2  
**Instituição:** Senac RJ

GitHub:

```text
https://github.com/matheuspessoa14
```

---

# 27. Licença e Uso Acadêmico

Projeto desenvolvido para fins acadêmicos na Unidade Curricular de **Programação Web 2 — Senac RJ**.

O código poderá ser utilizado para avaliação e acompanhamento acadêmico durante o curso.