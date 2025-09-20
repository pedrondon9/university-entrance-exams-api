// modelo de almacenaje de las noticias
const {Schema , model , models} = require("mongoose")
const mongoosePaginate = require("mongoose-paginate-v2")

//RESPONDER AL COMENTARIO PRINCIPAL
const response_comment =  new Schema({
    userName: { type: String, trim: true },
    userId: { type: Schema.Types.ObjectId, ref: 'user' },
    parentId: { type: Schema.Types.ObjectId, ref: 'commentS' },//el id del examen a la que pertenece el comentario
    userPhoto: { type: String, trim: true },
    response: { type: String,trim: true  },
},{
    timestamps:true // para guardar el tiempo de la creacion y actualizacion
}
);

response_comment.plugin(mongoosePaginate)
module.exports = model("resp_comment" , response_comment)
