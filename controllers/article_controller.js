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
        byline = $(element)
        .find("div.signature")
        .children("span")
        .html()
        date = $(element)
        .find("div.signature")
        .children()
        .eq(1)
        .html()
        image = $(element)
        .find("div.c0114")
        .attr("src")

      result.push({
        title: title,
        link: link,
        summary: summary,
        byline: byline,
        date: date,
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
      result.byline = $(element)
      .find("div.signature")
      .children("span")
      .html()
       result.image = $(element)
       .find("div.c0114")
       .eq(1)
       .attr("src")
        result.date = $(element)
        .find("div.signature")
        .children()
        .eq(1)
        .html()
      db.Article.create(result)
        .then(function (dbArticle) {
          console.log(dbArticle);
        })
        .catch(function (err) {
          console.log(err);
        });


    });
    res.redirect("/all")
  });

});

router.get("/api/all", function (req, res) {
  db.Article.find({})
    .then(function (dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.send(dbArticle)
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });

})

router.get("/all", function(req, res) {
  db.Article.find({})
  .then(function (data) {
    // If we were able to successfully find Articles, send them back to the client
    res.render("index", {dbArticle: data})
  })
  .catch(function (err) {
    // If an error occurred, send it to the client
    res.json(err);
  }); 

});

router.get("/", function(req, res) {
 res.render("intro")
});

// router.get("/api/all/faves", function(req, res){
//   db.Article.find({})
//   .then(function(data){
//   res.send(data)
//   })
//   })

router.put("/all", function(req, res){
  var id = req.body.id
  console.log(req.body.id)
  db.Article.updateOne({_id: id}, {$set: {favorite: true} })
  .then(function(data){
  res.json(data)
  })
  })

router.get("/saved", function(req, res){
  db.Article.find({favorite: true})
  .then(function(data){
    res.render("favorite", {dbArticle: data})
  })
})


router.delete("/delete", function(req, res){
  var id = req.body.id
  console.log(req.body.id)
  db.Article.deleteOne({_id: id}, function(err){
    console.log(err)
  })
})

router.get("/article/:id", function(req, res) {

var id = req.params.id
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: id})
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.render("/saved", {dbArticle: data})

    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

router.post("/articles/:id", function(req, res) {

  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function(dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(data) {
      // If we were able to successfully update an Article, send it back to the client
      res.send(data);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});
// router.get("articles/:id", function(req, res){
//   var id = req.body.id
//   console.log(req.body.id)
//   db.Article.findOne({_id: id}, function(err){
//     console.log(err)
//   })
//   .populate("note")
//   .then(function(dbArticle){
//     res.send(dbArticle)
//   })
//   .catch(function(err){
//     res.json(err)
//   })
// })

// router.post("/articles/:id", function(req, res){
//   var id = req.body.id
//   db.Note.create(req.body)
//   .then(function(dbNote){
//     return db.Article.findOneAndUpdate({_id: id}, {note: newNote._id}, {new: true})
//   })
//   .then(function(dbArticle){
//     res.json(dbArticle);
//   })
//   .catch(function(err){
//     res.json(err)
//   })
// })

module.exports = router

