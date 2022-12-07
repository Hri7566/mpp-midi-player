const Client = require('mppclone-client');

module.exports = class Bot {
    constructor(client) {
        // this.proxy = token;
        this.keyMap = require('./keyMap.json');
        // this.client = new Client(uri, token);
        // console.log(uri, token)

        this.client = client;
    }

    start(channel, botName) {
        this.client.start();
        this.client.setChannel(channel);
        if (botName) this.client.sendArray([{ m: "userset", set: { name: botName } }]);
    }

    mouseMove(x, y) {
        this.client.sendArray([{ m: "m", x: x, y: y }]);
    }

    setChannel(channel, set) {
        this.client.sendArray([{ m: "ch", _id: channel, set: set }]);
    }

    octaveStart(note, octaveAmount, echo, velocity, echoAmount, echoDelay) {
        for (let i = 1; i <= octaveAmount; i++) {
            if (typeof(note) == 'undefined') return;
            let n = this.keyMap[Object.keys(this.keyMap)[Object.keys(this.keyMap).indexOf(note) + (i * 12)]];
            this.playNote(n, velocity);
            if (echo == true) {
                this.echoNote(n, velocity, echoAmount, echoDelay);
            }
        }
    }

    octaveStop(note, octaveAmount) {
        for (let i = 1; i <= octaveAmount; i++) {
            this.client.sendArray([{ m: "n", n: [{ n: note + (i * 12), s: 1 }], t: Date.now() + 1000 }]);
        }
        return note;
    }

    playNote(note, velocity) {
        this.client.sendArray([{ m: "n", n: [{ n: note, v: velocity }], t: Date.now() + 1000 }]);
    }

    stopNote(note) {
        this.client.sendArray([{ m: "n", n: [{ n: note, s: 1 }], t: Date.now() + 1000 }]);
    }

    sendChat(message) {
        this.client.sendArray([{ m: "a", message: message }]);
    }

    echoNote(note, velocity, echoAmount, echoDelay) {
        let delay = 30;
        for (var j = 0; j < echoAmount; j++) {
            setTimeout(() => {
                velocity *= 0.5;
                this.client.sendArray([{ m: "n", n: [{ n: note, v: velocity }], t: Date.now() + 1000 }]);
            }, echoDelay * (j + delay));
            delay *= 2;
        }
    }

    progressBar(player) {
        this.client.sendArray([{ m: "m", x: 100 - (((player.totalTicks - player.getCurrentTick()) / player.division / player.tempo * 60) / player.getSongTime() * 100), y: 15.07 }]);
    }

    resetCursor() {
        this.client.sendArray([{ m: "m", x: 3.13, y: 15.07 }]);
    }

    crownSolo() {
        this.client.sendArray([{ m: 'chset', set: { crownsolo: true } }]);
    }
}