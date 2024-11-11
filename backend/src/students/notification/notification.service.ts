import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { NotificationGateway } from '../notification/notification.gateway';

@Injectable()
export class NotificationService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => NotificationGateway))
    private readonly notificationGateway: NotificationGateway,
  ) {}

  // Create a notification for a user with duplicate check
  async createNotification(userId: number, title: string, message: string, eventType: string) {
    const user = await this.prisma.users.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error(`User with ID ${userId} does not exist`);
    }

    // Check if a similar notification already exists (same user, event type, and title)
    const existingNotification = await this.prisma.notification.findFirst({
      where: {
        userId,
        title,
        eventType,
        read: false, // Avoid sending duplicate unread notifications
      },
    });

    // If the notification already exists, return it without creating a new one
    if (existingNotification) {
      console.log(`Notification already exists for user ${userId}: ${title}`);
      return existingNotification; // Return the existing notification if found
    }

    // If no existing notification, create a new one
    const notification = await this.prisma.notification.create({
      data: {
        title,
        message,
        userId,
        eventType,
      },
    });

    // Emit the notification via WebSocket (optional)
    this.notificationGateway.sendNotification(userId, title, message, eventType);
    console.log(`Created new notification for user ${userId}: ${title}`);
    return notification;
  }

  // Get all notifications for a specific user
  async getNotificationsForUser(userId: number) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Mark a specific notification as read
  async markNotificationAsRead(notificationId: number) {
    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });
  }

  // Notify all students for a specific event (make sure no duplicates)
  async notifyStudentsForEvent(eventType: string, title: string, message: string, courseId?: number) {
    const studentsToNotify = courseId
      ? await this.prisma.users.findMany({
          where: { courseId: courseId, role: 'student' },
        })
      : await this.prisma.users.findMany({ where: { role: 'student' } });

    const notifiedUserIds = new Set<number>();

    for (const student of studentsToNotify) {
      if (!notifiedUserIds.has(student.id)) {
        await this.createNotification(student.id, title, message, eventType);
        notifiedUserIds.add(student.id);
      }
    }
  }

  // Notify a specific student for a calendar event
  async notifyForCalendarEvent(userId: number, eventTitle: string) {
    const message = `Upcoming event: ${eventTitle}`;
    await this.createNotification(userId, eventTitle, message, 'CalendarEvent');
  }
}

