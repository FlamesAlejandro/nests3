import { IsString, MinLength, Min, IsPositive, IsInt, IsArray, IsDate } from 'class-validator';
import { Type } from 'class-transformer'

export class CreateUploadfileDto {
    
    @IsString()
    name?: string;

    @IsArray()
    @Type(() => VersionsDto)
    versions?: VersionsDto[];

    @IsDate() 
    modificationDate?: Date;
}

export class VersionsDto {
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

