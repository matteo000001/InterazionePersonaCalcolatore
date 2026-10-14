import { Injectable, NotFoundException } from '@nestjs/common';
import { today } from '@exam-planner/shared-utils';
import { UpsertCurrentSessionDto } from './dto/upsert-current-session.dto';
import { ExamSessionEntity } from './exam-session.entity';
import { SessionsRepository } from './sessions.repository';
import { UpdateCurrentSessionDto } from './dto/updateCurrentSession.dto';

@Injectable()
export class SessionsService {
  constructor(private readonly sessionsRepository: SessionsRepository) {}

  async getCurrent(): Promise<ExamSessionEntity> {
    const sessions = await this.sessionsRepository.findAll();
    if (sessions.length === 0) {
      throw new NotFoundException('no current session found');
    }
    return sessions[0];
  }

  async createCurrent(
    session: UpsertCurrentSessionDto
  ): Promise<ExamSessionEntity> {
    return this.sessionsRepository.createOne(session);
  }

  async updateCurrent(dto: UpdateCurrentSessionDto): Promise<ExamSessionEntity> {
    const currentSession = await this.getCurrent();
    const updated = await this.sessionsRepository.updateOne(
      currentSession.id,
      dto
    );

    if (!updated) {
      throw new NotFoundException('Not found to delete');
    }
    return updated;
  }

  async isPlanningOpen(referenceDate = today) {
    const currentSession = await this.getCurrent();
    return (
      referenceDate >= currentSession.planningStart &&
      referenceDate <= currentSession.planningEnd
    );
  }

  async isDateInsideSession(date: string) {
    const currentSession = await this.getCurrent();
    return date >= currentSession.sessionStart && date <= currentSession.sessionEnd;
  }


}
