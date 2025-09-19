if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
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
const { initializeRoles } = require('./script/initializeRoles');
const { verifyToken } = require('./modules/verify.token');


const app = express()

//db
require("./db")

// create permission
initializeRoles()


//config multer
const storage = multer.diskStorage({
    destination: path.join(__dirname, "public/pdf"),
    filename: (req, file, cb) => {
        cb(null, uuidv4() + `${path.extname(file.originalname).toLocaleLowerCase() ? path.extname(file.originalname).toLocaleLowerCase() : ".png"}`);
    }
})



//setting
app.set("port", process.env.PORT || 5500)

app.set(morgan("dev"))

app.set("views", path.join(__dirname, "views"))

app.set("view engine", "ejs")



//middelware

app.use(express.urlencoded({ extended: false }))

app.use(morgan("dev"))

app.use(express.json({ limit: '50mb' }))

app.use(cors({
    origin: ["http://localhost:3000","https://selectividad.mumbx.com"], 
    credentials: true
}))

app.use(passport.initialize());

app.use(passport.session());

app.use("/customer",
    session({
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true,
    }))

app.use("/customer/auth/*", verifyToken);

app.use(multer({
    storage,
    dest: path.join(__dirname, "public/pdf")

}).fields([{ name: "pdf" }, { name: "imagen1" }, { name: "imagen2" }, { name: "imagen3" }, { name: "imagen4" }]))


//route
app.use("/customer/auth", autho_routes);
app.use("/customer/", genl_routes);


//static
app.use(express.static(path.join(__dirname, "public")))



//init server
const puerto = app.get("port")
app.listen(puerto, () => {
    console.log(`The server is started in the port ${puerto}`)
})