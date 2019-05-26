var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var ytdl = require('ytdl-core');


var kolossID = "342162894873427979";
var speakeasyID = "582080751542075393";
var controlChannel = "582145740705628170";
var presenceString = "Smooth Jazz";

var dispatcher = null;
var defaultSongURL = "https://www.youtube.com/watch?v=Evb31p5vFs4";

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
    logger.info('Joining Speakeasy: ' + speakeasyID);
    bot.joinVoiceChannel(speakeasyID);

    var stream = ytdl('http://www.youtube.com/watch?v=A02s8omM_hI');
    stream.on('done', function() {

    });

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
