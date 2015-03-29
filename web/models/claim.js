"use strict"

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var claimSchema = new Schema ({
  title: String,
  description: String,
  url: String,
  image: String
});

// methods ====================================================================

module.exports = mongoose.model('Claim', claimSchema);
