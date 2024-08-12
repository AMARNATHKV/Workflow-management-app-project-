const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String, enum: ["manager", "staff"], required: true },
  //message: { type: String, required: true },
  projects: [
    {
      projectId: { type:String, ref: "Project" },
      invitationStatus: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
