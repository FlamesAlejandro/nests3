import { IsString, MinLength, Min, IsPositive, IsInt, IsArray, IsDate } from 'class-validator';
import { Type } from 'class-transformer'

export class CreateVersionfileDto {
    
    @IsString()
    _id?: string;
    @IsString()
    name?: string;
    @IsDate() 
    modificationDate?: Date;
    @IsString()
    version?: string;
    @IsString()
    state?: string;  
    @IsDate() 
    creationDate?: Date;
    @IsString()
    approvedBy?: string;
    @IsString()
    observation?: string;
}

