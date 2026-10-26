import {
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
  timeout,
} from 'rxjs';

import {
  CreateOrderDto,
  UpdateOrderDto,
} from '@app/contracts';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject('ORDERS_SERVICE')
    private readonly client:
      ClientProxy,
  ) {}

  @Post()
  create(
    @Body()
    dto: CreateOrderDto,
  ) {
    return this.client
      .send(
        'orders.create',
        dto,
      )
      .pipe(
        timeout(3000),
      );
  }

  @Get()
  findAll() {
    return this.client
      .send(
        'orders.findAll',
        {},
      )
      .pipe(
        timeout(3000),
      );
  }

  // Esta rota deve ficar antes de /:id.
  @Get('user/:userId')
  findByUser(
    @Param(
      'userId',
      ParseIntPipe,
    )
    userId: number,
  ) {
    return this.client
      .send(
        'orders.findByUser',
        userId,
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
    return this.client
      .send(
        'orders.findOne',
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
    dto: UpdateOrderDto,
  ) {
    return this.client
      .send(
        'orders.update',
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
  remove(
    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,
  ) {
    return this.client
      .send(
        'orders.remove',
        id,
      )
      .pipe(
        timeout(3000),
      );
  }
}