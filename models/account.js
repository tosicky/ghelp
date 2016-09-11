/**
 * Created by Oluwatosin on 11/25/2015.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    _id : {type: Number, required: true},
    firstName : {type: String, required: true},
    lastName : {type: String, required: true},
    program : {type: String, required: true},
    semester: {type: Number, required: true},
    email: {type: String, required: true, unique: true},
    mobile : {type: Number, required: true},
    dob : {type: String},
    sex : {type: String, required: true},
    country : {type: String},
    status : {type: String},
    preference: {type: String, required: true},
    date : {type:Date, default: Date.now},
    assigned: {type: Boolean, default: false},
    mentor: {type: Number, ref: 'Mentor'},
    hostFamily: {type: String},
    image: {data: Buffer, contentType: String}
});


Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);