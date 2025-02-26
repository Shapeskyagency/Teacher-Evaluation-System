const mongoose = require("mongoose");
const router = require("../routes/formRoutes");

const messageSchema = new mongoose.Schema(
    {
        message:{
            type:String,
        },
        router:{
            type:String
        }
    },
    
)
const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
        type: String,
        required: true, 
    },
    form1:messageSchema,
    className: {
      type: String, 
      required: true,
    },
    section: {
      type: String,
      required: true,
    },
    subject: {
      type: String, 
      required: false,
    },
    userName: {
      type: String, 
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", activitySchema);
