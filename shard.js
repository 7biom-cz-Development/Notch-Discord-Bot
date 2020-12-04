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
const schemas = {
    locale: fetch("https://github.7biom.cz/json/schemas/Notch/locale.json", {method: "get"})
        .then(res => res.json())
        .then(json => {return json})
}

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

// TODO: Read events and commands and put them in collections

// Login the bot
client.login(process.env.TOKEN);
console.log(`Shard[${client.shard.ids[0]}] Client logged in as '${client.user.tag}' with ID '${client.user.id}'`);
