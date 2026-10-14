import { UserRole } from '@exam-planner/shared-types';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UsersEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name!: string;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  email!: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.TEACHER,
  })
  role!: UserRole;

  @Column()
  passwordHash: string;

  // Per i docenti salva gli id dei corsi di laurea che possono pianificare.
  @Column({
    type: 'text',
    array: true,
    default: () => "'{}'",
  })
  managedDegreeProgramIds!: string[];

}
