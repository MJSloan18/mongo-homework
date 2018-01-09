//INTIAL SCRAPE CODE. ONLY SCRAPED TITLES AND LINKS TO ARTICLES BUT DID NOT LOAD THEM INTO THE SCRAPE MONGO DATABASE. SEE CODE BELOW FOR DESIRED RESULT!!!

// var cheerio = require("cheerio");
// var request = require("request");
// // Make a request call to grab the HTML body from the site of your choice
// request("http://www.businessinsider.com/", function(error, response, html) {

//     // Load the HTML into cheerio and save it to a variable
//     // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
//     var $ = cheerio.load(html);

//     // An empty array to save the data that we'll scrape
//     var results = [];

//     // Select each element in the HTML body from which you want information.
//     // NOTE: Cheerio selectors function similarly to jQuery's selectors,
//     // but be sure to visit the package's npm page to see how it works
//     $("h2.overridable").each(function(i, element) {
//         console.log("It's alive!!");

//         var link = $(element).children().attr("href");
//         var title = $(element).children().text();

//         // Save these results in an object that we'll push into the results array we defined earlier
//         results.push({
//             title: title,
//             link: link
//         });
//     });

//     // Log the results once you've looped through each of the elements found with cheerio
//     console.log(results);
// });

//=====================================================

//CODE THAT LOGS SCRAPED DATA INTO THE SCRAPE DATABASE VIA MONGO...

var express = require("express");
var mongojs = require("mongojs");

var request = require("request");
var cheerio = require("cheerio");


var app = express();

// Database configuration
var databaseUrl = "business-insider";
var collections = ["scrape"];


var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

// Main -- Displays articles brought in from BI.com
app.get("/", function(req, res) {
  res.send(
    "<h1>Latest Articles from Business Insider</h1> " +

    "<h2>Like these articles? Save them for later!</h2>" +

    "<button>Save Article</button>" +

    "<button>Delete Article</button>");
});

// Retrieve data from the business-insider mongo database
app.get("/all", function(req, res) {
  // Find all results from the business-insider collection in mongo (scrape is database name)
  db.scrape.find({}, function(error, found) {
    // Throw any errors to the console
    if (error) {
      console.log(error);
    }
    // If there are no errors, send the data to the browser as json
    else {

      res.json(found);
    }
  });
});

// Scrape data from BI.com and place into business-insider db on mongo
app.get("/scrape", function(req, res) {
  // Make a request for the news section of ycombinator
  request("http://www.businessinsider.com/", function(error, response, html) {
    // Load the html body from Business Insider
    var $ = cheerio.load(html);
    // For each element with a "title" class
    $("h2.overridable").each(function(i, element) {
      // Save the text and href of each link enclosed in the current element
      var title = $(element).children().text();
      var link = $(element).children().attr("href");
      var summary = "Summary of article";
      var image = $(element).parent().attr("src");


      if (title && link && summary) {
        // Insert the data in the scrape database under the business-insider collection in mongo
        db.scrape.insert({
            title: title,
            link: link,
            summary: summary,
            image: image,
          },
          function(err, inserted) {
            if (err) {
              // Log the error if one is encountered during the query
              console.log(err);
            }
            else {
              console.log(inserted);
            }
          });
      }
    });
  });

  // Send a "Scrape Complete" message to the browser
  res.send("Business Insider Scrape Complete. To view information in your terminal, add scrape to the end of the url in your browser");
});

//Set to port 8080 for Cloud 9 
var PORT = 8080;
app.listen(PORT, function() {
  console.log("Application is running on port " + PORT + "!!");
});
