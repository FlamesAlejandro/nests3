import { IsString, MinLength, Min, IsPositive, IsInt, IsArray, IsDate } from 'class-validator';
import { Type } from 'class-transformer'

export class CreateUploadfileDto {
    
    @IsString()
    nombre?: string;
    @IsString()
    url?: string;   

    @IsArray()
    @Type(() => VersionsDto)
    versions?: VersionsDto[];

    @IsDate() 
    fechaEdicion?: Date;
}

export class VersionsDto {
    @IsString()
    version?: string;
    @IsString()
    estado?: string;  
    @IsDate() 
    fechaCreacion?: Date;
    @IsString()
    approvedBy?: string;
    @IsString()
    observaciones?: string;
}

