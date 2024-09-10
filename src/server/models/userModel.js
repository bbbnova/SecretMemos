const mongoose = require('mongoose');
const Memo = require('../models/memoModel')

const userSchema = new mongoose.Schema({
    name: String,
    userId: String,
    email: String,
    passwordHash: String,
    isEnabled: Boolean,
    memos: [{ 
      type: mongoose.Types.ObjectId,
      ref: "Memo" }],
    notes: [{
      type: mongoose.Types.ObjectId,
      ref: "Note"
    }],
    createdAt: {
      type: Date,
      default: Date.now
    },
    modifiedAt: {
      type: Date,
      default: Date.now
    },
    version: Number
  });
// userSchema.virtual("regQueryId")
//   .get(function() { return JSON.parse(this.lastSecret).regQueryId.toString(); })
//   .set(function(val) {
//   });
const User = mongoose.model('User', userSchema);
module.exports = User;