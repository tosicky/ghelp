/**
 * Created by Oluwatosin on 11/25/2015.
 */

var model = require('./models');
var utils = require('./utils');

/**
 * A simple authentication middleware for Express.
 *
 * This middleware will load users from session data, and handle all user
 * proxying for convenience.
 */

module.exports.simpleAuth = function(req, res, next) {
    if (req.session && req.session.user) {
        model.Student.findOne({ _id: req.session.user._id }, 'firstName lastName _id email mobile semester program data', function(err, user) {
            if (user) {
                utils.createUserSession(req, res, user);
            }
            next();
        });
    } else {
        next();
    }
};