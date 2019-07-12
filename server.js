var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

var PORT = process.env.PORT || 8080;

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

require('dotenv').config()

var routes = require("./controllers/article_controller.js");

app.use(routes);


//`mongodb://localhost/scrapeArtcles`; 
//  'mongodb://heroku_pzjpkkjh:gtpp4dlb8lc6fa9brlijd2e42h@ds345587.mlab.com:45587/heroku_pzjpkkjh'
// `mongodb://katvengo:${process.env.DB_PASS}@ds345587.mlab.com:45587/heroku_pzjpkkjh`; 
// console.log(MONGODB_URI)

mongoose.connect(
  process.env.MONGODB_URI || 
   "mongodb://katvengo:Horses100@ds345587.mlab.com:45587/heroku_pzjpkkjh",
   { useNewUrlParser: true }
  );

mongoose.set('useFindAndModify', false);
mongoose.set('debug', true)


app.listen(PORT, function() {
  console.log(`App running on  ${PORT}`);
});

