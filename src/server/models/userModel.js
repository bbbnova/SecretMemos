const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    userId: String,
    email: String,
    passwordHash: String,
    isEnabled: Boolean,
    memos: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Memo'
    }],
    notes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note'
    }],
    createdAt: {
      type: Date,
      default: Date.now
    },
    mofifiedAt: {
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