/**
 * Created by Oluwatosin on 11/25/2015.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var AdminAccount = new Schema({
    adminusername: String,
    password: String
});

AdminAccount.plugin(passportLocalMongoose);

module.exports = mongoose.model('adminaccounts', AdminAccount);