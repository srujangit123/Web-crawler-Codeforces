const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cheerio = require("cheerio");
const fs = require("fs");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));


let contestID = "";
let solutionID = "";
let handle = "geek23";

const status = "https://codeforces.com/api/user.status?handle=" + handle + "&from=1";

var submissions;
let correctanswerssubmiited = 0;
axios.get(status)
  .then(response => {
    submissions = response.data;
    // console.log(submissions);
    if(submissions.status === 'OK'){
      // console.log(submissions);
      let results = submissions.result;
      results.forEach(result => {
        if(result.verdict === 'OK'){
          correctanswerssubmiited++;
          let solutionID = result.id;
          let contestID = result.contestId;
          let solutionlink = "https://codeforces.com/contest/" + contestID + "/submission/" + solutionID;
          // console.log(solutionlink);
          axios.get(solutionlink)
            .then(solutionPage => {
              const html = solutionPage.data;
              const $ = cheerio.load(html);
              const solution = $('#program-source-text').text();
              // console.log(solution);
              const path = "/home/srujan/Desktop/crawlerapp/Problems/" + result.problem.name + ".cpp";
              fs.writeFile(path, solution, function(err){
                if(err){
                  console.log(err);
                }
                else{
                  console.log("Saved files");
                }
              })
            })
            .catch( error => {
              console.log("HTML PARSE ERROR");
            })
        }

      })
    }
    else {
      console.log(submissions.comment);
    }
    console.log("Correct answers submitted till now is" + correctanswerssubmiited);
  })
  .catch(error => {
    // handle error
    console.log(error);
  });

//
