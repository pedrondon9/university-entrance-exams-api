const Users = require("../models/users");


const verifyUsers = async (tokenData, token, res) => {
    try {

        if (!token) return res.status(405).json({ success: false, message: '' })

        const user = await Users.findOne({
            _id: tokenData._id,
        })

        return user;

    } catch (error) {
        return res.status(500).json({ success: false, message:  "Error interno del servidor"  })
    }

}

module.exports = {
    verifyUsers
}