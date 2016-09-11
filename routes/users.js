var express = require('express');

var utils = require('../utils');

var router = express.Router();

/**
 * Render the home page.
 */
router.get('/', function(req, res) {
  res.render('ghelp.jade');
});

/**
 * Render the dashboard page.
 */
router.get('/studenthome', utils.requireLogin, function(req, res) {
  res.render('studenthome.jade');
});

module.exports = router;
