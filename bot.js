var Discord = require('discord.js');
var logger = require('winston');
var auth = require('./auth.json');
var ytdl = require('ytdl-core');
var fs = require('fs');


var kolossID = "342162894873427979";
var speakeasyID = "582080751542075393";
var controlChannel = "582145740705628170";
var presenceString = "Smooth Jazz";

var dispatcher = null;
var defaultSongURL = "http://www.youtube.com/watch?v=Evb31p5vFs4";
var queue = {};

var voiceConn = null;

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
});

function joinVoiceChannel() {
    let channel = bot.channels.get(speakeasyID);
    if(voiceConn == null) {
        logger.info("Attempting to join voice channel: " + speakeasyID);
        channel.join().then(function(conn) {
            playSong(conn);
        });
    }


}

function playSong(conn) {
    // TODO: Play some fucking music.
    (async function() {
        try {
            dispatcher = conn.play(ytdl(defaultSongURL), {
                volume: 0.05
            });
        } catch(e) {
            logger.error("Error: " + e);
        }
    })();
}

function addSong() {
    // TODO: Add song to queue
    // TODO: if current song is default, autoskip.
}

function skipSong() {
    // TODO: skip current song and remove it from queue
}
