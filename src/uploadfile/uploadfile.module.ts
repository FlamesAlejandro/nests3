import { Module } from '@nestjs/common';
import { UploadfileService } from './uploadfile.service';
import { UploadfileController } from './uploadfile.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Uploadfile, UploadfileSchema } from './entities/uploadfile.entity';

@Module({
  controllers: [UploadfileController],
  providers: [UploadfileService],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: Uploadfile.name,
        schema: UploadfileSchema,
      }
    ])
  ],
  exports: [
    MongooseModule
  ]
})
export class UploadfileModule {}
