let dotenv = require("dotenv").config();
let keys = require("./keys.js");
let Twitter = require('twitter');
let Spotify = require('node-spotify-api');
let params = process.argv[2];
let query = process.argv[3];


let spotifyClient = new Spotify(keys.spotify);
let twitterClient = new Twitter(keys.twitter);

//determine which API to use
switch (params) {
    case "my-tweets":
        twitter();
        break;
    case "spotify-this-song":
        spotify();
        break;
    case "movie-this":
        omdb();
        break;
    case "do-what-it-says":
        txtCommand();
        break;
    default:
        console.log("I'm sorry. I'm still learning and don't know that command yet. Please try again.");
}


function twitter() {
    twitterClient.get('statuses/user_timeline', { screen_name: 'jonopacich15', count: '20' }, function (error, tweets, response) {
        if (!error && response.statusCode === 200) {
            console.log('Okay, I can do that! Here are your 20 most recent tweets:');
            console.log('======================================================================================');
            for (i = 0; i < tweets.length; i++) {
                console.log('#' + (i + 1) + ': "' + tweets[i].text + "\" - posted on: " + tweets[i].created_at);
            }
            console.log('======================================================================================');
        }
        else {
            console.log(error);
        }
    })
};

function spotify() {
    spotifyClient.search({ type: 'track', query: query, limit: '1' }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log(`Here's what I've got on ${query}:`);
        console.log('======================================================================================');
        console.log("Artist(s): " + data.tracks.items[0].artists[0].name);
        console.log("Name: " + data.tracks.items[0].name);
        console.log("Album: " + data.tracks.items[0].album.name);
        console.log(`Preview: ${data.tracks.items[0].preview_url}`);
        console.log('======================================================================================');
    })
}

function omdb() {
    //code block
}

function txtCommand() {
    //code block
}