'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PostSchema = new Schema({
  id: Number,
  name: String,
  tagline: String,
  user_id: Number,
  user_name: String
});

module.exports = mongoose.model('Post', PostSchema);