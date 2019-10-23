//libs
const Discord = require('discord.js');
const moment = require('moment');
//internal imports
const { Command, Baby } = require('./controllers/classController');
//globals
const client = new Discord.Client();
const baby = new Baby(client);

client.on('message', message => {
  const { content: messageContent } = message;
  //check for command
  if (messageContent.trim().startsWith('!baby')) {
    const userCommand = new Command(messageContent);

    switch (userCommand.command.toLowerCase()) {
      case process.env.CRY_FUNCTION:
        baby.startCrying();
        break;
      case 'feed':
        baby.stopCrying();
        break;
    }
  }
});

setInterval(() => {
  const isReduced = moment().hour() >= 1 && moment().hour() <= 8;
  const chance = Math.floor(Math.random() * 100);
  if (
    (chance < 15 && isReduced === false) ||
    (chance < 6 && isReduced === true)
  ) {
    baby.startCrying();
  }
}, 1000 * 60 * 60);

client.login(process.env.DISCORD_TOKEN).then(() => {
  console.log(`You woke the baby up.`);
});
