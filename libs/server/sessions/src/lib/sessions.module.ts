import { Module } from '@nestjs/common';
import { SessionsController } from './sessions.controller';
import { SessionsRepository } from './sessions.repository';
import { SessionsService } from './sessions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamSessionEntity } from './exam-session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExamSessionEntity])],
  controllers: [SessionsController],
  providers: [SessionsRepository, SessionsService],
  exports: [SessionsRepository, SessionsService],
})
export class SessionsModule {}
