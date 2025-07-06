if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const jwt = require('jsonwebtoken');
const express = require("express")
const morgan = require("morgan")
const path = require("path")
const multer = require("multer")
const cors = require('cors')
const { v4: uuidv4 } = require('uuid')
const session = require('express-session');
const passport = require('passport');
const genl_routes = require('./route/public_route').public;
const autho_routes = require("./route/auth_route").authorization


const app = express()



//db
require("./db")
//passpor-local
require('./passport/local-auth');



//subir archivos con multer
const storage = multer.diskStorage({
    destination: path.join(__dirname, "public/pdf"),
    filename:(req,file,cb)=>{
        cb(null,uuidv4() + `${path.extname(file.originalname).toLocaleLowerCase()?path.extname(file.originalname).toLocaleLowerCase():".png"}`);
    }
})


//routing
const route = require("./route/rutas")



//setting
app.set("port", process.env.PORT || 5500)

app.set(morgan("dev"))

app.set("views", path.join(__dirname, "views"))

app.set("view engine", "ejs")



//middelware

app.use(express.urlencoded({ extended: false }))

app.use(morgan("dev"))

app.use(express.json({limit: '50mb'}))

app.use(cors())

app.use(passport.initialize());

app.use(passport.session());

//app.use(session({
//    secret: 'mysecretsession',
//    resave: false,
//    saveUninitialized: false
//}));



app.use("/auth/*", function auth(req, res, next) {
    if (req.session.authorization) {
        let token = req.session.authorization['accessToken']; // Access Token

        // Verify JWT token for user authentication
        jwt.verify(token, "access", (err, user) => {
            
            if (!err) {
                req.user = user; // Set authenticated user data on the request object
                next(); // Proceed to the next middleware
            } else {
                return res.status(403).json({ mens: "Por favor registrate o inicia sesion" }); // Return error if token verification fails
            }
        });

        // Return error if no access token is found in the session
    } else {
        return res.status(403).json({ mens: "Por favor registrate o inicia sesion" }); // Return error if token verification fails
    }
});




app.use(multer({
    storage,
    dest: path.join(__dirname, "public/pdf")

}).fields([{ name: "pdf" },{ name: "imagen1" }, { name: "imagen2" }, { name: "imagen3" }, { name: "imagen4" }]))


//route
app.use("/auth", autho_routes);
app.use("/", genl_routes);





//static
app.use(express.static(path.join(__dirname, "public")))





//init server
const puerto = app.get("port")
app.listen(puerto, () => {
    console.log(`servidor en el puerto ${puerto}`)
})