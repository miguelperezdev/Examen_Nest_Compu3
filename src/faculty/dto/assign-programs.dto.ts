import { ArrayNotEmpty, IsArray, IsUUID } from "class-validator";

export class AssignProgramsDto {

    @IsArray()
    @ArrayNotEmpty()
    @IsUUID('4', { each: true })
    programIds: string[];

}
