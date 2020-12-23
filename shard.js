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

// Load Locale module
const { Locale } = require('./classes/Locale');
const { Command } = require('./classes/Command');

// Load Discord.js module
const Discord = require("discord.js");

// Create new client with @everyone mention disabled
const client = new Discord.Client({disableMentions: 'everyone'});

// Create collection of locales, commands and events
client.locales = new Discord.Collection();
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.events = new Discord.Collection();

// Read and validate locale JSON files
let locale_files_list = fs.readdirSync('./locales').filter(f => f.endsWith('.json'));
console.log(`Shard[${client.shard.ids[0]}] Loading locales`);
locale_files_list.forEach(async f => {
    try {
        // Retrieve requested file
        let code = f.substring(0, f.lastIndexOf('.'));
        let locale_json = require(`./locales/${f}`);
        let locale = new Locale(code, locale_json);

        // Check if the locale has disabled status
        if(locale.disabled) return console.log(`Shard[${client.shard.ids[0]}] Locale ${code} disabled, skipping`);

        // Validate locale JSON
        if(!await Locale.validate(locale_json)) throw new Error(`Locale ${code} failed to validate!`);

        // Add the locale into collection
        client.locales.set(code, locale);

        // Success
        console.log(`Shard[${client.shard.ids[0]}] Locale ${code} loaded`);
    } catch(e) {
        // An error was thrown -> do nothing and log the error in console
        console.error(`Shard[${client.shard.ids[0]}] ERROR: ${e.message} | Error stack below`);
        console.error(e.stack);
    }
});

// Create command handler
let command_files_list = fs.readdirSync('./commands').filter(f => f.endsWith('.js'));
console.log(`Shard[${client.shard.ids[0]}] Loading commands`);
command_files_list.forEach(async f => {
    try {
        // Retrieve requested command class instance
        let command = require(`./commands/${f}`);

        // Check command disabled status
        if(command.disabled) return console.log(`Shard[${client.shard.ids[0]}] Command ${command.name} disabled, skipping`);

        // Validate help object of that command
        if(!await Command.validate(command.help)) throw new Error(`Command ${command.name} failed to validate its help JSON!`);

        // Add the command into collection
        client.commands.set(command.name, command);

        // Add each alias for this command into collection
        command.aliases.forEach(a => { client.aliases.set(a, command.name); });

        // Success
        console.log(`Shard[${client.shard.ids[0]}] Command ${command.name} loaded with aliases [ ${command.aliases.join(', ')} ]`);
    } catch(e) {
        // An error was thrown -> do nothing and log the error in console
        console.error(`Shard[${client.shard.ids[0]}] ERROR: ${e.message} | Error stack below`);
        console.error(e.stack);
    }
});

// Create event handler
let event_files_list = fs.readdirSync('./events').filter(f => f.endsWith('.js'));
console.log(`Shard[${client.shard.ids[0]}] Loading events`);
event_files_list.forEach(async f => {
    try {
        // Retrieve event instance
        let event = require(`./events/${f}`);

        // Check if the event is disabled
        if(event.disabled) return console.log(`Shard[${client.shard.ids[0]}] Event '${event.name}' disabled, skipping`);

        // Add the event into collection
        client.events.set(event.name, event);

        // Assign the event to client's events listener
        if(event.once) client.once(event.name, event.run.bind(null, client));       // Does it run only once?
        else client.on(event.name, event.run.bind(null, client));

        // Success
        console.log(`Shard[${client.shard.ids[0]}] Event '${event.name}' loaded`);
    } catch(e) {
        // An error was thrown -> do nothing and log the error in console
        console.error(`Shard[${client.shard.ids[0]}] ERROR: ${e.message} | Error stack below`);
        console.error(e.stack);
    }
});

// Log the bot in
client.login(process.env.TOKEN);

// Listen to signal interruptions
process.on('SIGINT', () => {
    console.log(`Shard[${client.shard.ids[0]}] Received SIGINT, terminating with exit code 0`);
	process.exit(0);
});

process.on('SIGTERM', () => {
    console.log(`Shard[${client.shard.ids[0]}] Received SIGTERM, terminating with exit code 0`);
    process.exit(0);
});

// Listen to exit
process.on('exit', (code) => {
    client.destroy();               // Log the bot out on termination
    console.log(`Shard[${client.shard.ids[0]}] Process terminated with exit code ${code}`);
});
