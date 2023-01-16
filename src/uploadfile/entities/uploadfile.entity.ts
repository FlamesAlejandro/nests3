
import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { Prop } from "@nestjs/mongoose/dist";
import { Document } from "mongoose";

@Schema()
export class Uploadfile extends Document {

    _id?: string
    @Prop({
        unique: true,
    })   
    name: string;
    @Prop()
    url: string;   
    @Prop() 
    versions?: [];

    @Prop()
    modificationDate?: Date;

}

export class Versions extends Document {
    @Prop()
    version?: string;
    @Prop()
    state?: string;  
    @Prop()   
    creationDate?: Date;
    @Prop()
    approvedBy?: string;
    @Prop()
    observation?: string;
}

export const UploadfileSchema = SchemaFactory.createForClass( Uploadfile );
