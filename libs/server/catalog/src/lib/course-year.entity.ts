import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('course_years')
export class CourseYearEntity {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  id!: string;

  @Column({ type: 'int', nullable: false })
  year!: number;
}
