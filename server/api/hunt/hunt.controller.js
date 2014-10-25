'use strict';

var _ = require('lodash');
var Hunt = require('./hunt.model');
var request = require('request');

// Get list of hunts
exports.index = function(req, res) {
  var categoryID = req.params.uid;
  var locationString = req.params.loc;
  
  request('http://api.crunchbase.com/v/2/organizations?organization_types=company&category_uuids=' + categoryID + '&user_key=f54110d09ea23e23d3e9095a7c08248d&page=1', function(err, res, body) {
    var comps = _.map(JSON.parse(body).data.items, 'name');
    console.log(comps);
  });
  
  //test
  var result = [{name: 'Rick Turoczy', username: 'turoczy', percentage: .92},{name: 'Jimmy Douglas', username: 'jimmydouglas', percentage: .75}];
  return res.json(200, result);
};


function handleError(res, err) {
  return res.send(500, err);
}