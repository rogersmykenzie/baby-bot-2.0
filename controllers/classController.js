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
    return this.segmentedCommand.slice(1).map(val => val.toLowerCase());
  }
}

class Baby {
  constructor(client) {
    this.client = client;
    this.timerName = '';
    this.isCrying = false;
  }

  cry() {
    this.client.channels.get(process.env.THE_CRADLE_ID).send('WAH!');
  }

  startCrying() {
    if (this.isCrying === false) {
      this.isCrying = true;
      this.timerName = setInterval(() => {
        this.cry();
      }, 3000);
    }
  }

  stopCrying() {
    if (this.isCrying === true) {
      this.isCrying = false;
      const name = this.timerName;
      clearInterval(name);
      this.client.channels.get(process.env.THE_CRADLE_ID).send('*suck suck*');
    }
  }

  say(message, channelID = process.env.THE_CRADLE_ID) {
    try {
      this.client.channels.get(channelID).send(message);
    } catch (e) {
      return {
        error: e.message
      };
    }
  }

  tell(user, message) {
    user.send(message);
  }
}

module.exports = {
  Command,
  Baby
};
