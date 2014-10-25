'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var HuntSchema = new Schema({
  name: String,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('Hunt', HuntSchema);