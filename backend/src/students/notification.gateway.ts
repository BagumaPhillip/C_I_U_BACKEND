// src/issue-report/notification.gateway.ts
import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'https://ciu-exam-management-system-phillip.netlify.app/', // Frontend URL
    methods: ['GET', 'POST'],
  },
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private admins = new Set<string>();  // Track connected admins (using socket IDs)

  handleConnection(client: any) {
    console.log('Admin connected:', client.id);
    client.on('registerAdmin', () => {
      console.log('Admin registered:', client.id);
      this.admins.add(client.id);  // Add connected admin to the set
    });
  }

  handleDisconnect(client: any) {
    console.log('Admin disconnected:', client.id);
    this.admins.delete(client.id);  // Remove admin from the set on disconnect
  }

  // Notify all registered admins
  notifyAdmin(regno: string, issueDescription: string) {
    console.log('Notifying admins about issue:', regno, issueDescription);
    // Emit the notification to all connected admins
    this.admins.forEach((adminId) => {
      this.server.to(adminId).emit('issueReported', { regno, issueDescription });
    });
  }
}
