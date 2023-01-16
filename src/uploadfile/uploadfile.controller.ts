import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors,
  UploadedFile, } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadfileService } from './uploadfile.service';
import { CreateUploadfileDto } from './dto/create-uploadfile.dto';
import { UpdateUploadfileDto } from './dto/update-uploadfile.dto';

@Controller('uploadfile')
export class UploadfileController {
  constructor(private readonly uploadfileService: UploadfileService) {}

  @Post()
  create(@Body() createUploadfileDto: CreateUploadfileDto) {
    return this.uploadfileService.create(createUploadfileDto);
  }

  // subir una nueva version de un archivo
  @Post('uploadversion')
  @UseInterceptors(FileInterceptor('file'))
  async uploadversion(@UploadedFile() file) {
    return await this.uploadfileService.uploadversion(file);
  }

  @Get()
  findAll() {
    return this.uploadfileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.uploadfileService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUploadfileDto: UpdateUploadfileDto) {
    return this.uploadfileService.update(id, updateUploadfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.uploadfileService.remove(+id);
  }
}
