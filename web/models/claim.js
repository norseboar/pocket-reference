"use strict"

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var claimSchema = new Schema ({
  claimText: String,
  pageTitle: String,
  url: String,
  imgSrc: String
});

// methods ====================================================================

module.exports = mongoose.model('Claim', claimSchema);
