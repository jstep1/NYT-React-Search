// Dependecies
var express = require("express");
var mongoose = require("mongoose");
var bluebird = require("bluebird");
var bodyParser = require("body-parser");
var path = require("path");

// Set up a default port, configure mongoose, configure our middleware
var PORT = process.env.PORT || 3001;
mongoose.Promise = bluebird;
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve up static assets if in production (running on Heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("nytreact/build"));
} else {
  app.use(express.static(__dirname + "/nytreact/public"));
}

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next();
});

// Routing
var articlesController = require("./server/controllers/article-controller.js");
var router = new express.Router();
router.get("/api/saved", articlesController.find);

router.post("/api/saved", articlesController.insert);

router.delete("/api/saved/:id", articlesController.delete);

router.get("/*", function(req, res) {
  res.sendFile(path.join(__dirname, "./nytreact/build/index.html"));
});

app.use(router);

var db = process.env.MONGODB_URI || "mongodb://localhost/nytapp";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(db, {
  useMongoClient: true
});

// Start the server
app.listen(PORT, function() {
  console.log(`🌎 ==> Server now on port ${PORT}!`);
});