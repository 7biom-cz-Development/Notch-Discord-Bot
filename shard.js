/****************************************
 * Notch Discord Bot - created by CZghost
 * 
 * File: shard.js (bot shard process)
 ****************************************/

// Load system environment specific for this bot
require('dotenv').config();

// Load MySQL module
const MySQL = require("mysql");

// Load https module
const https = require('https');

// Load JSON Schema Validator module
const { Validator } = require("jsonschema");
const validator = new Validator();

// Load required schemas
let schemas = {
    locale: null,               // Locale JSON schema, load from online resource
};

https.get('https://github.7biom.cz/json/schemas/Notch/locale.json', (res) => {
    let error;

    if(res.statusCode !== 200) {
        error = new Error(`Locale JSON schema failed to load. Status code ${res.statusCode}`);
    } else if(!/^application\/json/.test(res.headers['content-type'])) {
        error = new Error(`Locale JSON schema isn't JSON MIME type. Retrieved MIME type ${res.headers['content-type']}`);
    }

    if(error) {
        console.error(`Shard[${client.shard.ids[0]}] ERROR: ${error.message}`);
        res.resume();
        return;
    }

    let rawData = '';
    res.on('data', chunk => { rawData += chunk; });
    res.on('end', () => {
        try {
            schemas.locale = JSON.parse(rawData);
        } catch(e) {
            console.error(`Shard[${client.shard.ids[0]}] ERROR: ${e.message}`);
            return;
        }
    });
}).on('error', e => { console.error(`Shard[${client.shard.ids[0]}] ERROR: ${e.message}`) });

// Debug line
console.log(schemas);

// Load Discord.js module
const Discord = require("discord.js");

// Create new client with @everyone mention disabled
const client = new Discord.Client({disableMentions: 'everyone'});

// Create collection of commands
client.commands = new Discord.Collection();

// Create collection of events
client.events = new Discord.Collection();

// Temporary event listener
client.on('ready', () => {
    console.log(`Shard[${client.shard.ids[0]}] Client logged in as '${client.user.tag}' with ID '${client.user.id}'`);
});

// TODO: Read events and commands and put them in collections

// Log the bot in
client.login(process.env.TOKEN);

// Listen to signal interruptions
process.on('SIGINT', () => {
	console.log(`Shard[${client.shard.ids[0]}] Received SIGINT, terminating with exit code 0`);
	process.exit(0);
});

// Listen to exit
process.on('exit', (code) => {
    client.destroy();     // Log the bot out on termination
    console.log(`Shard[${client.shard.ids[0]}] Process terminated with exit code ${code}`);
});
