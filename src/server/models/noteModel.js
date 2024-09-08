const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    noteId: String,
    title: String,    
    category: String,
    description: String,
    number: Number,
    pages: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Page'
    }],
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

const Note = mongoose.model('Note', noteSchema);
module.exports = Note;