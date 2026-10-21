// TODO Reto 2: reglas de validación con class-validator
//   - studentIds: arreglo NO vacío, cada elemento debe ser un UUID
import { ArrayNotEmpty, IsArray, IsEmail, IsUUID } from "class-validator";
export class AssignStudentsDto {

    @IsArray({ message: 'studentsIds must be an array' })
    @ArrayNotEmpty({ message: 'studentsIds must not be empty' })
    @IsUUID()
    studentsIds: string[];


}
