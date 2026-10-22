import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { FacultyService } from './faculty.service';
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { AssignProgramsDto } from './dto/assign-programs.dto';
import { PaginationDto } from '../student/dto/pagination.dto';
import { Auth } from '../user/decorators/auth.decorator';
import { ValidRoles } from '../user/enums/valid-roles.enum';
import { GetUser } from '../user/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';

@Controller('faculty')
export class FacultyController {
  constructor(private readonly facultyService: FacultyService) {}

  @Post()
  @Auth(ValidRoles.admin)
  create(@Body() createFacultyDto: CreateFacultyDto, @GetUser() user: User) {
    return this.facultyService.create(createFacultyDto, user);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.facultyService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.facultyService.findOne(id);
  }

  @Patch(':id/programs')
  @Auth(ValidRoles.admin)
  assignPrograms(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() assignProgramsDto: AssignProgramsDto,
  ) {
    return this.facultyService.assignPrograms(id, assignProgramsDto);
  }
}
