import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class VideosGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join-video')
  handleJoinVideo(client: Socket, videoId: string) {
    client.join(`video-${videoId}`);
    return { event: 'joined', room: `video-${videoId}` };
  }

  notifyVideoUpdate(videoId: string, data: any) {
    this.server.to(`video-${videoId}`).emit('video-update', data);
  }
}
