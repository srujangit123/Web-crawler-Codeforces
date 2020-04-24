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

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

app.get("/", (req, res)=> {
  res.render("home");
})

app.post("/", (req, res) => {
      const usernameorhandle = req.body.userName;
      getstatus(usernameorhandle).then ( ()=> {
          var output = fs.createWriteStream(__dirname + '/Data/solutions.zip');
          var archive = archiver('zip', {
            zlib: { level: 9 } // Sets the compression level.
          });
          output.on('close', function() {
            console.log(archive.pointer() + ' total bytes');
            console.log('archiver has been finalized and the output file descriptor has closed.');
          });
          output.on('end', function() {
            console.log('Data has been drained');
          });
          res.attachment(__dirname + "/Data/Problems", 'Codeforces-Solutions');
          archive.pipe(res);
          archive.directory(__dirname + "/Data/Problems", 'Codeforces-Solutions');
          archive.finalize()
          .then( async ()=> {
            fs.unlink(__dirname + "/Data/solutions.zip", (err) => {
              if(err) throw err;
              console.log("Deleted solutions.zip file");
              const directory = __dirname + "/Data/Problems";

              fs.readdir(directory, (err, files) => {
                if (err) throw err;
            
                for (const file of files) {
                  fs.unlink(path.join(directory, file), err => {
                    if (err) throw err;
                  });
                }
              });
            });

          })
          
          // fse.emptyDir(__dirname + "/Data/Problems", err => {
          //   if(err) return console.log(err);

          //   console.log("Deleted all problem files");
          // })
          // deletefiles();
          // fse.emptyDirSync(__dirname + "/Data/Problems");
        })
        //deleting only zip file works fine
})

async function getstatus(handle) {

  const response = await axios.get("https://codeforces.com/api/user.status?handle=" + handle + "&from=1")

  if(response.data.status === 'OK') {

    let results = response.data.result;

    try {
      await scrape(results);
      console.log("DONE " + handle + " solutions downloaded");
    }
    catch(error) {
      console.log(error);
    }
  }
}


async function scrape(results) {
  for (const result of results) {
    if(result.verdict === 'OK') {
      const solutionPage = await axios.get("https://codeforces.com/contest/" + result.contestId + "/submission/" + result.id);
      const $ = cheerio.load(solutionPage.data);
      const path = "/home/srujan/Desktop/crawlerapp/Data/Problems/" + result.problem.name + ".cpp";
      try {
        await fs.promises.writeFile(path, $('#program-source-text').text());
        console.log("Saved file");
      } catch(err) { console.log(err) }
    }
  }
}
 function deletedata(){
  fs.unlink(__dirname + "/Data/solutions.zip", (err) => {
    if(err) throw err;
    console.log("Deleted solutions.zip file");
  })

  const directory = __dirname + "/Data/Problems";

  fs.readdir(directory, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(path.join(directory, file), err => {
        if (err) throw err;
      });
    }
  });
}

app.listen(3000, () =>{
  console.log("server running on port 3000");
});