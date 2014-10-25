'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
  id: Number,
  name: String,
  username: String,
  recommended_by_id: Number,
  followers_count: Number,
  followings_count: Number,
  votes_count: Number,
  posts_count: Number,
  maker_of_count: Number,
  comments_count: Number

});

module.exports = mongoose.model('User', UserSchema);