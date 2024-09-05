const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    userId: String,
    passwordHash: String,
    isEnabled: Boolean,
    encryptedNotes: String,
    encryptedMemos: String,
    lastSecret: String
  });

userSchema.virtual("regQueryId")
  .get(function() { return JSON.parse(this.lastSecret).regQueryId.toString(); })
  .set(function(val) {

  });

const User = mongoose.model('User', userSchema);
module.exports = User;