import {
  BadRequestException,
  Inject,
  Injectable,
} from '@nestjs/common';

import {
  ClientProxy,
} from '@nestjs/microservices';

import {
  firstValueFrom,
  timeout,
} from 'rxjs';

import {
  randomUUID,
} from 'node:crypto';

import {
  PrismaService,
} from './prisma.service';

import {
  CreateOrderDto,
  UpdateOrderDto,
} from '@app/contracts';

import type {
  OrderCreatedEvent,
} from '@app/contracts';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma:
      PrismaService,

    @Inject('USERS_SERVICE')
    private readonly usersClient:
      ClientProxy,
  ) {}

  private async validateUser(
    userId: number,
  ) {
    try {
      const user =
        await firstValueFrom(
          this.usersClient
            .send(
              'users.findOne',
              userId,
            )
            .pipe(
              timeout(3000),
            ),
        );

      if (!user) {
        throw new Error();
      }

      return user;
    } catch {
      throw new BadRequestException(
        'Usuário inválido',
      );
    }
  }

  async create(
    data: CreateOrderDto,
  ) {
    // 1. Valida o usuário
    await this.validateUser(
      data.userId,
    );

    // 2. Pedido e evento são salvos
    // na mesma transação.
    const order =
      await this.prisma.$transaction(
        async (tx) => {
          const createdOrder =
            await tx.order.create({
              data: {
                userId:
                  data.userId,

                description:
                  data.description,

                total:
                  data.total,
              },
            });

          const event:
            OrderCreatedEvent = {
              eventId:
                randomUUID(),

              orderId:
                createdOrder.id,

              userId:
                createdOrder.userId,

              total:
                createdOrder.total
                  .toString(),

              occurredAt:
                new Date()
                  .toISOString(),
            };

          await tx.outboxEvent
            .create({
              data: {
                id:
                  event.eventId,

                eventType:
                  'order.created',

                payload: {
                  ...event,
                },
              },
            });

          return createdOrder;
        },
      );

    return order;
  }

  findAll() {
    return this.prisma
      .order
      .findMany();
  }

  findOne(
    id: number,
  ) {
    return this.prisma
      .order
      .findUnique({
        where: {
          id,
        },
      });
  }

  findByUser(
    userId: number,
  ) {
    return this.prisma
      .order
      .findMany({
        where: {
          userId,
        },
      });
  }

  async update(
    id: number,
    data: UpdateOrderDto,
  ) {
    if (
      data.userId !==
      undefined
    ) {
      await this.validateUser(
        data.userId,
      );
    }

    return this.prisma
      .order
      .update({
        where: {
          id,
        },

        data,
      });
  }

  remove(
    id: number,
  ) {
    return this.prisma
      .order
      .delete({
        where: {
          id,
        },
      });
  }
}