import { Injectable } from '@nestjs/common';
import { CreateUploadfileDto } from './dto/create-uploadfile.dto';
import { UpdateUploadfileDto } from './dto/update-uploadfile.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common/exceptions';
import { Uploadfile, Versions } from './entities/uploadfile.entity';
import * as AWS from 'aws-sdk';
import { ObjectId } from 'mongodb';
import { CreateFirstfileDto } from './dto/create-firstfile.dto';
import { CreateVersionfileDto } from './dto/create-versionfile.dto';


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
        const objectId = new ObjectId();
        const uploadfile = await this.uploadfileModel.create(
          {
            name: createUploadfileDto.name,
            versions: [
              {
                _id: objectId,
                version: createUploadfileDto.versions[0].version,
                state:createUploadfileDto.versions[0].state,
                creationDate:createUploadfileDto.versions[0].creationDate,
                approvedBy:createUploadfileDto.versions[0].approvedBy,
                observation:createUploadfileDto.versions[0].observation
              }
            ],
            modificationDate: createUploadfileDto.modificationDate
          }
        );

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

  // ESTO FUNCIONA, AGREGAR UNA VERSION!

  // async update( term: string, createVersionfileDto: CreateVersionfileDto) {

  //   const objectId = new ObjectId();
  //   const formulario = await this.findOne( term );
  //   const arreglo = 
  //   {
  //     _id: objectId,
  //     version: createVersionfileDto.version,
  //     state: createVersionfileDto.state,
  //     creationDate: createVersionfileDto.creationDate,
  //     approvedBy: createVersionfileDto.approvedBy,
  //     observation: createVersionfileDto.observation,
  //   }
    
  //   try {
  //     await formulario.updateOne(
  //       {        
  //         $push: {
  //           versions: arreglo,
  //         }
  //       }
  //     );
      
  //     return { ...formulario.toJSON(), ...createVersionfileDto };
      
  //   } catch (error) {
  //     this.handleExceptions( error );
  //   }
  //   return `This action up uploadfile`;

  // }

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

  async uploadnewfile(file, createFirstfileDto: CreateFirstfileDto) {
    
    try {
      const objectId = new ObjectId();
      const uploadfile = await this.uploadfileModel.create(
        {
          
          name: createFirstfileDto.name,
          versions: [
            {
              _id: objectId,
              name: file.originalname,
              version: createFirstfileDto.version,
              state:createFirstfileDto.state,
              creationDate:createFirstfileDto.creationDate,
              approvedBy:createFirstfileDto.approvedBy,
              observation:createFirstfileDto.observation
            }
          ],
          modificationDate: createFirstfileDto.modificationDate
        }
      );
      const arr_name = file.originalname.split('.');
      const extension = arr_name.pop();
      const name = arr_name.join('.');
      const folder = uploadfile._id+'/'+objectId;
      const key = folder + '/' + this.slug(name) + '.' + extension;
      return await this.uploadS3(file.buffer, key, file.mimetype);

    }
    catch (error)
    {
      this.handleExceptions( error );
    }  

  }

  async uploadversion(file, createVersionfileDto: CreateVersionfileDto) {
    
    try {
      const objectId = new ObjectId();
      // la ID que trae el formulario es la ID de la carpeta del archivo
      const formulario = await this.findOne( createVersionfileDto._id );
      const arreglo = 
      {
        _id: objectId,
        version: createVersionfileDto.version,
        state: createVersionfileDto.state,
        creationDate: createVersionfileDto.creationDate,
        approvedBy: createVersionfileDto.approvedBy,
        observation: createVersionfileDto.observation,
      }

      await formulario.updateOne(
        {        
          $push: {
            versions: arreglo,
          }
        }
      );


      const arr_name = file.originalname.split('.');
      const extension = arr_name.pop();
      const name = arr_name.join('.');
      const folder = createVersionfileDto._id+'/'+objectId;
      const key = folder + '/' + this.slug(name) + '.' + extension;
      
      
      return await this.uploadS3(file.buffer, key, file.mimetype);

    }
    catch (error)
    {
      this.handleExceptions( error );
    }  

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
