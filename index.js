const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cheerio = require("cheerio");
const fs = require("fs");
const ejs = require("ejs");
const archiver = require("archiver");
const fse = require("fs-extra");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

app.get("/", (req, res)=> {
  res.render("home");
})

app.post("/", (req, res) => {
    req.setTimeout(0); // 
     const usernameorhandle = req.body.userName;
      var solndir = __dirname + "/" + req.body.usernameorhandle;
      if (!fs.existsSync(__dirname + "/" + usernameorhandle)){
        fs.mkdirSync(__dirname + "/" + usernameorhandle, (err) => {
            if(err){
              console.log(err);
            }
            else {
              console.log(usernameorhandle + " folder created in root directory.");
            }
          });
      }

    //   var output = fs.createWriteStream(__dirname + '/solutions.zip');
      var archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
      });
      archive.on('end', function() {
        console.log('Archive wrote %d bytes', archive.pointer());
        });
      res.attachment("Problems.zip");
      archive.pipe(res);
      getstatus(usernameorhandle, archive).then ( ()=> {

            // archive.on('end', function() {
            // console.log('Archive wrote %d bytes', archive.pointer());
            // });
        //   res.attachment(__dirname + "/" + usernameorhandle, 'Codeforces-Solutions'); // Name of zip file
        //   archive.pipe(res);
        //   archive.directory(__dirname + "/" + usernameorhandle , 'Codeforces-Solutions');
          archive.finalize();
          })
})

async function getstatus(handle, archive) {

  const response = await axios.get("https://codeforces.com/api/user.status?handle=" + handle + "&from=1")

  if(response.data.status === 'OK') {

    let results = response.data.result;

    try {
      await scrape(results, handle, archive);
      console.log("DONE " + handle + " solutions downloaded");
    }
    catch(error) {
      console.log(error);
    }
  }
}


async function scrape(results, handle, archive) {
  for (const result of results) {
    if(result.verdict === 'OK') {
      const solutionPage = await axios.get("https://codeforces.com/contest/" + result.contestId + "/submission/" + result.id);
      const $ = cheerio.load(solutionPage.data);
    //   const path = __dirname + "/" + handle + "/" +  result.problem.name + ".cpp";
      try {
        // await fs.promises.writeFile(path, $('#program-source-text').text());
        // console.log("Saved file");
        // archive.file(result.problem.name + ".cpp", {name: result.problem.name + ".cpp"});
        await archive.append($('#program-source-text').text(), {name: result.problem.name + ".cpp"})
        console.log("saved file");
      } catch(err) { console.log(err) }
    }
  }
}

app.listen(PORT, () => 
  console.log(`Listening on ${ PORT }`));