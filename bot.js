require('dotenv').config();

const Bot = require('.');
const MidiPlayer = require('midi-player-js');
const Client = require('mppclone-client');

// let bot = new Bot('wss://mppclone.com:8443', process.env.MPPCLONE_TOKEN);
// bot.start('✧𝓓𝓔𝓥 𝓡𝓸𝓸𝓶✧');
const client = new Client('wss://mppclone.com:8443', process.env.MPPCLONE_TOKEN);
const bot = new Bot(client);

bot.client.start();
bot.client.setChannel('✧𝓓𝓔𝓥 𝓡𝓸𝓸𝓶✧');

const player = new MidiPlayer.Player(evt => {
    if (evt.channel == 10) return;
    // console.log(evt);
    switch (evt.name) {
        case 'Note off':
            bot.stopNote(bot.keyMap[evt.noteName]);
            break;
        case 'Note on':
            bot.playNote(bot.keyMap[evt.noteName], evt.velocity / 127);
            break;
        case 'Set Tempo':
            player.setTempo(evt.data);
            break;
    }
});

player.on('fileLoaded', () => {
    setTimeout(() => {
        player.play();
    }, 1500);
});

// player.on('playing', () => {
//     bot.progressBar(player);
// });

const readline = require('readline');
const { resolve, join } = require('path');
const { existsSync } = require('fs');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', input => {
    let args = input.split(' ');
    let argcat = input.substring(args[0].length).trim();
    let cmd = args[0].toLowerCase();

    switch (cmd) {
        case 'play':
        case 'p':
            try {
                const filePath = resolve(argcat);
                if (!existsSync(filePath)) {
                    throw `File '${filePath}' does not exist`;
                    break;
                }
                player.loadFile(filePath);
            } catch (err) {
                console.error('Unable to load MIDI data:', err);
            }
            break;
        case 'stop':
        case 's':
            player.stop();
            break;
        case 'exit':
            process.exit(0);
            break;
    }

    rl.prompt();
});

rl.prompt();
