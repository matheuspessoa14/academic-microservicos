import { Controller } from '@nestjs/common';

import {
  MessagePattern,
  Payload,
} from '@nestjs/microservices';

import { OrdersService } from './orders.service';

import {
  CreateOrderDto,
  UpdateOrderDto,
} from '@app/contracts';

@Controller()
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
  ) {}

  @MessagePattern('orders.create')
  create(
    @Payload()
    data: CreateOrderDto,
  ) {
    return this.ordersService.create(data);
  }

  @MessagePattern('orders.findAll')
  findAll() {
    return this.ordersService.findAll();
  }

  @MessagePattern(
    'orders.findByUser',
  )
  findByUser(
    @Payload() userId: number,
  ) {
    return this.ordersService.findByUser(
      userId,
    );
  }

  @MessagePattern('orders.findOne')
  findOne(
    @Payload() id: number,
  ) {
    return this.ordersService.findOne(id);
  }

  @MessagePattern('orders.update')
  update(
    @Payload()
    payload: {
      id: number;
      data: UpdateOrderDto;
    },
  ) {
    return this.ordersService.update(
      payload.id,
      payload.data,
    );
  }

  @MessagePattern('orders.remove')
  remove(
    @Payload() id: number,
  ) {
    return this.ordersService.remove(id);
  }
}