import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacultyService } from './faculty.service';
import { FacultyController } from './faculty.controller';
import { Faculty } from './entities/faculty.entity';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [FacultyController],
  imports: [TypeOrmModule.forFeature([Faculty]), UserModule],
  providers: [FacultyService],
})
export class FacultyModule {}
