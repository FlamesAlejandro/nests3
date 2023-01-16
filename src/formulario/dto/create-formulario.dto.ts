import { IsString, MinLength, Min, IsPositive, IsInt, IsArray } from 'class-validator';
import { Type } from 'class-transformer'
import {Files} from '../entities/formulario.entity'

export class CreateFormularioDto {

    @IsString()
    name?: string;

    @IsString()
    categoria?: string;

    

    @IsArray()
    @Type(() => FileDto)
    files?: FileDto[];
    
}

export class FileDto {

    @IsString()
    id?: string;

}
