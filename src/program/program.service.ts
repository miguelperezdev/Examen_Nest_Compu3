import { ConflictException, Injectable } from '@nestjs/common';
import { PaginationDto } from 'src/student/dto/pagination.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Program } from './entities/program.entity';
import { CreateProgramDto } from './dto/create-program.dto';
import { User } from '../user/entities/user.entity';
import { throwError } from 'rxjs';

@Injectable()
export class ProgramService {
    constructor(
       @InjectRepository(Program)
       private readonly programRepository: Repository<Program>,
    ){}

    // TODO Reto 1: inyecta el repositorio de Program (y lo que necesites para las transacciones)


    // TODO Reto 1: create(createProgramDto, user) -> guarda el programa
    //   - nombre o código repetido -> 409 Conflict (no 500)

    async create(createProgramDto: CreateProgramDto, user: User) {
      const program = this.programRepository.create({
        ...createProgramDto,
        createdBy:user,
      })

      const existProgram = await this.programRepository.findOne({
        where: [
          {name: createProgramDto.name},
          {code: createProgramDto.code},
        ],
      });

      if (existProgram){
        throw new ConflictException(
          'Ya existe un programa con ese name y code'
        )
      }
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
  }

    // TODO Reto 2: findOne(id) -> programa con sus estudiantes, 404 si no existe

    // TODO Reto 2: assignStudents(id, assignStudentsDto) -> AGREGA estudiantes al programa
    //   dentro de una transacción (QueryRunner), conservando los que ya tenía.
    //   Mismo patrón del update de estudiantes corregido en clase (combinar las notas):
    //   traer los actuales -> combinar con los nuevos -> guardar la lista completa.
    //   Si algún id no existe: 404 y rollback.

    // TODO Reto 3: bulkCreate(bulkCreateProgramDto, user) -> crea todos los programas o ninguno
    //   (transacción). Cualquier nombre/código repetido -> 409 y rollback.

