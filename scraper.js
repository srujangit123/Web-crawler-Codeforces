const cheerio = require("cheerio");
const axios = require("axios");


const scrapeSolutions = async (results, archive) => {
    for (const result of results) {
        if(result.verdict === 'OK') {
          const solutionPage = await axios.get(`https://codeforces.com/contest/${ result.contestId }/submission/${result.id}`);
          const $ = cheerio.load(solutionPage.data);
          
          try {
            await archive.append($('#program-source-text').text(), {name: result.problem.name + ".cpp"})
          }
          catch(err) { 
            console.log(err) 
          }
        }
    }
}
module.exports = {scrapeSolutions}