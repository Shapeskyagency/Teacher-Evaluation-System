const mongoose = require('mongoose');
const { Schema } = mongoose;

const ClassDetail = new Schema({
 className: { type: String, required: true },
 sections: [{ name: {type: String, required: true} }],
}, { timestamps: true });

const ClassDetails = mongoose.model('ClassDetails', ClassDetail);
module.exports = ClassDetails;
