const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
    pageId: String,
    title: String,    
    content: String,
    number: Number,
    page: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Page'
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

const Page = mongoose.model('Page', pageSchema);
module.exports = Page;