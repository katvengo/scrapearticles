var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

var env = require('dotenv').config()
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

const db = require('db')
db.connect({
  password: process.env.DB_PASS
})
var MONGODB_URI = process.env.MONGODB_URI || `mongodb://katvengo:${password}@ds345587.mlab.com:45587/heroku_pzjpkkjh`; 

mongoose.connect(MONGODB_URI, { useNewUrlParser: true});

// mongoose.set('useFindAndModify', false);
// mongoose.set('debug', true)


app.listen(PORT, function() {
  console.log(`App running on  ${PORT}`);
});
