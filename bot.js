var Discord = require('discord.io');
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

// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
    logger.info('Setting Presence: ' + presenceString);
    bot.setPresence(presenceString);
    playSong();
});

bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
        if (message.substring(0, 1) == '!') {
            // Only accept commands from the control server
            if (channelID == controlChannel) {
            var args = message.substring(1).split(' ');
            var cmd = args[0];

            args = args.splice(1);
            switch(cmd) {
                // !ping
                case 'ping':
                    bot.sendMessage({
                        to: channelID,
                        message: 'Pong! [' + channelID + ']'
                    });
                break;
                // Just add any case commands if you want to..
             }
         }
     }
});

function playSong() {
  // Join the speakeasyChannel
  logger.info('Joining Speakeasy: ' + speakeasyID);
  bot.joinVoiceChannel(speakeasyID, function(error, events) {

    // If there is an error, log it.
    if (error) {
      logger.error('ERROR: ' + error);
    }

    logger.info("Getting audio context from channelID: " + speakeasyID);
    bot.getAudioContext(speakeasyID, function(error, stream) {
      if (error) {
        logger.error('ERROR: ' + error);
      }

      // Create the read stream - use YTDL to get the audio of the video and pipe it into a file called audio.flv for the read stream to read from
      logger.info("Attempting to create audio stream from video: " + defaultSongURL);
      ytdl(defaultSongURL, {filter: "audioonly"}).pipe(fs.createWriteStream('audio.flv'));

      logger.info("Attempting to read audio stream from audio.flv");
      fs.createReadStream('audio.flv').pipe(stream, {end: false});

      stream.on('done', function() {
        logger.info("Stream object reached a done state.");
      });
    });
  });
}
