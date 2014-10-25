'use strict';

var express = require('express');
var controller = require('./hunt.controller');

var router = express.Router();

router.get('/:uid/:loc', controller.index);

module.exports = router;