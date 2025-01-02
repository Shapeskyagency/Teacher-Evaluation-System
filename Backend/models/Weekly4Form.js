const mongoose = require('mongoose');
const { Schema } = mongoose;

const weekly4FormSchema = new Schema({
    date: { type: Date, required: true },
    dateOfSubmission: { type: Date, required: false },
    teacherId: { type: Schema.Types.ObjectId, ref: 'User' },
    isInitiated: { status: { type: Boolean }, Observer: { type: Schema.Types.ObjectId, ref: 'User' } },
    isCompleted: { type: Boolean },
    FormData: {type: Array}
});

module.exports = mongoose.model('weekly4Form', weekly4FormSchema);