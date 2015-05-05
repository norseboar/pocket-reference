"use strict"
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var path = require('path');
var Claim = require(path.join(__dirname, '../models/claim'));

var Schema = mongoose.Schema;

var userSchema = new Schema ({
  claims: [Claim.schema],
  local: {
    email: String,
    password: String
  }
});

// methods ====================================================================
userSchema.methods.generateHash = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

userSchema.methods.validPassword = function(password){
  return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);
