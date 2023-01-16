import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { Prop } from "@nestjs/mongoose/dist";
import { Document } from "mongoose";

@Schema()
export class Formulario extends Document {

    _id?: string
    @Prop()
    name: string;
    @Prop()
    categoria: string;
    @Prop()
    files?: [];
    // @Prop({
    //     unique: true,
    // })
    // carpeta: string;

}

export class Files extends Document {
    @Prop()
    id?: string;
}

export const FormularioSchema = SchemaFactory.createForClass( Formulario );

