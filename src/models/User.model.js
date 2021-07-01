var { Schema, model } = require("mongoose");

//User Schema
var UserSchema = Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    required: true,
  },
  activeStatus: Boolean,
  photo: {
    type: String,
  },
});

const User = model("user", UserSchema);

module.exports = { User };
