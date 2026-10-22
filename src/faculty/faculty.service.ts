import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';

import { Faculty } from './entities/faculty.entity';
import { Program } from '../program/entities/program.entity';
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { AssignProgramsDto } from './dto/assign-programs.dto';
import { PaginationDto } from '../student/dto/pagination.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class FacultyService {
    constructor(
        @InjectRepository(Faculty)
        private readonly facultyRepository: Repository<Faculty>,
        private readonly datasource: DataSource
    ){}

    async create(createFacultyDto: CreateFacultyDto, user: User) {
        const { name, code } = createFacultyDto;

        const existFaculty = await this.facultyRepository.findOne({
            where: [
                { name: name },
                { code: code },
            ],
        });
        if(existFaculty){
            throw new ConflictException(
                'Ya existe una faculty con ese name y code'
            )
        }
        const faculty = this.facultyRepository.create({
            ...createFacultyDto,
            createdBy: user,
        })
        return await this.facultyRepository.save(faculty);
    }

    async findAll(paginationDto: PaginationDto) {
        const { limit, skip } = paginationDto;
        return await this.facultyRepository.find({
            take: limit,
            skip: skip,
            order: { name: 'ASC' },
        });
    }
    async findOne(id: string) {
        const faculty = await this.facultyRepository.findOne({
            where: { id: id },
            relations: { programs: true },
        });
        if(!faculty)
            throw new NotFoundException(`Faculty not found`);
             return faculty;
    }

    async assignPrograms(id: string, assignProgramsDto: AssignProgramsDto) {
        const { programIds } = assignProgramsDto;
        const queryRunner = this.datasource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try{
            const faculty = await queryRunner.manager.findOne(Faculty, {
                where: { id: id },
                relations: { programs: true },
            });
            if(!faculty)
                throw new NotFoundException('Faculty not found');
            const programs = await queryRunner.manager.find(Program, {
                where: { id: In(programIds) },
            });
            if(programs.length !== programIds.length){
                const found = programs.map( program => program.id );
                const missing = programIds.filter( programId => !found.includes(programId) );
                throw new NotFoundException('Programs with not found');
            }
            const actuales = faculty.programs ?? [];
              const idsActuales = actuales.map( program => program.id );
            const nuevos = programs.filter( program => !idsActuales.includes(program.id) );

            faculty.programs = [...actuales, ...nuevos];
             await queryRunner.manager.save(Faculty, faculty);
            await queryRunner.commitTransaction();
            await queryRunner.release();

            return faculty;

            }catch(error){
            await queryRunner.rollbackTransaction();
            await queryRunner.release();
            throw error;
        }
    }
}
