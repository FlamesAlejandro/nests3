import { Module } from '@nestjs/common';
import { FormularioService } from './formulario.service';
import { FormularioController } from './formulario.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Formulario, FormularioSchema } from './entities/formulario.entity';

@Module({
  controllers: [FormularioController],
  providers: [FormularioService],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: Formulario.name,
        schema: FormularioSchema,
      }
    ])
  ],
  exports: [
    MongooseModule
  ]
})
export class FormularioModule {}
