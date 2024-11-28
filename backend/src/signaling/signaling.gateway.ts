// import { WebSocketGateway, SubscribeMessage, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';

// @WebSocketGateway({
//   cors: {
//     origin: 'http://localhost:5173', // Allow connections from your frontend's URL
//     methods: ['GET', 'POST'],
//     allowedHeaders: ['Content-Type'],
//     credentials: true,
//   },
// })
// export class SignalingGateway implements OnGatewayConnection, OnGatewayDisconnect {
//   @WebSocketServer() server: Server;

//   handleConnection(client: Socket) {
//     console.log(`Client connected: ${client.id}`);
//   }

//   handleDisconnect(client: Socket) {
//     console.log(`Client disconnected: ${client.id}`);
//   }

//   @SubscribeMessage('join-room')
//   handleJoinRoom(client: Socket, room: string) {
//     console.log(`Client ${client.id} joining room: ${room}`);
//     client.join(room);
//   }

//   @SubscribeMessage('webrtc-signal')
//   handleSignal(client: Socket, payload: { room: string; signal: any; senderId: string }) {
//     console.log(`Forwarding signal from ${payload.senderId} in room: ${payload.room}`);
//     client.to(payload.room).emit('webrtc-signal', payload);
//   }
// }


import { WebSocketGateway, SubscribeMessage, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'https://ciu-exam-management-system-phillip.netlify.app/', // Adjust for your frontend URL
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  },
})
export class SignalingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(client: Socket, room: string) {
    console.log(`Client ${client.id} joining room: ${room}`);
    client.join(room);
  }

  @SubscribeMessage('webrtc-signal')
  handleSignal(client: Socket, payload: { room: string; signal: any; senderId: string }) {
    console.log(`Forwarding signal from ${payload.senderId} in room: ${payload.room}`);
    client.to(payload.room).emit('webrtc-signal', payload);
  }

  @SubscribeMessage('video-stream')
  handleVideoStream(client: Socket, payload: { room: string, streamData: any }) {
    console.log(`Forwarding video stream from ${client.id} in room: ${payload.room}`);
    client.to(payload.room).emit('video-stream', {
      streamData: payload.streamData,
      senderId: client.id,  // Include sender ID for identification
    });
  }
}

