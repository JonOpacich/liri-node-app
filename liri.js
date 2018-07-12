let dotenv = require("dotenv").config();
let keys = require("./keys.js");
let Twitter = require('twitter');
let Spotify = require('node-spotify-api');
let request = require('request');
let fs = require('fs');

let params = process.argv[2];
let query = process.argv[3];



let spotifyClient = new Spotify(keys.spotify);
let twitterClient = new Twitter(keys.twitter);

//determine which API to use
let switchCase = ()=> {
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
}
switchCase();


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
        if (query == undefined) {
            query = 'Mr+Nobody';
        }
        request(`http://www.omdbapi.com/?t=${query.trim().replace(" ", "+")}&apikey=trilogy`, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                let res = JSON.parse(body);
                let rating = parseFloat(res.Ratings[0].Value);
                //added if-elseif console.logs for some fun AI-style banter
                if (rating < 5) {
                    console.log("Hmm, seems like the critics aren't fans of " + res.Title)
                }
                else if (rating >= 5 && rating < 8) {
                    console.log("Looks like a good movie to me! I can't see and all, but I hear good things. Also I can't hear.")
                }
                else if (rating >= 8) {
                    console.log(`WOW ${res.Title} reviewed well. Do yourself a favor and watch it!`)
                }
                console.log(`=====================================================================================================
    Title: ${res.Title}
    Release date: ${res.Released}
    Rating(IMDB): ${res.Ratings[0].Value}
    Rating(Rotten Tomatoes): ${res.Ratings[1].Value}
    Country: ${res.Country}
    Lang: ${res.Language}
    Plot: ${res.Plot}
    Cast: ${res.Actors}
=====================================================================================================`);
            }
            else {
                console.log('error:', error); // Print the error if one occurred
            }
        });
    }

    function txtCommand() {
        fs.readFile('./random.txt', 'utf8', (err, data) => {
            if (err) throw err;
            data=data.split(',');
            params=data[0];
            query=data[1];
            switchCase();
        });
    }