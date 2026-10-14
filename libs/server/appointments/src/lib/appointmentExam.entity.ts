
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SubjectEntity } from '@exam-planner/server-subject';
import { UsersEntity } from '@exam-planner/server-users';

@Entity('exam_appointments')
export class ExamAppointmentEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'int', nullable: false })
  teacherId!: number;

  @ManyToOne(() => UsersEntity, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'teacherId' })
  teacher!: UsersEntity;

  @Column({ type: 'int', nullable: false })
  subjectId!: number;

  @ManyToOne(() => SubjectEntity, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'subjectId' })
  subject!: SubjectEntity;

  @Column({ type: 'varchar', length: 255, nullable: false })
  degreeProgramId!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  courseYearId!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  examDate!: string;

  @Column({ type: 'varchar', length: 250, nullable: true })
  notes?: string;
 
}
