'use strict';

var _ = require('lodash');
var Hunt = require('./hunt.model');
var request = require('request');
var geo = require('geode');

// Get list of hunts
exports.index = function(req, res) {
  var categoryID = req.params.uid;
  
  request('http://api.crunchbase.com/v/2/organizations?organization_types=company&category_uuids=' + categoryID + '&user_key=f54110d09ea23e23d3e9095a7c08248d&page=1', function(err, response, body) {
    var comps = _.map(JSON.parse(body).data.items, 'name');
    return res.json(200, comps);
  });
};

exports.location = function(req, res) {
  var locationString = req.params.loc;
  
  var geo = new geode('actualhop', {language: 'en', country : 'US'})

  geo.search({name :req.params.loc}, function(err, results){
      return res.json(200, results);
  });
};


function handleError(res, err) {
  return res.send(500, err);
}