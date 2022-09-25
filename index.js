const fs = require("fs");
const Discord = require('discord.js');

const client = new Discord.Client({
    intents: ['Guilds', 'GuildMembers'],
});

require('./utils/registerSlash')(client);

require("dotenv").config()

client.handler = new Discord.Collection();
client.friendQueue = new Set();

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
});


fs.readdir("./events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        const event = require(`./events/${file}`);
        let eventName = file.split(".")[0];
        client.on(eventName, event.bind(null, client));
    });
});

fs.readdir("./handlers/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(f => {
        let handlerName = f.split(".")[0];
        let pull = require(`./handlers/${handlerName}`);
        client.handler.set(handlerName, pull);
    });
});

client.login(process.env.TOKEN);