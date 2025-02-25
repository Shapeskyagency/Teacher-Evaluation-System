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
        type: String, // ✅ Title field added
        required: true, // Required karna hai ya optional?
    },
    form1:messageSchema,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", activitySchema);
