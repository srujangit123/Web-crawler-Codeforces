const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const archiver = require("archiver");
const app = express();
const PORT = process.env.PORT || 3000;

const { getstatus } = require("./apicall");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));


app.get("/", (req, res) => {
  res.render("home");
});


app.post("/", async (req, res) => {
     const handle = req.body.userName;
      
      let archive = archiver('zip', {
        zlib: { level: 9 }
      });

      archive.on('end', () => {
        console.log('Archive wrote %d bytes', archive.pointer());
      });
      
      res.attachment("CF-Solutions.zip");
      
      archive.pipe(res);
      
      await getstatus(handle, archive);
      archive.finalize();
})


app.listen(PORT, () => 
  console.log(`Listening on ${ PORT }`));