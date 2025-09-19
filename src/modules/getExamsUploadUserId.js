const examUpload = require("../models/upload.exam");


async function GetExamsUploadUserId(req, res) {
    try {
        const result = await examUpload.paginate({userId:req.params.id}, {
            limit: 100,
            sort: { createdAt: -1 }
        })
        return res.status(200).json({ success: true, message: '', response: result })
    } catch (error) {
    }
}

module.exports = GetExamsUploadUserId