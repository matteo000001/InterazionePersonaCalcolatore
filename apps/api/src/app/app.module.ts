import { Module } from '@nestjs/common';

import { AppointmentsModule } from '@exam-planner/server-appointments';
import { AuthModule } from '@exam-planner/server-auth';
import { CalendarModule } from '@exam-planner/server-calendar';
import { CatalogModule } from '@exam-planner/server-catalog';
import { SessionsModule } from '@exam-planner/server-sessions';
import { SubjectModule } from '@exam-planner/server-subject';
import { UsersModule } from '@exam-planner/server-users';
import { OrgDatabaseModule } from '@org/database';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    CatalogModule,
    SessionsModule,
    SubjectModule,
    AppointmentsModule,
    CalendarModule,
    OrgDatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService ],
})
export class AppModule {}
