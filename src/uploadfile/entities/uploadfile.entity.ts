
import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { Prop } from "@nestjs/mongoose/dist";
import { Document } from "mongoose";

@Schema()
export class Uploadfile extends Document {

    _id?: string
    @Prop({
        unique: true, index: true
    })   
    name: string; 
    @Prop() 
    versions?: [];

    @Prop()
    modificationDate?: Date;

}

export class Versions extends Document {
    @Prop({
        unique: true, index: true, auto:true 
    }) 
    _id?: string
    @Prop()
    version?: string;
    @Prop()
    name?:string;
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
