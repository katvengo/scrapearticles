var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

var PORT = 8080;

var app = express();

var exphbs = require("express-handlebars");
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

app.use(logger("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


var routes = require("./controllers/article_controller.js");

app.use(routes);

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines"; 

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, force: true });



app.listen(PORT, function() {
  console.log(`App running on  ${PORT}`);
});
