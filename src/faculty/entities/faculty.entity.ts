// id (UUID generado), name (texto, único), code (texto, único, 2 a 4 letras mayúsculas),
// foundedYear (entero), createdBy ( @ManyToOne(() => User) ).
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Program } from '../../program/entities/program.entity';
import { User } from '../../user/entities/user.entity';

@Entity('faculty')
export class Faculty {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: 'text', unique: true })
    name: string;

    @Column({ type: 'text', unique: true })
    code: string;

    @Column({ type: 'int' })
    foundedYear: number;

    @OneToMany(() => Program, (program) => program.faculty)
    programs?: Program[];

    @ManyToOne(() => User, { eager: true, nullable: true })
    createdBy?: User;

}
