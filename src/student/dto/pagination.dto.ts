import { Type } from "class-transformer";
import { IsInt, IsOptional, IsPositive, Min } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class PaginationDto{
    @ApiPropertyOptional({ example: 10, description: "Max number of students to return", minimum: 1 })
    @IsOptional()
    @IsPositive()
    @Type(()=> Number)
    limit:number;

    @ApiPropertyOptional({ example: 0, description: "Number of students to skip", minimum: 0 })
    @IsOptional()
    @IsInt()
    @Type(()=> Number)
    @Min(0)
    skip:number;
}
