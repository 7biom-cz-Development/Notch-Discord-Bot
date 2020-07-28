/**************************************************
 * Notch Discord Bot
 * 
 * Created by: CZghost
 * Created for: 7biom.cz
 * 
 * Open-sourced under GNU-GPL v3.0 or later
 * Make sure to comply with source code licence
 * when redistributing, forking or linking,
 * always specify original author of this bot!
 **************************************************/

// Look for local environment variables defined in .env file (development mode)
require("dotenv").config();

// Load Client and other objects from Discord module
const { Client } = require("discord.js");

// Set up bot client instance, ignore @everyone mentions
const client = new Client({disableMentions: "everyone"});

// [...] More to be filled up later

// Bot is initialised, ready to be connected
client.login(process.env.TOKEN);
