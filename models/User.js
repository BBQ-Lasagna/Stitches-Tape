const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs"); 

const UserSchema = new Schema({
  firstName: { type: String, default: '', required: true },
  lastName: { type: String, required: true },
  username: {type: String, required: true },
  email: {type: String, required: true },
  password: {type: String, required: true },
  isDeleted: {type: Boolean, default: false },
  wantsUpdates: {type: Boolean, default: false },
  date: { type: Date, default: Date.now }
});

UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
  
