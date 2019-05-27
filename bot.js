var Discord = require('discord.js');
var logger = require('winston');
var auth = require('./auth.json');
var ytdl = require('ytdl-core');
var fs = require('fs');


var kolossID = "342162894873427979";
var speakeasyID = "582080751542075393";
var controlChannel = "582145740705628170";
var presenceString = "Smooth Jazz";

let dispatcher = null;
var defaultSongURL = "http://www.youtube.com/watch?v=Evb31p5vFs4";
var queue = [];

let voiceConn = null;

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

// Initialize Discord Bot
var bot = new Discord.Client();
bot.login(auth.token);

bot.on('ready', function() {
    // When the bot is ready set things here
    joinVoiceChannel();
});

bot.on('message', function(message) {
    // message.author = Client ID. The user's unique ID.
    // message.channel = the channel ID. Unique ID for each channel.
    // message.content = the actual content of the message.
    logger.info("Message Captured: [" + message.author + "] [" + message.client + "] (" + message.channel + "): " + message.content);

    if(message.content.substring(0, 1) === "~" && message.author != "582087330379333633") {
        let args = message.content.substring(1).split(' ');
        let cmd = args[0];

        args = args.splice(1);
        switch (cmd) {
            // SkipSong Command
            case 'skip':
                message.channel.send('Skipping current song: ' + queue[0]);
                skipSong();
                break;
            case 'add':
                message.channel.send('Adding Song: ' + args);
                addSong(args);
                break;
            case 'getband':
                message.channel.send("Moving to channel: " + message.member.voice.channel.name);
                joinVoiceChannel(message.member.voice.channel.id);
                break;
            case 'gohome':
                message.channel.send("Returning to the speakeasy...");
                joinVoiceChannel();
            case 'help':
                message.channel.send("The band is pretty simple. We play youtube videos.");
                message.channel.send("=====       Commands:       =====");
                message.channel.send("~add [url]    - Add a song to the playlist. Ex. !add http://www.youtube.com/watch?v=Evb31p5vFs4");
                message.channel.send("~skip         - Skip the current playing song - or use to get the bot going again.");
                message.channel.send("~getband      - Call the band to your current voice channel. All you have to do is be in there.");
                message.channel.send("~gohome       - We get the message. We simply go back to the speakeasy for all to hear when the chats are packed.");
            default:
                message.channel.send("That command does not exist: " + message.content);
        }
    }
});

function joinVoiceChannel(channelID = speakeasyID) {
    let channel = bot.channels.get(channelID)
    logger.info("Attempting to join voice channel: " + channelID);
    channel.join().then(function(conn) {
        playSong(conn);
    });
}

function playSong(conn) {
    // TODO: Play some fucking music.
    if (voiceConn === null) {
        voiceConn = conn;
    }
    if (queue.length === 0) {
        addSong(defaultSongURL);
    }
    (async function() {
        try {
            dispatcher = voiceConn.play(ytdl(queue[0]), {
                volume: 0.015
            });

            dispatcher.on('finish', function() {
                skipSong();
            });
        } catch(e) {
            skipSong();
            logger.error("Error: " + e);
        }
    })();
}

function addSong(url) {
    // TODO: Add song to queue
    // TODO: if current song is default, autoskip.
    logger.info("Adding Song: " + queue[queue.length]);
    queue.push("" + url);
}

function skipSong() {
    // TODO: skip current song and remove it from queue
    logger.info("Skipping song: " + queue[0]);
    queue.shift();
    playSong();
}
