const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cheerio = require("cheerio");
// const request = require("request");
const app = express();



app.use(bodyParser.urlencoded({ extended: false }));

// const handle = "geek23";
// const status = "https://codeforces.com/api/user.status?handle=" + handle + "&from=1";

// request(status, (err, response, body) => {
    
// })


// request('https://codeforces.com/contest/102/submission/76941149', (error, response, html) => {
//     // Checking that there is no errors and the response code is correct
//     if(!error && response.statusCode === 200){
//         // Declaring cheerio for future usage
//         const $ = cheerio.load(html);
//         console.log($('#program-source-text').text());
//     }


// });

setsolutions();
             function setsolutions(){
                let solutionlink = "https://codeforces.com/contest/1277/submission/76939947";
                // console.log(solutionlink);
                 axios.get(solutionlink)
                  .then(solutionPage => {
                    const html = solutionPage.data;
                    const $ = cheerio.load(html);
                    const solution = $('#program-source-text').text();
                    // console.log(solution);
                    // const path = "/home/srujan/Desktop/crawlerapp/Data/Problems/" + result.problem.name + ".cpp";
                    // fs.writeFile(path, solution, function(err){
                    //   if(err){
                    //     console.log(err);
                    //   }
                    //   else{
                    //     console.log("Saved files");
                    //   }
                    // })
                    console.log(solution);
                  })
                  .catch( error => {
                    console.log("HTML PARSE ERROR");
                  })


                  console.log("Done");
            }
