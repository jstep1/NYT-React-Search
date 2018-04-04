var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var articleSchema = new Schema({
  title: String,
  date: Date,
  url: String
});

var Article = mongoose.model("Article", articleSchema);

module.exports = Article;