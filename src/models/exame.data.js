// modelo de almacenaje de las noticias
const {Schema , model , models} = require("mongoose")
const mongoosePaginate = require("mongoose-paginate-v2")


const exam_data =  new Schema({
    materia:{type:String,trim:true},
    año:{type:String,trim:true},
    mes:{type:String,trim:true},
    userId: { type: Schema.Types.ObjectId, ref: 'user' },
    estado:{type:String,trim:true},//si esta corregido el examen o noo
    face:{type:String,trim:true},//face genera o especifica
    userName:{type:String},//nombre del usuario que subió el examen
    userPhoto:{type:String},//link de la foto del usuario que subió el examen
    numComent:{type:String},
    pdfLink:{type:String},
},{
    timestamps:true // para guardar el tiempo de la creacion y actualizacion
}
);

exam_data.plugin(mongoosePaginate)
module.exports =  model("examenDatos" , exam_data)

