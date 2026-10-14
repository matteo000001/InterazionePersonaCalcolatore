import { Module } from '@nestjs/common';
import { CatalogModule } from '@exam-planner/server-catalog';
import { SessionsModule } from '@exam-planner/server-sessions';
import { SubjectModule } from '@exam-planner/server-subject';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsRepository } from './appointments.repository';
import { AppointmentsService } from './appointments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamAppointmentEntity } from './appointmentExam.entity';
@Module({
  imports: [
    CatalogModule,
    SessionsModule,
    SubjectModule,
    TypeOrmModule.forFeature([ExamAppointmentEntity]),
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsRepository, AppointmentsService],
  exports: [AppointmentsRepository, AppointmentsService],
})
export class AppointmentsModule {}
