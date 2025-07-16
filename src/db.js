const mongoose = require("mongoose")
const mongos = process.env.DB //process.env.MONGODB_URI_GNOP;

mongoose.connect( mongos,{ useUnifiedTopology: true, useNewUrlParser: true })
  .then(db => console.log("db is conected"))
  .catch(error => {console.log("Error can not conected in db");console.log(mongos)})