import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PaginationDto } from '../student/dto/pagination.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';

import { Program } from './entities/program.entity';
import { CreateProgramDto } from './dto/create-program.dto';
import { AssignStudentsDto } from './dto/assign-students.dto';
import { Student } from '../student/entities/student.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class ProgramService {
    constructor(
       @InjectRepository(Program)
       private readonly programRepository: Repository<Program>,
       private readonly datasource: DataSource
    ){}

    // TODO Reto 1: inyecta el repositorio de Program (y lo que necesites para las transacciones)


    // TODO Reto 1: create(createProgramDto, user) -> guarda el programa
    //   - nombre o código repetido -> 409 Conflict (no 500)

    async create(createProgramDto: CreateProgramDto, user: User) {
      const { name, code } = createProgramDto;

      const existProgram = await this.programRepository.findOne({
        where: [
          {name: name},
          {code: code},
        ],
      });

      if (existProgram){
        throw new ConflictException(
          'Ya existe un programa con ese name y code'
        )
      }

      const program = this.programRepository.create({
        ...createProgramDto,
        createdBy:user,
      })

      return await this.programRepository.save(program);
    }

    // TODO Reto 1: findAll(paginationDto) -> lista paginada (limit / skip)

    async findAll(paginationDto: PaginationDto) {
      const { limit, skip } = paginationDto;
      const programs = await this.programRepository.find({
        take: limit,
        skip: skip,
        order: { name: 'ASC' },
      });

    return programs;
    }

    // TODO Reto 2: findOne(id) -> programa con sus estudiantes, 404 si no existe

    async findOne(id: string) {
      const program = await this.programRepository.findOne({
        where: { id: id },
        relations: { students: true },
      });

      if(!program)
        throw new NotFoundException('Program not found');

      return program;
    }

    // TODO Reto 2: assignStudents(id, assignStudentsDto) -> AGREGA estudiantes al programa
    //   dentro de una transacción (QueryRunner), conservando los que ya tenía.
    //   Mismo patrón del update de estudiantes corregido en clase (combinar las notas):
    //   traer los actuales -> combinar con los nuevos -> guardar la lista completa.
    //   Si algún id no existe: 404 y rollback.

    async assignStudents(id: string, assignStudentsDto: AssignStudentsDto) {
      const { studentIds } = assignStudentsDto;

      const queryRunner = this.datasource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try{
        const program = await queryRunner.manager.findOne(Program, {
          where: { id: id },
          relations: { students: true },
        });

        if(!program)
          throw new NotFoundException(`Program not found`);

        const students = await queryRunner.manager.find(Student, {
          where: { id: In(studentIds) },
        });

        if(students.length !== studentIds.length){
          const found = students.map( student => student.id );
          const missing = studentIds.filter( studentId => !found.includes(studentId) );
          throw new NotFoundException(`Students with this ids not found`);
        }

        const actuales = program.students ?? [];
        const idsActuales = actuales.map( student => student.id );
        const nuevos = students.filter( student => !idsActuales.includes(student.id) );

        program.students = [...actuales, ...nuevos];

        await queryRunner.manager.save(program);
        await queryRunner.commitTransaction();
        await queryRunner.release();

        return program;

      }catch(error){
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
        throw error;
      }
    }

    // TODO Reto 3: bulkCreate(bulkCreateProgramDto, user) -> crea todos los programas o ninguno
    //   (transacción). Cualquier nombre/código repetido -> 409 y rollback.
}
