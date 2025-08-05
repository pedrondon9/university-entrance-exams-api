
//modelos

const User = require("../models/users");
const SendEmail = require("./send.email");
const { generateAuthTokenRegister } = require("./generate.token");

const signUpUser = async (req, res) => {
    try {

        const { fullname, password, email } = req.body;

        const user = await User.findOne({ email });
        console.log(user)

        if (user) {

            return res.status(403).json({ message: "El usuario ya existe", success: false });
        }
        if (!(email && fullname && password)) {

            res.status(403).json({ message: "Comprueba que has rellenado todos los campos", success: false });
        }
        const token = await generateAuthTokenRegister(req.body)

        //console.log(user, "user", token, "token");
        const verificationLink = `https://selectividad.mumbx.com/#/confirm/${token}`;
        const constentEmail = `<p>Hi ${fullname},</p>
                     <p>Please verify your email by clicking the link below:</p>
                     <a href="${verificationLink}">Verify Email</a>`;

        await SendEmail(email, constentEmail);

        res.status(200).json({
            message: "La cuenta ha sido creada con exito, activa tu cuenta atravez del link que hemos enviado en tu correo",
            success: true,
            token: token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message:  "Error interno del servidor" , success: false });
    }
};




module.exports = signUpUser