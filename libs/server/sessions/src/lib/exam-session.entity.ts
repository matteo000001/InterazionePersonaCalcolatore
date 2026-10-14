import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('exam_sessions')
export class ExamSessionEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  sessionStart!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  sessionEnd!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  planningStart!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  planningEnd!: string;

  @Column({
    type: 'text',
    array: true,
    default: () => "'{}'",
  })
  excludedHolidayDates!: string[];
}
