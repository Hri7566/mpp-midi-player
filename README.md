# mpp-midi-player

A simple to use MIDI player for [Multiplayer Piano](https://www.multiplayerpiano.net/).

### How to use
```js
const Bot = require('mpp-midi-player');

var uri = 'wss://www.multiplayerpiano.net:8080';
var proxy = "";
var channel = "test/awkward";

const bot = new Bot(uri, proxy);
bot.start(channel);

var keyNameMap = require('./key-map');
var MidiPlayer = require('midi-player-js');

var Player = new MidiPlayer.Player(function(event) {
    if (event.name == "Note off" || (event.name == "Note on" && event.velocity === 0)) {
        bot.stopNote(keyNameMap[event.noteName]);
    } else if (event.name == "Note on") {
        bot.playNote(keyNameMap[event.noteName], event.velocity / 127);
    } else if (event.name == "Set Tempo") {
        Player.setTempo(event.data);
    }
});

```

You can do things like:
```js
if (Player.isPlaying()) {
    bot.progressBar(Player); //This simulates a progressbar with the mouse
}; 
```

Usages:
```js
// Starts the bot in a specific channel
bot.start('channel name');

// Sets the bot's channel
bot.setChannel('channel name');

// Moves the mouse to a specific position using x and y
bot.mouseMove(x, y);

// "true" can be set to false to disable echo on octave
bot.octaveStart(note, octaveAmount, true, velocity, echoAmount, echoDelay);

// octaveAmount has to be set the same as the octaveAmount on octaveStart
bot.octaveStop(note, octaveAmount);

// Plays a note e.g: a-1
bot.playNote(note, velocity);

// Stops a note that is being played e.g: a-1
bot.stopNote(note);

// Sends a message to chat
bot.sendChat('your message here');

// Echos notes
bot.echoNote(note, velocity, echoAmount, echoDelay);

// Resets the cursor position
bot.resetCursor();

// Makes it so only owner can play the piano
bot.crownSolo();
```

Requirements: [key-map.json](https://download1589.mediafire.com/sv6s1g0tpztg/uwoq2mfzejh6zru/key-map.json), [midi-player-js](https://www.npmjs.com/package/midi-player-js) and [mpp-client-xt](https://www.npmjs.com/package/mpp-client-xt).

If you have any questions or any problems contact: phoenixacc11@gmail.com

