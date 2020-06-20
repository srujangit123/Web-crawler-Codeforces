const axios = require("axios");
const { scrapeSolutions } = require("./scraper");

const getstatus = async (handle, archive) => {

    const api_response = await axios.get(`https://codeforces.com/api/user.status?handle=${handle}&from=1`)
  
    if(api_response.data.status === 'OK') {
      let results = api_response.data.result;
  
      try {
        await scrapeSolutions(results, archive);
      }
      catch(error) {
        console.log(error);
      }
    }
}

module.exports = {getstatus};