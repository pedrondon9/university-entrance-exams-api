const {Schema , model} = require("mongoose")
const data = new Date()
const bcrypt = require("bcrypt")

//registrar usuario

const User =  new Schema({
    nombre:{type:String},
    email:{type:String},
    password:{type:String},
    estado:{type:Boolean},
    token:{type:String},
    contact:{type:String},
    paiz:{type:String},
    genero:{type:String},
    role:{type:String},
});

User.methods.encryptPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};
  
User.methods.comparePassword= function (password) {
    return bcrypt.compareSync(password, this.password);
};


module.exports = model("user" , User)