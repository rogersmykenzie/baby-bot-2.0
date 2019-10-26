module.exports = class Hangman {
  constructor(host, word, channelID) {
    this.host = host;
    this.word = word.toLowerCase();
    this.displayWord = word
      .split(' ')
      .map(val => '_'.repeat(val.length))
      .join(' ');
    this.channelID = channelID;
    this.numParts = 0;
    this.usedLetters = [];
    console.log(this.word, this.displayWord);
  }

  createHangmanImage() {
    const { numParts: n } = this;
    const numSpaceOnEitherSide = Math.floor((20 - this.displayWord.length) / 2);
    let newPhrase =
      ' '.repeat(numSpaceOnEitherSide) +
      this.displayWord +
      ' '.repeat(numSpaceOnEitherSide);
    if (this.displayWord.length % 2 === 1) {
      newPhrase += ' ';
    }
    return `\`\`\`                                 | usedLetters: [${this.usedLetters.join(
      ','
    )}]
                                 |
                                 |
            _____                |
           |     |               |
           ${n >= 1 ? 'O' : ' '}     |               |
          ${n >= 3 ? '/' : ' '}${n >= 2 ? '|' : ' '}${
      n >= 4 ? '\\' : ' '
    }    |               |
           ${n >= 5 ? '|' : ' '}     |               |
          ${n >= 6 ? '/' : ' '} ${n >= 7 ? '\\' : ' '}    |               |
            _____|____           |
                                 |
                                 |
                                 |
       ${newPhrase}      |
                                 |
_________________________________|
    \`\`\``;
  }

  guess(letter) {
    if (letter.length === 1) {
      if (this.usedLetters.includes(letter)) {
        return 'That letter has already been guessed';
      }
      if (
        letter.toLowerCase().charCodeAt(0) < 97 ||
        letter.toLowerCase().charCodeAt(0) > 122
      ) {
        return 'Please guess something that is a letter';
      }

      let indexes = [];
      for (let i = 0; i < this.word.length; i++) {
        if (this.word[i] === letter) {
          indexes.push(i);
        }
      }
      indexes.forEach(val => {
        this.displayWord =
          this.displayWord.substring(0, val) +
          letter +
          this.displayWord.substring(val + 1);
      });
      console.log(indexes);
      if (indexes.length === 0) {
        this.numParts += 1;
      }
      this.usedLetters.push(letter.toLowerCase());
      // baby.say(this.channelID, 'This is too long for a guess. Try again');
    } else {
      return 'Please guess one letter';
    }
  }

  checkSolution() {
    return this.displayWord === this.word;
  }

  isGameOver() {
    return this.numParts >= 7;
  }

  getWord() {
    return this.word;
  }
};
