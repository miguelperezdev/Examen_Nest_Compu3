// TODO Reto 3: reglas de validación con class-validator / class-transformer
//   - programs: arreglo NO vacío de CreateProgramDto
//   - cada elemento se debe validar con las mismas reglas de CreateProgramDto
//     (pista: @ValidateNested({ each: true }) + @Type(() => CreateProgramDto))

import { IsArray, IsNotEmpty, ValidateNested } from "class-validator";
import { Program } from "../entities/program.entity";
import { CreateProgramDto } from "./create-program.dto"; 
import { Type } from "class-transformer";


export class BulkCreateProgramDto {

    @IsArray()
    @IsNotEmpty()
    @ValidateNested({ each: true }) 
    @Type(() => CreateProgramDto) 
    programs: CreateProgramDto[] | undefined



}
