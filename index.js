const fs = require("fs");
const {Client, GatewayIntentBits, Collection} = require('discord.js');


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
    ]
});

require('./utils/registerSlash')(client);

require("dotenv").config()

client.handler = new Collection();
client.friendQueue = new Set();
client.link = new Map();

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