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

var db = require("../models");

//Routes
router.get("/scrape", function (req, res) {
  var result = [];
  axios.get("https://www.apnews.com/apf-topnews").then(function (response) {
    var $ = cheerio.load(response.data);

    const articles = $("div.FeedCard");

    articles.each(function (i, element) {
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

router.get("/articles", function (req, res) {
  
  axios.get("https://www.apnews.com/apf-topnews").then(function (response) {
    var $ = cheerio.load(response.data);

    const articles = $("div.FeedCard");

    articles.each(function (i, element) {
      var result = {};
      result.title = $(element)
        .find("div.CardHeadline")
        .children("a")
        .text();
      articleLink = $(element)
        .find("div.CardHeadline")
        .children("a")
        .attr("href");
        result.link = `https://www.apnews.com${articleLink}`;
        result.summary = $(element)
        .find("div.c0112")
        .children("p")
        .text();

        db.Article.create(result)
        .then(function (dbArticle) {
          console.log(dbArticle);
        })
        .catch(function (err) {
          console.log(err);
        });

     
    });
    res.send("Scrape Complete");
  });

});

// router.get("/scraped", function (req, res) {
//     var result = {}
//   axios.get("https://www.apnews.com/apf-topnews").then(function (response) {
//     var $ = cheerio.load(response.data);

//     const articles = $("div.FeedCard");

//     articles.each(function (i, element) {

//       result.title = $(this)
//         .find("div.CardHeadline")
//         .children("a")
//         .text();
//       result.articleLink = $(this)
//         .find("div.CardHeadline")
//         .children("a")
//         .attr("href");
//       link = `https://www.apnews.com${articleLink}`;
//       result.summary = $(this)
//         .find("div.c0112")
//         .children("p")
//         .text();

//       db.Article.create(result)
//         .then(function (dbArticle) {
//           console.log(dbArticle);
//         })
//         .catch(function (err) {
//           console.log(err);
//         });

//         return res.json(dbArticle)
//     });
//    return dbArticle
//   });
// });

// router.get("/all", function (req, res) {
//   db.Article.find({})
//     .then(function (dbArticle) {
//       // If we were able to successfully find Articles, send them back to the client
//       res.json(dbArticle);
//     })
//     .catch(function (err) {
//       // If an error occurred, send it to the client
//       res.json(err);
//     });
// })


module.exports = router