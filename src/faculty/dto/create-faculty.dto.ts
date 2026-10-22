import { IsInt, Matches, Max, Min, MinLength } from 'class-validator';

export class CreateFacultyDto {

    @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
    name: string;

    @Matches(/^[A-Z]{2,4}$/)
    code: string;

    @IsInt()
    @Min(1900)
    @Max(2026)
    foundedYear: number;

}
