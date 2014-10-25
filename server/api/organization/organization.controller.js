'use strict';

var _ = require('lodash');
var Organization = require('./organization.model');

// Get list of organizations
exports.index = function(req, res) {
  Organization.find(function (err, organizations) {
    if(err) { return handleError(res, err); }
    return res.json(200, organizations);
  });
};

// Get a single organization
exports.show = function(req, res) {
  Organization.findById(req.params.id, function (err, organization) {
    if(err) { return handleError(res, err); }
    if(!organization) { return res.send(404); }
    return res.json(organization);
  });
};

// Creates a new organization in the DB.
exports.create = function(req, res) {
  Organization.create(req.body, function(err, organization) {
    if(err) { return handleError(res, err); }
    return res.json(201, organization);
  });
};

// Updates an existing organization in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Organization.findById(req.params.id, function (err, organization) {
    if (err) { return handleError(res, err); }
    if(!organization) { return res.send(404); }
    var updated = _.merge(organization, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, organization);
    });
  });
};

// Deletes a organization from the DB.
exports.destroy = function(req, res) {
  Organization.findById(req.params.id, function (err, organization) {
    if(err) { return handleError(res, err); }
    if(!organization) { return res.send(404); }
    organization.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}