import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class QueueNumberGateway {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('join-queue-number')
  handleJoinQueue(
    @MessageBody() queueId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`queue-number:${queueId}`);
    return {
      status: 'joined',
      room: `queue-number:${queueId}`,
    };
  }

  sendQueueNumber(queueId: string, data: any) {
    this.server
      .to(`queue-number:${queueId}`)
      .emit(`queue-update-${queueId}`, data);
  }
}
