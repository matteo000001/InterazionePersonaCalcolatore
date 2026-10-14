import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArrayContains, Repository } from 'typeorm';
import { SubjectEntity } from './subject.entity';
import { CreateSubjectDto } from './dto/create.subjects.dto';
import { UpdateSubjectDto } from './dto/update-subjects.dto';

@Injectable()
export class SubjectRepository {
  constructor(
    @InjectRepository(SubjectEntity)
    private readonly repository: Repository<SubjectEntity>
  ) {}

  findAll(filters?: {
    teacherId?: number;
    degreeProgramId?: string;
    courseYearId?: string;
  }): Promise<SubjectEntity[]> {
    if (filters?.teacherId || filters?.degreeProgramId || filters?.courseYearId) {
      return this.repository.find({
        where: {
          ...(filters.teacherId ? { teacherId: filters.teacherId } : {}),
          ...(filters.degreeProgramId
            ? { degreeProgramIds: ArrayContains([filters.degreeProgramId]) }
            : {}),
          ...(filters.courseYearId ? { courseYearId: filters.courseYearId } : {}),
        },
        order: { id: 'ASC' },
      });
    }

    return this.repository.find({
      order: { id: 'ASC' },
    });
  }

  findByTeacherId(teacherId: number): Promise<SubjectEntity[]> {
    return this.repository.find({
      where: { teacherId },
      order: { id: 'ASC' },
    });
  }

  findById(id: number): Promise<SubjectEntity | null> {
    return this.repository.findOne({ where: { id } });
  }

  createOne(dto: CreateSubjectDto, teacherId: number): Promise<SubjectEntity> {
    const subject = this.repository.create({
      name: dto.name.trim(),
      teacherId,
      degreeProgramIds: dto.degreeProgramIds,
      courseYearId: dto.courseYearId,
    });

    return this.repository.save(subject);
  }

  async updateOne(
    id: number,
    dto: UpdateSubjectDto
  ): Promise<SubjectEntity | null> {
    const subject = await this.findById(id);

    if (!subject) {
      return null;
    }

    if (dto.name !== undefined) {
      subject.name = dto.name.trim();
    }

    if (dto.teacherId !== undefined) {
      subject.teacherId = dto.teacherId;
    }

    if (dto.degreeProgramIds !== undefined) {
      subject.degreeProgramIds = dto.degreeProgramIds;
    }

    if (dto.courseYearId !== undefined) {
      subject.courseYearId = dto.courseYearId;
    }

    return this.repository.save(subject);
  }

  async deleteOne(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
