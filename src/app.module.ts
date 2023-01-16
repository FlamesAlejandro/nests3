import { Module } from '@nestjs/common';
import { FormularioModule } from './formulario/formulario.module';
import { UploadfileModule } from './uploadfile/uploadfile.module';
import { ConfigModule } from '@nestjs/config';
import { EnvConfiguration } from './config/env.config';
import { JoiValidationSchema } from './config/joi.validation';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    
    // config por defecto
    ConfigModule.forRoot({
      load: [ EnvConfiguration ],
      validationSchema: JoiValidationSchema,
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname,'..','public'), 
    }),

    // MongooseModule.forRoot('mongodb://localhost:27017/nest-pokemon'),
    MongooseModule.forRoot( process.env.MONGODB ),
    FormularioModule, 
    UploadfileModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
