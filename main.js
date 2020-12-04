/****************************************
 * Notch Discord Bot - created by CZghost
 * 
 * File: main.js (main program entry)
 ****************************************/

// Load system environment specific for this bot
require('dotenv').config();

// Load MySQL module
const MySQL = require("mysql");

// Load JSON Schema Validator module
const { Validator } = require("jsonschema");
const validator = new Validator();
const schemas = {
    locale: require("https://github.7biom.cz/json/schemas/Notch/locale.json");
}

// Load Discord.js module
const Discord = require("discord.js");

// Create new client with @everyone mention disabled
const client = new Discord.Client({disableMentions: 'everyone'});

// Create collection of commands
client.commands = new Discord.Collection();

// Create collection of events
client.events = new Discord.Collection();

// TODO: Read events and commands and put them in collections

// Login the bot
client.login(process.env.TOKEN);
