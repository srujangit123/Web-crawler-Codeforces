const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cheerio = require("cheerio");
const request = require("request");
const app = express();



app.use(bodyParser.urlencoded({ extended: false }));


request('https://codeforces.com/contest/102/submission/76941149', (error, response, html) => {
    // Checking that there is no errors and the response code is correct
    if(!error && response.statusCode === 200){
        // Declaring cheerio for future usage
        const $ = cheerio.load(html);
        console.log($('#program-source-text').text().replace(/\s\s+/g, ' '));
    }
});
