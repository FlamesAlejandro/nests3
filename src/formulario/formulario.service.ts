import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { CreateFormularioDto } from './dto/create-formulario.dto';
import { UpdateFormularioDto } from './dto/update-formulario.dto';
import { Formulario } from './entities/formulario.entity';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common/exceptions';

@Injectable()
export class FormularioService {

  private defaultLimit: number;

  constructor(
    
    @InjectModel( Formulario.name )
    private readonly formularioModel: Model<Formulario>,

    private readonly configService: ConfigService,

  ) { 
    this.defaultLimit = configService.get<number>('defaultLimit') ;

  }
  
  // Create
  async create(createFormularioDto: CreateFormularioDto) {
    // createFormularioDto.name = createFormularioDto.name.toLowerCase().trim();
    try{
        const formulario = await this.formularioModel.create( createFormularioDto );

        return formulario;
    }
    catch (error)
    {
      this.handleExceptions( error );
    }  
  }

  findAll() {
    return `This action returns all formulario`;
  }

  async findOne(id: string) {    
    let formulario: Formulario;
    if ( !isNaN(+id) ) {
      formulario = await this.formularioModel.findOne({ no: id });
    }
    // MongoID
    if ( !formulario && isValidObjectId( id ) ) {
      formulario = await this.formularioModel.findById( id );
    }
    // Name
    if ( !formulario ) {
      formulario = await this.formularioModel.findOne({ name: id.toLowerCase().trim() })
    }    
    if ( !formulario) 
      throw new NotFoundException(`Register with id, name or no "${ id }" not found`);
    return formulario;
  }

  async update( term: string, updateFormularioDto: UpdateFormularioDto) {

    const formulario = await this.findOne( term );
    if ( updateFormularioDto.name )
      updateFormularioDto.name = updateFormularioDto.name.toLowerCase();
    
    try {
      await formulario.updateOne( updateFormularioDto );
      return { ...formulario.toJSON(), ...updateFormularioDto };
      
    } catch (error) {
      this.handleExceptions( error );
    }
  }

  remove(id: number) {
    return `This action removes a #${id} formulario`;
  }

  private handleExceptions( error: any ) {
    if ( error.code === 11000 ) {
      throw new BadRequestException(`Register exists in db ${ JSON.stringify( error.keyValue ) }`);
    }
    console.log(error);
    throw new InternalServerErrorException(`Can't create new register - Check server logs`);
  }
}
