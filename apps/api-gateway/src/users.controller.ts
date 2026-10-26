import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';

import {
  ClientProxy,
} from '@nestjs/microservices';

import {
  firstValueFrom,
  timeout,
} from 'rxjs';

import {
  CreateUserDto,
  UpdateUserDto,
} from '@app/contracts';

@Controller('users')
export class UsersController {
  constructor(
    @Inject('USERS_SERVICE')
    private readonly usersClient:
      ClientProxy,

    @Inject('ORDERS_SERVICE')
    private readonly ordersClient:
      ClientProxy,
  ) {}

  @Post()
  create(
    @Body()
    dto: CreateUserDto,
  ) {
    return this.usersClient
      .send(
        'users.create',
        dto,
      )
      .pipe(
        timeout(3000),
      );
  }

  @Get()
  findAll() {
    return this.usersClient
      .send(
        'users.findAll',
        {},
      )
      .pipe(
        timeout(3000),
      );
  }

  @Get(':id')
  findOne(
    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,
  ) {
    return this.usersClient
      .send(
        'users.findOne',
        id,
      )
      .pipe(
        timeout(3000),
      );
  }

  @Patch(':id')
  update(
    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,

    @Body()
    dto: UpdateUserDto,
  ) {
    return this.usersClient
      .send(
        'users.update',
        {
          id,
          data: dto,
        },
      )
      .pipe(
        timeout(3000),
      );
  }

  @Delete(':id')
  async remove(
    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,
  ) {
    // Consulta Orders antes de excluir o usuário.
    const orders =
      await firstValueFrom(
        this.ordersClient
          .send<any[]>(
            'orders.findByUser',
            id,
          )
          .pipe(
            timeout(3000),
          ),
      );

    if (
      orders.length > 0
    ) {
      throw new BadRequestException(
        'Não é possível excluir um usuário que possui pedidos',
      );
    }

    return firstValueFrom(
      this.usersClient
        .send(
          'users.remove',
          id,
        )
        .pipe(
          timeout(3000),
        ),
    );
  }
}