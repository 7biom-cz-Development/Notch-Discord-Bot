/****************************************
 * Notch Discord Bot - created by CZghost
 * 
 * File: shard.js (bot shard process)
 ****************************************/

// Load system environment specific for this bot
require('dotenv').config();

// Load MySQL module
const MySQL = require("mysql");

// Load fetch module
const fetch = require("node-fetch");

// Load JSON Schema Validator module
const { Validator } = require("jsonschema");
const validator = new Validator();

// Load remote JSON getter
const remote_json = require('./lib/remote_json');

// Load required schemas
let schemas = {};
(async () => {
    schemas = Object.assign({}, schemas, {
        locale: await fetch('https://github.7biom.cz/json/schemas/Notch/locale.json', {method: 'get'}).then(res => res.json())
    });
})();

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
