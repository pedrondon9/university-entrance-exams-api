const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const permissionSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  category: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { versionKey: false });

module.exports = mongoose.model('Permission', permissionSchema);