const bcrypt = require("bcrypt")
const User = require("../models/users");
const { generateAuthToken } = require("./generate.token");

const singInUser = async (req, res) => {

    try {
        const { email, password } = req.body


        const user = await User.findOne({ email});
        console.log(user,email)

        if (!user) {
            return res.status(403).json({ message: "usuario o contraseña  no valido", success: false })
        }

        if (!user.state) {
            return res.status(403).json({
                success: false,
                message: "Tu cuenta no esta activada , por favor activa tu cuenta atravez del link que hemos enviado en tu correo"
            })
        }

        const comparePass = bcrypt.compareSync(password, user.password)

        if (!comparePass) {
            return res.status(403).json({ message: "usuario o contraseña  no valido", success: false })
        }

        const token = await generateAuthToken(user)


        res.status(200).json({ success: true, token: token, userData: user, message: 'Cuenta activada' })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message:  "Error interno del servidor" , success: false })
    }
}

module.exports = singInUser