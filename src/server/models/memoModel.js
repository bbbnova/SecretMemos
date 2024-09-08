const mongoose = require('mongoose');

const memoSchema = new mongoose.Schema({
    accountName: String,
    memoId: String,
    category: String,
    applicationName: String,
    email: String,
    password: String,
    url: String,
    note: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
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

const Memo = mongoose.model('Memo', memoSchema);
module.exports = Memo;