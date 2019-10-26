const fs = require('fs');

function addQuote(quote) {
  const str = fs.readFileSync(`${__dirname}/../assets/quotes.baby`);
  fs.writeFile(
    `${__dirname}/../assets/quotes.baby`,
    `${str}\n${quote}`,
    err => {
      if (err) {
        console.log(`oopsie doopsie\n${err}`);
      }
    }
  );
}

function getQuote() {
  const str = fs.readFileSync(`${__dirname}/../assets/quotes.baby`);
  const quotes = str.toString().split('\n');
  const index = Math.floor(Math.random() * quotes.length);
  return quotes[index];
}

module.exports = {
  addQuote,
  getQuote
};
