const mongoose = require('mongoose');
const { Schema } = mongoose;

const SecoundActivity = new mongoose.Schema(
  {
    observerMessage:{ type: String, required: true },
    teacherMessage:{ type: String, required: true },
    route:{ type: String, required: true },
    date:{ type: Date, required: true },
    reciverId:{ type: Schema.Types.ObjectId, ref: 'User' },
    senderId:{ type: Schema.Types.ObjectId, ref: 'User' },
    fromNo:{ type: Number, required: true },
    data:{ type: Object, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ActivityTwo", SecoundActivity);
