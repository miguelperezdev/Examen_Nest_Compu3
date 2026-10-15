import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ProgramService } from './program.service';
import { Auth } from 'src/user/decorators/auth.decorator';
import { ValidRoles } from 'src/user/enums/valid-roles.enum';
import { CreateProgramDto } from './dto/create-program.dto';
import { PaginationDto } from 'src/student/dto/pagination.dto';

@Controller('program')
export class ProgramController {
  constructor(private readonly programService: ProgramService) {}

  // TODO Reto 1: POST   /api/program               -> crear programa
  // TODO Reto 1: GET    /api/program               -> listar (paginado con PaginationDto)
  // TODO Reto 2: GET    /api/program/:id           -> programa con sus estudiantes
  // TODO Reto 2: PATCH  /api/program/:id/students  -> agregar estudiantes (acumulativo)
  // TODO Reto 3: POST   /api/program/bulk          -> crear programas en lote (todo o nada)
  // TODO Reto 4: proteger los POST y el PATCH para que solo un admin pueda usarlos

  //1

  @Post()
  @Auth(ValidRoles.admin, ValidRoles.teacher)
  create(@Body() createClubDto: CreateProgramDto, @GetUser() user: User) {
    return this.programService.create(CreateProgramDto, user);
  }


  //1

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.programService.findAll(paginationDto); 
  }


  //2

  




}
