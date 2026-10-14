import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRole } from '@exam-planner/shared-types';
import { CatalogService } from '@exam-planner/server-catalog';
import { DataSource } from 'typeorm';
import { SubjectRepository } from './subject.repository';
import { CreateSubjectDto } from './dto/create.subjects.dto';
import { UpdateSubjectDto } from './dto/update-subjects.dto';

@Injectable()
export class SubjectService {
  constructor(
    private readonly subjectRepository: SubjectRepository,
    private readonly dataSource: DataSource,
    private readonly catalogService: CatalogService
  ) {}

  list(filters?: {
    teacherId?: number;
    degreeProgramId?: string;
    courseYearId?: string;
  }) {
    return this.subjectRepository.findAll(filters);
  }

  async getById(id: number) {
    const subject = await this.subjectRepository.findById(id);

    if (!subject) {
      throw new NotFoundException(`Subject "${id}" not found`);
    }

    return subject;
  }

  async create(dto: CreateSubjectDto) {
    await this.ensureTeacherCanTeachDegreePrograms(
      dto.teacherId,
      dto.degreeProgramIds
    );
    await this.ensureDegreeProgramsExist(dto.degreeProgramIds);
    await this.catalogService.ensureCourseYearExists(dto.courseYearId);
    return this.subjectRepository.createOne(dto, dto.teacherId);
  }

  async update(id: number, dto: UpdateSubjectDto) {
    const subject = await this.getById(id);
    const teacherId = dto.teacherId ?? subject.teacherId;
    const degreeProgramIds = dto.degreeProgramIds ?? subject.degreeProgramIds;
    const courseYearId = dto.courseYearId ?? subject.courseYearId;

    await this.ensureTeacherCanTeachDegreePrograms(teacherId, degreeProgramIds);
    await this.ensureDegreeProgramsExist(degreeProgramIds);
    await this.catalogService.ensureCourseYearExists(courseYearId);

    const updated = await this.subjectRepository.updateOne(id, dto);

    if (!updated) {
      throw new NotFoundException(`Subject "${id}" not found`);
    }

    return updated;
  }

  async delete(id: number) {
    const deleted = await this.subjectRepository.deleteOne(id);

    if (!deleted) {
      throw new NotFoundException(`Subject "${id}" not found`);
    }

    return { deleted: true };
  }

  private async ensureTeacherCanTeachDegreePrograms(
    teacherId: number,
    degreeProgramIds: string[]
  ) {
    const user = await this.dataSource
      .createQueryBuilder()
      .select('users.role', 'role')
      .addSelect('users."managedDegreeProgramIds"', 'managedDegreeProgramIds')
      .from('users', 'users')
      .where('users.id = :teacherId', { teacherId })
      .getRawOne<{
        role: UserRole;
        managedDegreeProgramIds: string[] | null;
      }>();

    if (!user) {
      throw new NotFoundException(`Teacher "${teacherId}" not found`);
    }

    if (user.role !== UserRole.TEACHER) {
      throw new BadRequestException(
        `User "${teacherId}" exists but is not a teacher`
      );
    }

    for (const degreeProgramId of degreeProgramIds) {
      if (!user.managedDegreeProgramIds?.includes(degreeProgramId)) {
        throw new BadRequestException(
          `Teacher "${teacherId}" does not teach in degree program "${degreeProgramId}"`
        );
      }
    }
  }

  private async ensureDegreeProgramsExist(degreeProgramIds: string[]) {
    for (const degreeProgramId of degreeProgramIds) {
      await this.catalogService.ensureDegreeProgramExists(degreeProgramId);
    }
  }
}
