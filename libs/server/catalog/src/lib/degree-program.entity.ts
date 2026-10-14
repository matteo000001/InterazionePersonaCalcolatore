import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('degree_programs')
export class DegreeProgramEntity {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  id!: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  code!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name!: string;
}
