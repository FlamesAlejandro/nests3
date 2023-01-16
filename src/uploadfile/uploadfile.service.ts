import { Injectable } from '@nestjs/common';
import { CreateUploadfileDto } from './dto/create-uploadfile.dto';
import { UpdateUploadfileDto } from './dto/update-uploadfile.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common/exceptions';
import { Uploadfile } from './entities/uploadfile.entity';
import * as AWS from 'aws-sdk';
import { ObjectId } from 'mongodb';


const bucketName='';

AWS.config.update({
  region: '',
  accessKeyId: '',
  secretAccessKey: '',
});
@Injectable()
export class UploadfileService {

  private defaultLimit: number;

  constructor(
    
    @InjectModel( Uploadfile.name )
    private readonly uploadfileModel: Model<Uploadfile>,

    private readonly configService: ConfigService,

  ) { 
    this.defaultLimit = configService.get<number>('defaultLimit');
  }

  async create(createUploadfileDto: CreateUploadfileDto) {
    try{
        const uploadfile = await this.uploadfileModel.create( createUploadfileDto );

        return uploadfile;
    }
    catch (error)
    {
      this.handleExceptions( error );
    }  
  }

  findAll() {
    return `This action returns all uploadfile`;
  }

  async findOne(id: string) {    
    let uploadfile: Uploadfile;
    if ( !isNaN(+id) ) {
      uploadfile = await this.uploadfileModel.findOne({ _id: id });
    }
    // MongoID
    if ( !uploadfile && isValidObjectId( id ) ) {
      uploadfile = await this.uploadfileModel.findById( id );
    }
    // Name
    if ( !uploadfile ) {
      uploadfile = await this.uploadfileModel.findOne({ name: id.toLowerCase().trim() })
    }    
    if ( !uploadfile) 
      throw new NotFoundException(`Register with id, name or no "${ id }" not found`);
    return uploadfile;
  }

  async update( term: string, updateUploadfileDto: UpdateUploadfileDto) {

    const formulario = await this.findOne( term );
    
    try {
      await formulario.updateOne( updateUploadfileDto );
      return { ...formulario.toJSON(), ...updateUploadfileDto };
      
    } catch (error) {
      this.handleExceptions( error );
    }
    return `This action up uploadfile`;

  }

  async uploadversion(file) {
    // asignar nombre de la carpeta

    // id random
    const objectId = new ObjectId();
    const arr_name = file.originalname.split('.');
    const extension = arr_name.pop();
    // nombre
    const name = arr_name.join('.');
    // version
    const version = 1;
    const folder = objectId+':'+this.slug(name);
    
    const key = folder + '/' + this.slug(name) + ':' + version + '.' + extension;
    // para guardar en una bdd
    const data = {
      _id: objectId,
      name: name,
      file_name: String(file.originalname),
      mime_type: file.mimetype,
      size: file.size,
      key: key,
    };
    return await this.uploadS3(file.buffer, key, file.mimetype);
    // return await this.mediaRepository.create(data);
  }

  private async uploadS3(file_buffer, key, content_type) {
    const s3 = new AWS.S3();
    const params = {
      Bucket: bucketName,
      Key: key,
      Body: file_buffer,
      ContentType: content_type,
      // ACL: 'public-read', // comment if private file
    };
    return new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if (err) {
          reject(err.message);
        }
        resolve(data);
      });
    });
  }

  remove(id: number) {
    return `This action removes a #${id} uploadfile`;
  }

  private handleExceptions( error: any ) {
    if ( error.code === 11000 ) {
      throw new BadRequestException(`Register exists in db ${ JSON.stringify( error.keyValue ) }`);
    }
    console.log(error);
    throw new InternalServerErrorException(`Can't create new register - Check server logs`);
  }

  private slug(str) {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    const from =
      'ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆĞÍÌÎÏİŇÑÓÖÒÔÕØŘŔŠŞŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇğíìîïıňñóöòôõøðřŕšşťúůüùûýÿžþÞĐđßÆa·/_,:;';
    const to =
      'AAAAAACCCDEEEEEEEEGIIIIINNOOOOOORRSSTUUUUUYYZaaaaaacccdeeeeeeeegiiiiinnooooooorrsstuuuuuyyzbBDdBAa------';
    for (let i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str
      .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
      .replace(/\s+/g, '-') // collapse whitespace and replace by -
      .replace(/-+/g, '-'); // collapse dashes

    return str;
  }
}
