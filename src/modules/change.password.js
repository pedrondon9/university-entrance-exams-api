const User = require("../models/users");
const SendEmail = require("./send.email");
const { generateAuthTokenRegister } = require("./generate.token");

const changePassword = async (req, res) => {
    try {

        const { passwordRepeat, password, email } = req.body;

        const user = await User.findOne({ email });

        if (password !== passwordRepeat) {
            return res.status(403).json({ message: "Las contraseñas no coinciden", success: false });
        }

        if (!user) {
            return res.status(403).json({ message: "El usuario no existe", success: false });
        }

        if (!(email && passwordRepeat && password)) {
            return res.status(403).json({ message: "Comprueba que has rellenado todos los campos", success: false });
        }

        const token = await generateAuthTokenRegister(req.body)

        const verificationLink = `https://selectividad.mumbx.com/#/confirm${token}`;      

        const constentEmail = `<p>Hi ${user.fullname},</p>
             <p>Porfavor verifica tu correo haciendo clik en el siguiente enlace:</p>
             <a href="${verificationLink}">Verifica Correo</a>`;

        await SendEmail(email, constentEmail);

        res.status(200).json({ message: "Por favor, activa la modificacion atravez del link que hemos enviado en tu correo", success: true, token: token });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message:  "Error interno del servidor" , success: false });
    }
};

module.exports = changePassword;