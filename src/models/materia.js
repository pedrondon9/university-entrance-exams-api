// modelo de almacenaje de las noticias
const {Schema , model , models} = require("mongoose")
const mongoosePaginate = require("mongoose-paginate-v2")


const exam_data =  new Schema({
    name:{type:String,trim:true},
    description:{type:String,trim:true},
    tags:{type:Array},
    examenUploadId: [{ type: Schema.Types.ObjectId, ref: 'uploadExamen' }],//El id que relacionara el examen con sus comentarios

},{
    timestamps:true // para guardar el tiempo de la creacion y actualizacion
}
);

exam_data.plugin(mongoosePaginate)
module.exports =  model("examenDatos" , exam_data)

