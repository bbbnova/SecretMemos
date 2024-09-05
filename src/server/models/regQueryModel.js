const mongoose = require('mongoose');

const regQuerySchema = new mongoose.Schema({
    fromIp: String,
    userName: String,
    userId: String,
    sentAt: Date,
    action: { 
      type: String,
      enum: ['register', 'get', 'update', 'delete']
    },
    completed: { type: Boolean, default: false }
  });


const RegQuery = mongoose.model('RegQuery', regQuerySchema);

module.exports = RegQuery;