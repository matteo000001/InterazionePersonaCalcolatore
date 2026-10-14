import { Module } from '@nestjs/common';
import { CatalogController } from './catalog.controller';
import { CatalogRepository } from './catalog.repository';
import { CatalogService } from './catalog.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DegreeProgramEntity } from './degree-program.entity';
import { CourseYearEntity } from './course-year.entity';
@Module({
  imports: [TypeOrmModule.forFeature([DegreeProgramEntity, CourseYearEntity ])],
  controllers: [CatalogController],
  providers: [CatalogRepository, CatalogService],
  exports: [CatalogRepository, CatalogService],
})
export class CatalogModule {}
