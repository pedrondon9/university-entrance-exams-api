const {Schema , model} = require("mongoose")
const data = new Date()
const bcrypt = require("bcrypt")

//registrar usuario

const User =  new Schema({
    fullname:{type:String},
    email:{type:String},
    password:{type:String},
    state:{type:Boolean},
    token:{type:String},
    contact:{type:String},
    paiz:{type:String},
    sex:{type:String},
    role:{type:String},
    token:{type:String},
    isVerified:{type:Boolean}
});

User.methods.encryptPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};
  
User.methods.comparePassword= function (password) {
    return bcrypt.compareSync(password, this.password);
};


module.exports = model("user" , User)