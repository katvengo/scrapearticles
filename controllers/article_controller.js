const express = require("express");
const router = express.Router();
var axios = require("axios");
var cheerio = require("cheerio");
var app = express()
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

//Routes

 router.get("/scrape", function(req, res) {
    var result = [];
    axios.get("https://www.apnews.com/apf-topnews").then(function(response) {
      var $ = cheerio.load(response.data);
  
      const articles = $("div.FeedCard");
  
      articles.each(function(i, element) {
        title = $(element)
          .find("div.CardHeadline")
          .children("a")
          .text();
        articleLink = $(element)
          .find("div.CardHeadline")
          .children("a")
          .attr("href");
        link = `https://www.apnews.com${articleLink}`;
        summary = $(element)
          .find("div.c0112")
          .children("p")
          .text();
  
        result.push({
          title: title,
          link: link,
          summary: summary
        });
      });
      return res.json(result);
    });
    return result;
  });




module.exports = router