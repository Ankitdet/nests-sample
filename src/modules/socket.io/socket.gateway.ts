import { Logger } from '@nestjs/common'
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/ws',
  pingTimeout: 60000,
  pingInterval: 25000,
})
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server

  private readonly logger: Logger = new Logger('SocketGateway')

  afterInit(server: Server) {
    server.on('connect', () => {
      this.logger.log('Connected!!')
    })
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`)
  }

  handleConnection(client: Socket, ..._args: any[]) {
    this.logger.log(`Client connected: ${client.id}`)
  }

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, text: string): void {
    // this.wss.clients().in(client.id).emit('msgToClient', text);
    this.wss.in(client.id).emit('msgToClient', text)
    // this.wss.emit('msgToClient', text);
    // return { event: 'msgToClient', data: text };
  }
}
