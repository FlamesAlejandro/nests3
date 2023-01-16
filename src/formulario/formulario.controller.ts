import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FormularioService } from './formulario.service';
import { CreateFormularioDto } from './dto/create-formulario.dto';
import { UpdateFormularioDto } from './dto/update-formulario.dto';

@Controller('formulario')
export class FormularioController {
  constructor(private readonly formularioService: FormularioService) {}

  @Post()
  create(@Body() createFormularioDto: CreateFormularioDto) {
    return this.formularioService.create(createFormularioDto);
  }

  @Get()
  findAll() {
    return this.formularioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.formularioService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFormularioDto: UpdateFormularioDto) {
    return this.formularioService.update(id, updateFormularioDto);
  }

  // @Delete(':term')
  // remove(@Param('term') id: string) {
  //   return this.formularioService.remove(+term);
  // }
}
