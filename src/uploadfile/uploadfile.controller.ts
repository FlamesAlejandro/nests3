import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors,
  UploadedFile, } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadfileService } from './uploadfile.service';
import { CreateUploadfileDto } from './dto/create-uploadfile.dto';
import { UpdateUploadfileDto } from './dto/update-uploadfile.dto';
import { CreateFirstfileDto } from './dto/create-firstfile.dto';
import { CreateVersionfileDto } from './dto/create-versionfile.dto';

@Controller('uploadfile')
export class UploadfileController {
  constructor(private readonly uploadfileService: UploadfileService) {}

  @Post()
  create(@Body() createUploadfileDto: CreateUploadfileDto) {
    return this.uploadfileService.create(createUploadfileDto);
  }

  // subir una nuevo archivo
  @Post('uploadnewfile')
  @UseInterceptors(FileInterceptor('file'))
  async uploadnewfile(@UploadedFile() file, @Body() createFirstfileDto: CreateFirstfileDto) {
    return await this.uploadfileService.uploadnewfile(file, createFirstfileDto);
  }

  // subir una nueva version de un archivo
  @Patch()
  @UseInterceptors(FileInterceptor('file'))
  async uploadversion(@UploadedFile() file, @Body() createVersionfileDto: CreateVersionfileDto) {
    return await this.uploadfileService.uploadversion(file, createVersionfileDto);
  }

  @Get()
  findAll() {
    return this.uploadfileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.uploadfileService.findOne(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() createVersionfileDto: CreateVersionfileDto) {
  //   return this.uploadfileService.update(id, createVersionfileDto);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUploadfileDto: UpdateUploadfileDto) {
  //   return this.uploadfileService.update(id, updateUploadfileDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.uploadfileService.remove(+id);
  }
}
