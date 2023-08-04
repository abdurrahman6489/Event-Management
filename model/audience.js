const mongoose = require("mongoose");

const audienceSchema = {
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "event",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
};

const Audience = mongoose.model("audience", audienceSchema);
module.exports = Audience;
