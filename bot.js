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

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

bot.login(auth.token);

// Initialize Discord Bot
var bot = new Discord.Client();

bot.on('ready', function() {
    // When the bot is ready set things here
});

bot.on('message', function(mess) {
    // When the bot sees a message in the server do things
})
