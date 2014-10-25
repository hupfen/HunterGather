'use strict';

var express = require('express');
var controller = require('./hunt.controller');

var router = express.Router();

router.get('/cat/:uid', controller.index);
router.get('/loc/:loc', controller.location);

module.exports = router;