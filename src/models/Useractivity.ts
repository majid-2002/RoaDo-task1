import mongoose from "mongoose";

const UseractivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  deviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Device",
    required: true,
  },
  loggedInAt: {
    type: Date,
    default: Date.now,
  },
loggedOutAt: {
    type: Date,
},
lastSeenAt: {
    type: Date,
},
});

const Useractivity = mongoose.model("Useractivity", UseractivitySchema);

export default Useractivity;
