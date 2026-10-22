// TODO Reto 1: reglas de validación con class-validator
//   - name: string, mínimo 3 caracteres
//   - code: string de 3 a 6 letras MAYÚSCULAS (ej. "SIS", "MED")
//   - credits: entero positivo

import {
  IsInt,
  IsPositive,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
export class CreateProgramDto {

    @IsString({ message: 'El nombre debe ser una cadena de texto' })
    @MinLength(3)
    name: string;

    @IsString({ message: 'El código debe ser una cadena de texto' })
    @Matches(/^[A-Z]{3,6}$/)
    code: string;

    @IsInt({ message: 'Los créditos deben ser un número entero' })
    @IsPositive()
    credits: number;

}
