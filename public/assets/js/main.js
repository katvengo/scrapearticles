// // Grab the articles as a json
// $.getJSON("/", function(data) {
//     console.log(data)
//      // For each one 
//       // for (var i = 0; i < data.length; i++) {
//     //   // Display the apropos information on the page
//     // //   $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
//     // }
//   });

$(document).ready(function(){
    $(".navbar-burger").click(function(){
        $(".navbar-burger").toggleClass("is-active");
        $(".navbar-menu").toggleClass("is-active");
  
    })
})



