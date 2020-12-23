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

// Listen to signal interruptions
process.on('SIGINT', () => {
	console.log('Master[] Received SIGINT, terminating with exit code 0');
	process.exit(0);
});

process.on('SIGTERM', () => {
	console.log('Master[] Received SIGTERM, terminating with exit code 0');
	process.exit(0);
});

// Listen to exit
process.on('exit', (code) => {
    manager.broadcastEval(`process.exit(${code})`);             // Broadcast process exit on all shards
    console.log(`Master[] Process terminated with exit code ${code}`);
});
