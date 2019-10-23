require('dotenv').config();

class Command {
  static splitMessage(message) {
    const commands = message.trim().split('!baby');
    commands.splice(0, 1);
    let segmentedCommands = commands
      .join('')
      .trim()
      .split(' ');
    return segmentedCommands;
  }

  constructor(userMessage) {
    this.userMessage = userMessage;
    this.segmentedCommand = Command.splitMessage(userMessage);
  }

  get command() {
    return this.segmentedCommand[0];
  }

  get arguments() {
    return this.segmentedCommand.slice(1);
  }
}

class Baby {
  constructor(client) {
    this.client = client;
    this.timerName = '';
  }

  cry() {
    this.client.channels.get(process.env.GENERAL_CHANNEL_ID).send('WAH!');
  }

  startCrying() {
    this.timerName = setInterval(() => {
      this.cry();
      console.log(this.timerName);
    }, 1000);
  }

  stopCrying() {
    const name = this.timerName;
    clearInterval(name);
    this.client.channels
      .get(process.env.GENERAL_CHANNEL_ID)
      .send('*suck suck*');
  }
}

module.exports = {
  Command,
  Baby
};
