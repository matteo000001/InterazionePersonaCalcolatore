import { Module } from '@nestjs/common';
import { AppointmentsModule } from '@exam-planner/server-appointments';
import { CatalogModule } from '@exam-planner/server-catalog';
import { SessionsModule } from '@exam-planner/server-sessions';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';

@Module({
  imports: [AppointmentsModule, CatalogModule, SessionsModule],
  controllers: [CalendarController],
  providers: [CalendarService],
  exports: [CalendarService],
})
export class CalendarModule {}
