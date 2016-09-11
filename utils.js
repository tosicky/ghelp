var express = require('express');
var stylus = require('stylus');
var nib = require('nib');
var path = require('path');
//var stormpath = require('express-stormpath');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('client-sessions');
var mongoose = require('mongoose');
var middleware = require('./middleware');


/**
 * Given a user object:
 *
 *  - Store the user object as a req.user
 *  - Make the user object available to templates as #{user}
 *  - Set a session cookie with the user object
 *
 *  @param {Object} req - The http request object.
 *  @param {Object} res - The http response object.
 *  @param {Object} user - A user object.
 */

//var routes = require('./routes/auth');

module.exports.createUserSession = function(req, res, user) {
    var cleanUser = {
        firstName:  user.firstName,
        lastName:   user.lastName,
        _id:    user._id,
        program: user.program,
        mobile: user.mobile,
        semester: user.semester,
        email:      user.email,
        data:       user.data || {}
    };

    req.session.user = cleanUser;
    req.user = cleanUser;
    res.locals.user = cleanUser;
};


module.exports.createApp = function() {
    mongoose.connect('mongodb://localhost:27017/ghelp');

    var app = express();

    //stylus compile
    function compile(str, path) {
        return stylus(str)
            .set('filename', path)
            .use(nib())
    }

    // settings
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');

    app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(stylus.middleware(
        { src: __dirname + '/public'
            , compile: compile
        }
    ));
    app.use(express.static(__dirname + '/public'));
    app.use(express.static(path.join(__dirname, 'public')));

    // middleware
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(session({
        cookieName: 'session',
        secret: 'keyboard cat',
        duration: 30 * 60 * 1000,
        activeDuration: 5 * 60 * 1000,
    }));

//    app.use(csrf());
    app.use(middleware.simpleAuth);


    // routes
    app.use(require('./routes/index'));
    app.use(require('./routes/users'));


    var env = process.env.NODE_ENV || 'development';


// error handlers

// development error handler
// will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }

// production error handler
// no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });

    console.log('G-HELP server is connected on port 3000');
    console.log('Mode: ' + env)

    return app;
};

/**
 * Ensure a user is logged in before allowing them to continue their request.
 *
 * If a user isn't logged in, they'll be redirected back to the login page.
 */

module.exports.requireLogin = function(req, res, next) {
    if (!req.user) {
        res.redirect('/login');
    } else {
        next();
    }
};


/**
mongoose.connect('mongodb://localhost:27017/ghelp');

var app = express();

    // settings
app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');

    // middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
        cookieName: 'session',
        secret: 'keyboard cat',
        duration: 30 * 60 * 1000,
        activeDuration: 5 * 60 * 1000,
    }));
  //  app.use(csrf());
app.use(middleware.simpleAuth);

// routes
app.use('/', routes);
app.use('/users', users);

/**
 * Ensure a user is logged in before allowing them to continue their request.
 *
 * If a user isn't logged in, they'll be redirected back to the login page.
 */

/**
module.exports.requireLogin = function(req, res, next) {
    if (!req.user) {
        res.redirect('/login');
    } else {
        next();
    }
};

var env = process.env.NODE_ENV || 'development';

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.listen(3000,function(){
    console.log('G-HELP server is connected on port 3000');
    console.log('Mode: ' + env);
});
*/

