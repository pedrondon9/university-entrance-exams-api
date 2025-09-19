const {Schema , model , models} = require("mongoose")
const mongoosePaginate = require("mongoose-paginate-v2")

//PARA AGREGAR EXAMEN
const UploadExamen =  new Schema({
    materia:{type:String,trim:true},//nombre de la materia
    info:{type:Array},//array que contiene los examenes de  las distintas convocatorias de la materia
    userId: { type: Schema.Types.ObjectId, ref: 'user' },
    mes: {type:String,trim:true},
    estado: {type:String,trim:true},
    examenId: { type: Schema.Types.ObjectId, ref: 'examenDatos' },//El id que relacionara el examen con sus comentarios
    face: {type:String,trim:true},
    userName: {type:String,trim:true},
    userPhoto: {type:String,trim:true},
    numComent: {type:Number,trim:true},
    pdfLink: {type:String,trim:true},
    año:{type:String,trim:true},

},{
    timestamps:true // para guardar el tiempo de la creacion y actualizacion
}
);

UploadExamen.plugin(mongoosePaginate)
module.exports = model("uploadExamen" , UploadExamen)


