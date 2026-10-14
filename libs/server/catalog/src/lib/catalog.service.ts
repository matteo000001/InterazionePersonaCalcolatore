import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CatalogRepository } from './catalog.repository';
import { CreateCourseYearDto } from './dto/create-course-year.dto';
import { CreateDegreeProgramDto } from './dto/create-degree-program.dto';

@Injectable()
export class CatalogService {
  constructor(private readonly catalogRepository: CatalogRepository) {}

  async getDegreePrograms() {
    const degreePrograms = await this.catalogRepository.getDegreePrograms();
    if (degreePrograms.length === 0) {
      throw new NotFoundException('no degree programs found');
    }
    return degreePrograms;
  }

  async getCourseYears() {
    const courseYears = await this.catalogRepository.getCourseYears();
    if (courseYears.length === 0) {
      throw new NotFoundException('no course years found');
    }
    return courseYears;
  }

  async ensureDegreeProgramExists(degreeProgramId: string) {
    const degreePrograms = await this.getDegreePrograms();
    const found = degreePrograms.some(
      (program) => program.id === degreeProgramId
    );

    if (!found) {
      throw new NotFoundException(
        `Degree program "${degreeProgramId}" does not exist`
      );
    }
  }

  async ensureCourseYearExists(courseYearId: string) {
    const courseYears = await this.getCourseYears();
    const found = courseYears.some((year) => year.id === courseYearId);

    if (!found) {
      throw new NotFoundException(`Course year "${courseYearId}" does not exist`);
    }
  }

  async createDegreeProgram(dto: CreateDegreeProgramDto) {
    const existing = await this.catalogRepository.findDegreeProgramById(dto.id);

    if (existing) {
      throw new ConflictException('degree program id already in use');
    }

    return this.catalogRepository.createDegreeProgram(dto);
  }

  async deleteDegreeProgram(id: string) {
    const deleted = await this.catalogRepository.deleteDegreeProgram(id);

    if (!deleted) {
      throw new NotFoundException(`Degree program "${id}" not found`);
    }

    return { deleted: true };
  }

  async createCourseYear(dto: CreateCourseYearDto) {
    const existing = await this.catalogRepository.findCourseYearById(dto.id);

    if (existing) {
      throw new ConflictException('course year id already in use');
    }

    return this.catalogRepository.createCourseYear(dto);
  }
}
