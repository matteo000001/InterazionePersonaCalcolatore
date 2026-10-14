import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('subjects')
export class SubjectEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name!: string;

  @Column({ type: 'int', nullable: false })
  teacherId!: number;

  @Column({ type: 'text', array: true, nullable: false, default: () => "'{}'" })
  degreeProgramIds!: string[];

  @Column({ type: 'varchar', length: 255, nullable: false, default: 'year-1' })
  courseYearId!: string;
}
