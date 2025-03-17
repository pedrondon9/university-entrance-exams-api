const mongoose = require("mongoose")
const mongos = 'mongodb://localhost/select' //process.env.MONGODB_URI_GNOP;





mongoose.connect( mongos, {
    
})
  .then(db => console.log("db is conected"))
  .catch(error => {console.log("Error can not conected in db");console.log(mongos)})