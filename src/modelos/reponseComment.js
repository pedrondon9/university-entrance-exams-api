// modelo de almacenaje de las noticias
const {Schema , model , models} = require("mongoose")
const mongoosePaginate = require("mongoose-paginate-v2")

//RESPONDER AL COMENTARIO PRINCIPAL
const ResponseComment =  new Schema({
    userName:{type:String,trim:true},
    userId:{type:String,trim:true},
    userPhoto:{type:String,trim:true},
    coment:{type:String},
    imagen1:{type:String},
    imagen2:{type:String},
    imagen3:{type:String},
    imagenes:{type:Array},
    imagen4:{type:String},
    comentId:{type:String},
    comentLike:{type:Number},
    comentRepons:{type:Number},
    comentActive:{type:Boolean,trim:true},
    comentAddRepons:{type:Boolean,trim:true},
    comentArrayRepons:{type:Array},
    comentCategory:{type:String}
},{
    timestamps:true // para guardar el tiempo de la creacion y actualizacion
}
);

ResponseComment.plugin(mongoosePaginate)
module.exports = model("resp_comment" , ResponseComment)
