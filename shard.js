/****************************************
 * Notch Discord Bot - created by CZghost
 * 
 * File: shard.js (bot shard process)
 ****************************************/

// Load system environment specific for this bot
require('dotenv').config();

// Load filesystem module
const fs = require('fs');

// Load MySQL module
const MySQL = require("mysql");

// Load JSON Schema Validator module
const { Validator } = require("jsonschema");
const validator = new Validator();

// Load required schemas
let schemas = {
    // Filled in by program
    // locale.json
    // help.json
};

// Load Discord.js module
const Discord = require("discord.js");

// Create new client with @everyone mention disabled
const client = new Discord.Client({disableMentions: 'everyone'});

// Create collection of commands and events
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.events = new Discord.Collection();

// Create command handler
let command_files_list = fs.readdirSync('./commands').filter(f => f.endsWith('.js'));
console.log(`Shard[${client.shard.ids[0]}] Loading commands`);
command_files_list.forEach(f => {
    try {
        let command = require(`./commands/${f}`);
        client.commands.set(command.name, command);
        command.aliases.forEach(a => { client.aliases.set(a, command.name); });
        console.log(`Shard[${client.shard.ids[0]}] Command ${command.name} loaded with aliases [ ${command.aliases.join(', ')} ]`);
    } catch(e) {
        // An error was thrown -> do nothing and log the error in console
        console.error(`Shard[${client.shard.ids[0]}] ERROR: ${e.messsage}`);
    }
});
console.log(`Shard[${client.shard.ids[0]}] Commands loaded`);

// Create event handler
let event_files_list = fs.readdirSync('./events');
console.log(`Shard[${client.shard.ids[0]}] Loading events`);
event_files_list.forEach(f => {
    try {
        let event = require(`./events/${f}`);
        client.events.set(event.name, event);
        console.log(`Shard[${client.shard.ids[0]}] Event ${event.name} loaded`);
    } catch(e) {
        // An error was thrown -> do nothing and log the error in console
        console.error(`Shard[${client.shard.ids[0]}] ERROR: ${e.message}`);
    }
});
console.log(`Shard[${client.shard.ids[0]}] Events loaded`);

// Temporary event listener
client.on('ready', () => {
    console.log(`Shard[${client.shard.ids[0]}] Client logged in as '${client.user.tag}' with ID '${client.user.id}'`);
});

// TODO: List through events collection and assign them to the client object instance

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
