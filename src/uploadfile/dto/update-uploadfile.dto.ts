import { PartialType } from '@nestjs/mapped-types';
import { CreateUploadfileDto } from './create-uploadfile.dto';

export class UpdateUploadfileDto extends PartialType(CreateUploadfileDto) {}
