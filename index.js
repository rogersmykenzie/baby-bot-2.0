//libs
require('dotenv').config(); //setup dotenv
const Discord = require('discord.js');
const moment = require('moment');
//internal imports
const { Command, Baby } = require('./controllers/classController');
const { addQuote, getQuote } = require('./controllers/fileController');
const { getMemes } = require('./controllers/functionController');
const HangmanGame = require('./controllers/classes/hangman');
// const { createHangmanImage } = require('./assets/hangmen');
//globals
const client = new Discord.Client(); //setup discord client
const baby = new Baby(client); //setup baby
let hangmanGame = null;
let currentGameHost = {};
let waitingForWord = false;
let gameChannelID = null;
client.on('message', message => {
  //on message
  const { content: messageContent } = message;
  if (
    message.author.id === currentGameHost.id &&
    hangmanGame === null &&
    waitingForWord === true
  ) {
    if (messageContent.length < 20) {
      console.log(messageContent[0].toLowerCase().charCodeAt(0));
      const index = messageContent.split('').findIndex(val => {
        return (
          (val.toLowerCase().charCodeAt(0) < 97 ||
            val.toLowerCase().charCodeAt(0) > 122) &&
          val !== ' '
        );
      });
      if (index !== -1) {
        baby.tell(currentGameHost, 'Please only use letters and spaces');
      } else {
        hangmanGame = new HangmanGame(
          message.author,
          messageContent,
          message.channel.id
        );
        waitingForWord = false;
        console.log(gameChannelID);
        baby.say(hangmanGame.createHangmanImage(), gameChannelID);
      }
    } else {
      baby.tell(currentGameHost, 'Sorry, that word is too long. ');
    }
  }
  //check for command
  if (
    //   /*********** deletes reddit-bots messages **********/
    //   message.author.id === '537728879297822720'
    //   /*********** deletes luis' messages ***********/
    //   // ||
    // message.author.id === '143573197298728960'
  ) {
    message.delete();
    return;
  }
  /************ Checks if message was a command ***********/
  if (messageContent.trim().startsWith('!baby')) {
    const userCommand = new Command(messageContent);
    switch (userCommand.command.toLowerCase()) {
      case 'secretcry':
        baby.startCrying();
        break;
      case 'feed':
        baby.stopCrying();
        break;
      case 'addquote':
        /************************ uncomment for link filtering **************************/
        // if (
        //   !userCommand.arguments.join(' ').includes('http') &&
        //   !userCommand.arguments.join(' ').includes('base64')
        // )
        // {
        let error = addQuote(userCommand.arguments.join(' '));
        if (error !== undefined) {
          baby.say(
            `Oopsie Poopsie! I can't do that because ${error}`,
            message.channel.id
          );
        } else {
          baby.say('Okie Dokie :3', message.channel.id);
        }
        /************************ uncomment for link filtering **************************/
        // } else {
        //   baby.say('Thats too big for me to wemembuh :P', message.channel.id);
        // }
        break;
      case 'getquote':
        baby.say(getQuote(), message.channel.id);
        break;
      case 'meme':
        if (userCommand.arguments[0] === 'random') {
          getMemes(userCommand.arguments[1])
            .then(response => {
              console.log(response.data.status_code);
              if (response.data.status_code !== 200) {
                baby.say('Baby no find subweddit', message.channel.id);
              } else {
                baby.say(
                  `${response.data.title}:\n${response.data.url}`,
                  message.channel.id
                );
              }
            })
            .catch(e => console.log(e.message));
        }
        break;
      case 'roulette':
        baby.say(
          "Wow! You found a command that isn't shipped yet! Spoilers...",
          message.channel.id
        );
      case 'hangman':
        if (userCommand.arguments[0] === 'play') {
          if (hangmanGame === null) {
            //if there is not already a hangman game
            baby.tell(
              message.author,
              'What word would you like to use? Please pick one that is 20 characters or less.'
            ); //ask the host what word they want to use
            baby.say(
              'Ok! I have sent you a PM asking you to decide the word for the game!',
              message.channel.id
            );
            currentGameHost = message.author; //set their id as the current game host id
            waitingForWord = true;
            gameChannelID = message.channel.id;
          } else {
            //if there is already a hangman game
            baby.say(
              //tell them there is a hangman game already
              'There is currently a game in progress. Please finish the current game and then try again.',
              message.channel.id
            );
          }
        }
        break;
      // if (userCommand.arguments[0] === 'guess') {
      //   console.log(userCommand.arguments[1]);
      //   baby.say(
      //     hangmanGame.guess(userCommand.arguments[1]),
      //     message.channel.id
      //   );
      //   baby.say(hangmanGame.createHangmanImage(), message.channel.id);
      //   if (hangmanGame.checkSolution()) {
      //     baby.say(
      //       `Congrats! ${message.author.username} Wins!`,
      //       message.channel.id
      //     );
      //     hangmanGame = null;
      //     currentGameHost = {};
      //     gameChannelID = null;
      //   }
      //   if (hangmanGame && hangmanGame.isGameOver()) {
      //     baby.say(
      //       `Game Over :( The word was ${hangmanGame.getWord()}`,
      //       message.channel.id
      //     );
      //     hangmanGame = null;
      //     currentGameHost = {};
      //     gameChannelID = null;
      //   }
      // }
      case 'guess':
        try {
          baby.say(
            hangmanGame.guess(userCommand.arguments[0]),
            message.channel.id
          );
          baby.say(hangmanGame.createHangmanImage(), message.channel.id);
          if (hangmanGame.checkSolution()) {
            baby.say(
              `Congrats! ${message.author.username} Wins!`,
              message.channel.id
            );
            hangmanGame = null;
            currentGameHost = {};
            gameChannelID = null;
          }
          if (hangmanGame && hangmanGame.isGameOver()) {
            baby.say(
              `Game Over :( The word was ${hangmanGame.getWord()}`,
              message.channel.id
            );
            hangmanGame = null;
            currentGameHost = {};
            gameChannelID = null;
          }
        } catch (e) {
          console.log(e);
        }
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
