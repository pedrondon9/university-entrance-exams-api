// modelo de almacenaje de las noticias
const {Schema , model , models} = require("mongoose")
const mongoosePaginate = require("mongoose-paginate-v2")

//PARA AÑADIR COMENTARIOS

const Comment =  new Schema({
    userName:{type:String,trim:true},
    userId:{type:String,trim:true},
    examenId:{type:String,trim:true},//el id del examen a la que pertenece el comentario
    userPhoto:{type:String,trim:true},
    coment:{type:String},
    imagen1:{type:String},
    imagen2:{type:String},
    imagenes:{type:Array},
    imagen3:{type:String},
    imagen4:{type:String},
    comentLike:{type:Number},
    comentRepons:{type:Number},
    comentActive:{type:Boolean,trim:true},//si el comentario debe ser visto
    comentAddRepons:{type:Boolean,trim:true},//si se debe seguir añadiendo respuestas al comentario
    comentArrayRepons:{type:Array},
    comentCategory:{type:String}//la categoria a la quel pertenece el comentario
},{
    timestamps:true // para guardar el tiempo de la creacion y actualizacion
}
);

Comment.plugin(mongoosePaginate)
module.exports = model("commentS" , Comment)
