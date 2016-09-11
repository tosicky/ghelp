/**
 * Created by Oluwatosin on 11/25/2015.
 */
var express = require('express');
var bcrypt = require('bcryptjs');
//var passport = require('passport');
//var Account = require('../models/account');
var model = require('../models.js');
var utils = require('../utils')
var router = express.Router();

/* GET home page. */



/** passport logout
router.get('/logout', function(req, res, next) {
    req.logout();
    req.session.save(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/ghelp');
    });
});
 */
router.get('/logout', function(req, res) {
    if (req.session) {
        req.session.reset();
    }
    res.redirect('/');
});

router.get('/ping', function(req, res){
    res.status(200).send("BullsEye!");
});

function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.send('You need to be logged in to access this page');
    }
}

function adminLogin(req, res, next) {
    if (req.user.email=='admin@mun.ca') {
        next();
    } else {
        res.redirect('/home');
    }
}

function profilePicture(req, res, next) {
    if (req.user) {
        var a=req.user._id;
        var b=a+".png,.jpg";
        var pic='images/'+b;

        next();
    }
}

function checkSemester(req, res, next) {
    if (req.user.semester>3) {
        next();
    } else {
        res.send('You are not eligible to be a Mentor');
    }
}

router.get('/picture', profilePicture, function(req, res, next) {


    res.render('picture', { user : req.user });
});

router.get('/regmentor', function(req, res, next) {


    res.render('regmentor', { user : req.user });
});

router.get('/home', loggedIn, function(req, res, next) {

    if (req.user.username=='admin@mun.ca') {
        res.render('adminhome', { user : req.user })
    }
    else {
        res.render('studenthome', { user : req.user })
    }
});

router.get('/profile', function(req, res) {
    res.render('profile');
});

router.get('/login', function(req, res) {
    res.render('login');
});

router.get('/ghelp', function(req, res, next) {
    res.render('ghelp', { user : req.user });
});

router.get('/test', function (req, res) {
    dbName.open(function (error, client) {
        var collection = new mongodb.Collection(client, 'usercollection');
        collection.find().limit(300).toArray(function (err, dataObjArr) {
            var data = '';
            var dataArr = [];
            var i = dataObjArr.length;
            //check for error
            if(err){return res.end('error!'+err);}
            //Data
            if (dataObjArr) {
                while(i--){
                    dataArr[i] = dataObjArr[i]._id;
                }
                data = dataArr.join(' ');
                res.render('test', { returnedData : data });
            }else{
                res.end();
            }
        });
    });
});


router.get('/regstud', function(req, res, next) {
    res.render('regstud', { title: 'Register Student' });
});

router.get('/addevent', adminLogin, function(req, res, next) {
    res.render('addevent', { user : req.user });
});

router.get('/test', function(req, res) {
    var db = req.db;
    var collection = db.get('accounts');
    collection.find({},{},function(e,docs){
        res.render('test', {
            "userlist" : docs
        });
    });
});

router.get('/test2', loggedIn, function(req, res, next) {
    res.render('test2', { user : req.user });
});
router.get('/hostreg', function(req, res, next) {
    res.render('hostreg', { title: 'Host a student' });
});


router.get('/register', function(req, res) {
    res.render('register', { });
});


router.get('/viewmentor', function(req, res) {
    model.Student.findOne({_id: 'req.session.user._id'}).populate('mentor').exec(function (err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log('Your Mentor is', data.mentor.firstName, data.mentor.lastName);
            res.render('viewmentor', {title: 'Your Mentor', data: data});
        }
    })
});

router.get('/assignmentor', function(req, res){
    //   var db = req.db;
    //   var collection = db.get('mentor');
    // model.MenSchema.find().setOptions({sort: 'major'})
    model.MenSchema.find({}, {firstName: 1 , lastName: 1 , preference: 1, _id: 1})
        .exec(function(err, ments){
            if(err){
                console.log(err);
            }
            else {
                model.Student.find({$and: [{semester: { $lt: 3 }},{assigned: false }, {mentorRequest: 'No'}]}, {firstName: 1, lastName: 1, preference: 1, _id: 1})
                    .exec(function (err, stds) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            res.render('assignmentor', {title: 'Students', stds: stds, ments: ments});
                        }

                    })
            }});

});

/** query for host families and students for assignment
 *
 */
router.get('/assignhost', function(req, res){
    model.Host.find({}, {firstName: 1 , lastName: 1 , preference: 1, address: 1, _id: 1})
        .exec(function(err, hosts){
            if(err){
                console.log(err);
            }
            else {
                model.Student.find({$and: [{semester: { $lt: 3}},{hostFamily: ""}]}, {firstName: 1, lastName: 1, preference: 1, _id: 1})
                    .exec(function (err, stds) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            res.render('assignhost', {title: 'Assign Host', stds: stds, hosts: hosts});
                        }

                    })
            }});

});



/**
 router.post('/regmentor', function(req, res) {

    new model.MenSchema({
        ment_id:    req.body.munNo,
        firstName:  req.body.firstName,
        lastName:   req.body.lastName,
        email:      req.body.email,
        major:      req.body.major,
        cellPhone:  req.body.number,
        sex:        req.body.sex,
        preference: req.body.preference,
        assigned:   req.body.assigned,



    }).save(function(err, docs){
            if (err) {
                //if failed, return error
                res.send("Mentor registration wasn't successful");
            }
            else {
                //Success !!!
                res.redirect("ghelp");
                res.end("Thank you for your registration");
            }
        });
});
 */

//duplicating
router.get('/registermentor', loggedIn, checkSemester, function(req, res, next) {

    res.render('registermentor', { user : req.user });
});

router.post('/registermentor', function(req, res) {

    new model.MenSchema({
        _id:        req.body.munNo,
        firstName:  req.body.firstName,
        lastName:   req.body.lastName,
        email:      req.body.email,
        major:      req.body.major,
        cellPhone:  req.body.number,
        sex:        req.body.sex,
        preference: req.body.preference,
        //     assigned: req.body.assigned

    }).save(function(err, docs){
            if (err) {
                //if failed, return error
                res.send("You are already a Mentor" );
            }
            else {
                //Success !!!

                res.end("Thank you for your registration");
            }
        });
});


/**passport login
router.post('/ghelp', passport.authenticate('local'), function(req, res, next) {
    req.session.save(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/home');

    });
});
 */

router.post('/addevent', function(req, res) {

    new model.AddEvent({
        eventName:      req.body.eventName,
        startDate:    req.body.startDate,
        endDate:     req.body.endDate,
        startTime:        req.body.startTime,
        endTime:    req.body.endTime,
        venue:        req.body.venue,
        eventDetail:          req.body.eventDetail



    }).save(function(err, docs){
            if (err) {
                //if failed, return error
                res.send("There was some error" );
            }
            else {
                //Success !!!

                res.end("Event Registered!");
            }
        });
});


/** passport authentication
router.post('/register', function(req, res, next) {
    Account.register(new Account({
        username : req.body.username,
        password:  req.body.password,
        _id : req.body.munNo,
        firstName : req.body.firstname,
        lastName : req.body.lastname,
        program : req.body.progtype,
        semester: req.body.semester,
        mobile : req.body.mobile,
        sex : req.body.sex,
        mentorRequest: req.body.request,
        preference: req.body.preference,
        image: req.body.image,
        assigned: req.body.assigned,
        mentor: req.body.ment_id,
        hostFamily: req.body.hostFamily }), function(err) {
        if (err) {
            return res.render("register", {info: "Sorry. That username already exists. Try again."});
        }
        else{
            passport.authenticate('local')(req, res, function () {
                req.session.save(function (err) {
                    if (err) {
                        return next(err);
                    }
                    res.send('success');
                });
            });
        }

    });
});
*/

router.post('/register', function(req, res) {
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(req.body.password, salt);

   var user = new model.Student({
        //Get our form values.
        email: req.body.email,
        password:  hash,
        _id: req.body.munNo,
        firstName : req.body.firstName,
        lastName: req.body.lastName,
        program: req.body.progtype,
        semester: req.body.semester,
        mobile: req.body.mobile,
        sex: req.body.sex,
        mentorRequest: req.body.request,
        preference: req.body.preference,
        image: req.body.image,
        assigned: req.body.assigned,
        mentor: req.body.mentor,
        hostFamily: req.body.hostFamily

    });console.log(user);
    user.save(function(err){
            if (err) {
                var error = 'Something bad happened! Please try again.';

                if (err.code === 11000) {
                    error = 'That email is already taken, please try another.';
                }

                res.render('register.jade', { error: error });
            } else {
                   utils.createUserSession(req, res, user);
                res.redirect('/home');
            }
        });
});



router.post('/hostreg', function(req, res) {
    var host = new model.Host({
        //Get our form values.
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        email : req.body.email,
        address : req.body.address,
        mobileNo : req.body.mobileNo,
        preference : req.body.preference
    });
    console.log(host);
    host.save(function(err, doc){
        if (err) {
            //if failed, return error
            res.send("Mentor registration wasn't successful");
        }
        else {
            //Success !!!
            res.end("Thank you for your registration");
        }
    });
});

router.post('/assignmentor', function(req, res) {
    //Get our form values.
    var mentee = req.body.mentee;
    var dmentor = req.body.dmentor;
    if(mentee){
        model.Student.update({"_id":mentee}, {$set:{"mentor": dmentor, "assigned": true}},function(err, doc){
            if (doc) {
                //if failed, return error

                res.send("Mentor registration was successful");
            }
            else {
                //Success !!!
                res.end("mentor assignment wasn't successful");
            }
        });
    }
    else{
        res.end("Ensure you have selected a student")
    }

});

/** Post for Host family Assignment
 *
 */
router.post('/assignhost', function(req, res) {
    //Get our form values.
    var student = req.body.student;
    var hostfamily = req.body.hostfamily;
    if(student){
        model.Student.update({"_id":student}, {$set:{"hostFamily": hostfamily}},function(err, doc){
            if (doc) {
                //if failed, return error

                res.send("Mentor registration was successful");
            }
            else {
                //Success !!!
                res.end("mentor assignment wasn't successful");
            }
        });
    }
    else{
        res.end("Ensure you have selected a student")
    }

});


router.post('/login', function(req, res) {
        model.Student.findOne({_id: req.body.munId}, 'firstName lastName _id email password mobile program semester', function (err, user) {
            if (!user) {
                res.render('ghelp.jade', {error: "Incorrect email / password."});

            } else {
                if (bcrypt.compareSync(req.body.password, user.password)) {
                    utils.createUserSession(req, res, user);
                    res.redirect('/home');
                } else {
                    res.render('ghelp.jade', {error: "Incorrect email / password."});
                }
            }
        });
    });

module.exports = router;