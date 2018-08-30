require("dotenv").config();
var Spotify = require("node-spotify-api");
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
var command = process.argv[2];
var searchTerm = process.argv.slice(3).join(" ");
var request = require('request');
var fs = require("fs");

function liriSearch() {
    switch (command) {
        case "concert-this":
            if (searchTerm) concertSearch(searchTerm);
            else concertSearch("tune-yards");
            break;

        case "spotify-this-song":
            if (searchTerm) spotifySearch(searchTerm);
            else spotifySearch("Wuthering Heights");
            break;

        case "movie-this":
            if (searchTerm) movieSearch(searchTerm);
            else movieSearch("Shrek")
            break;

        case "do-what-it-says":
            doThing();

            break;

        default:
            console.log("\nPlease enter input in one of the following formats:\nnode liri.js concert-this <artist/band name here>\nnode liri.js spotify-this-song '<song name here>'\nnode liri.js movie-this '<movie name here>'\nnode liri.js do-what-it-says")
            break;
    }
}

function spotifySearch(song) {
    spotify.search({ type: 'track', query: song }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        var newData = data.tracks.items[0];
        console.log("-----------------------")
        console.log("Song:", newData.name);
        console.log("Artist:", newData.artists[0].name);
        console.log("Album:", newData.album.name);
        console.log("Song Preview:", newData.preview_url);
        console.log("-----------------------")
    });
}

function concertSearch(band) {
    var url = "https://rest.bandsintown.com/artists/" + band + "/events?app_id=codingbootcamp"
    request(url, function (error, response, body) {
        if (error) console.log('error:', error);

        var events = JSON.parse(body);
        console.log("-----------------------")
        events.forEach(element => {
            console.log('Venue:', element.venue.name);
            console.log('Location:', element.venue.city + ", " + element.venue.region + " " + element.venue.country);
            console.log('Date:', element.datetime);
            console.log("-----------------------");
        });
    });
}

function movieSearch(movie) {
    var url = "https://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
    request(url, function (error, response, body) {
        if (error) console.log('error:', error);

        body = JSON.parse(body);

        console.log("-----------------------");
        console.log('Title:', body.Title);
        console.log('Year:', body.Year);
        console.log('IMDb Rating:', body.Ratings[0].Value);
        console.log('Rotten Tomatoes Score:', body.Ratings[1].Value);
        console.log('Country:', body.Country);
        console.log('Language:', body.Language);
        console.log('Plot Summary:', body.Plot);
        console.log('Actors:', body.Actors);
        console.log("-----------------------");

    });
}

function doThing() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) return console.log(error);

        var dataArray = data.split(",");

        command = dataArray[0];
        searchTerm = dataArray[1];
        liriSearch();

    });

}

liriSearch();