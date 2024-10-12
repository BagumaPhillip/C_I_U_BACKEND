import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LecturesModule } from './lectures/lectures.module';
import { ConfigModule } from '@nestjs/config';
import { StudentsModule } from './students/students.module';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './lectures/auth.module'; 
import { PrismaModule } from '../prisma/prisma.module';
import { CoursesModule } from './lectures/courses.module'; 
import { ChatGateway } from './students/chat/chat.gateway';
import { ChatModule } from './students/chat/chat.module';

@Module({
  imports: [
    ChatModule,
    LecturesModule,
    StudentsModule,
    AuthModule,
    AdminModule,
    PrismaModule,
    CoursesModule, // <-- Add the CoursesModule here
    ConfigModule.forRoot({
      isGlobal: true, // Makes the config globally available
    }),
  ],
  controllers: [AppController],
  providers: [AppService, ChatGateway],
})
export class AppModule {}
