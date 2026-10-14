import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpsertCurrentSessionDto } from './dto/upsert-current-session.dto';
import { ExamSessionEntity } from './exam-session.entity';
import {UpdateCurrentSessionDto} from './dto/updateCurrentSession.dto'
@Injectable()
export class SessionsRepository {
  constructor(
    @InjectRepository(ExamSessionEntity)
    private readonly repository: Repository<ExamSessionEntity>
  ) {}

  findAll(): Promise<ExamSessionEntity[]> {
    return this.repository.find({
      order: { id: 'ASC' },
    });
  }

  createOne(dto: UpsertCurrentSessionDto): Promise<ExamSessionEntity> {
    const session = this.repository.create({
      sessionStart: dto.sessionStart,
      sessionEnd: dto.sessionEnd,
      planningStart: dto.planningStart,
      planningEnd: dto.planningEnd,
      excludedHolidayDates: dto.excludedHolidayDates ?? [],
    });

    return this.repository.save(session);
  }

  async updateOne(
    id: number,
    dto: UpdateCurrentSessionDto
  ): Promise<ExamSessionEntity | null> {
    const session = await this.repository.findOne({ where: { id } });

    if (!session) {
      return null;
    }

    if (dto.sessionStart !== undefined) {
      session.sessionStart = dto.sessionStart;
    }

    if (dto.sessionEnd !== undefined) {
      session.sessionEnd = dto.sessionEnd;
    }

    if (dto.planningStart !== undefined) {
      session.planningStart = dto.planningStart;
    }

    if (dto.planningEnd !== undefined) {
      session.planningEnd = dto.planningEnd;
    }

    if (dto.excludedHolidayDates !== undefined) {
      session.excludedHolidayDates = dto.excludedHolidayDates;
    }

    return this.repository.save(session);
  }
}
