const axios = require('axios');

async function getMemes(subreddit = 'meirl') {
  const baseURL = `https://meme-api.herokuapp.com/gimme/${subreddit}`;
  return axios(baseURL);
}

module.exports = {
  getMemes
};
