'use strict';

var _ = require('lodash');
var Cat = require('./cat.model');

// Get list of cats
exports.index = function(req, res) {
  Cat.find(function (err, cats) {
    if(err) { return handleError(res, err); }
    return res.json(200, cats);
  });
};

// Get a single cat
exports.show = function(req, res) {
  Cat.findById(req.params.id, function (err, cat) {
    if(err) { return handleError(res, err); }
    if(!cat) { return res.send(404); }
    return res.json(cat);
  });
};

// Creates a new cat in the DB.
exports.create = function(req, res) {
  Cat.create(req.body, function(err, cat) {
    if(err) { return handleError(res, err); }
    return res.json(201, cat);
  });
};

// Updates an existing cat in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Cat.findById(req.params.id, function (err, cat) {
    if (err) { return handleError(res, err); }
    if(!cat) { return res.send(404); }
    var updated = _.merge(cat, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, cat);
    });
  });
};

// Deletes a cat from the DB.
exports.destroy = function(req, res) {
  Cat.findById(req.params.id, function (err, cat) {
    if(err) { return handleError(res, err); }
    if(!cat) { return res.send(404); }
    cat.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}