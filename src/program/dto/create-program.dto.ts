// TODO Reto 1: reglas de validación con class-validator
//   - name: string, mínimo 3 caracteres
//   - code: string de 3 a 6 letras MAYÚSCULAS (ej. "SIS", "MED")
//   - credits: entero positivo

import {
    IS_LOWERCASE,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  IsUppercase,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
export class CreateProgramDto {

    @IsString({ message: 'El nombre debe ser una cadena de texto' })
    @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
    name: string;

    @IsString({message: 'La descripción debe ser una cadena de texto' })
    @Matches(/^[A-Z]{3,6}$/)
    code: string;

    @IsInt({ message: 'El número debe ser un entero' })
    @IsPositive()
    credits: number;
    

}
