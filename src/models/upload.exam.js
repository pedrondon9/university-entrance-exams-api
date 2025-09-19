const {Schema , model , models} = require("mongoose")
const mongoosePaginate = require("mongoose-paginate-v2")

//PARA AGREGAR EXAMEN
const UploadExamen =  new Schema({
    materia:{type:String,trim:true},//nombre de la materia
    info:{type:Array},//array que contiene los examenes de  las distintas convocatorias de la materia
    userId: { type: Schema.Types.ObjectId, ref: 'user' },
},{
    timestamps:true // para guardar el tiempo de la creacion y actualizacion
}
);

UploadExamen.plugin(mongoosePaginate)
module.exports = model("uploadExamen" , UploadExamen)


/*

userName:{type:String,trim:true},
    userId:{type:String,trim:true},
    userPhoto:{type:String,trim:true},
    año:{type:String,trim:true},
    mes:{type:String,trim:true},
    materia:{type:String,trim:true},
    face:{type:String,trim:true},
    numComent:{type:Number,trim:true},
    pdfLink:{type:String,trim:true},

*/