// TODO Reto 2: reglas de validación con class-validator
//   - studentIds: arreglo NO vacío, cada elemento debe ser un UUID
import { ArrayNotEmpty, IsArray, IsUUID } from "class-validator";

export class AssignStudentsDto {

    @IsArray({ message: 'studentIds must be an array' })
    @ArrayNotEmpty({ message: 'studentIds must not be empty' })
    @IsUUID('4', { each: true })
    studentIds: string[];

}
