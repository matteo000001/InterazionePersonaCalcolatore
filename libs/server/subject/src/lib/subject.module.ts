import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogModule } from '@exam-planner/server-catalog';
import { SubjectController } from './subject.controller';
import { SubjectEntity } from './subject.entity';
import { SubjectRepository } from './subject.repository';
import { SubjectService } from './subject.service';

@Module({
  imports: [TypeOrmModule.forFeature([SubjectEntity]), CatalogModule],
  controllers: [SubjectController],
  providers: [SubjectRepository, SubjectService],
  exports: [SubjectRepository, SubjectService],
})
export class SubjectModule {}
