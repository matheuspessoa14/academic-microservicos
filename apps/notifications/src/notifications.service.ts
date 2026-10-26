import {
  Injectable,
  Logger,
} from '@nestjs/common';

import type {
  OrderCreatedEvent,
} from '@app/contracts';

@Injectable()
export class NotificationsService {
  private readonly logger =
    new Logger(
      NotificationsService.name,
    );

  async sendOrderNotification(
    data: OrderCreatedEvent,
  ) {
    if (data.total === '9999') {
      throw new Error(
        'Falha simulada',
      );
    }

    this.logger.log(
      `Notificação do pedido ${data.orderId}`,
    );

    this.logger.log(
      `Usuário: ${data.userId}`,
    );

    this.logger.log(
      `Total: R$ ${data.total}`,
    );

    this.logger.log(
      `Evento: ${data.eventId}`,
    );

    return {
      success: true,
    };
  }
}