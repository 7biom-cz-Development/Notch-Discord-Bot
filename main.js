/****************************************
 * Notch Discord Bot - created by CZghost
 * 
 * File: main.js (main bot process entry)
 ****************************************/

// Load system environment specific for this bot
require('dotenv').config();

// Load ShardingManager class from Discord.js module
const { ShardingManager } = require('discord.js');
const manager = new ShardingManager('./shard.js', {
	execArgv: ['--trace-warnings'],
	//shardArgs: ['--ansi', '--color'],
	token: process.env.TOKEN,
});

// Create a shard -> handling event
manager.on('shardCreate', shard => console.log(`Master[] Launched shard ${shard.id}`));

// Sending a message -> handling event
manager.on('message', (shard, message) => {
	console.log(`Shard[${shard.id}] : ${message._eval} : ${message._result}`);
});

// Spawn sharding manager
manager.spawn();
