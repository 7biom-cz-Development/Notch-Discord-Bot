/****************************************
 * Notch Discord Bot - created by CZghost
 * 
 * File: message.ts (bot message event)
 ****************************************/

import { Client, Message, TextChannel, NewsChannel } from 'discord.js';
import { Event } from '../classes/Event';

export = new Event(
    'message',                              // name
    false,                                  // once
    false,                                  // disabled
    async (client: Client, message: Message): Promise<any> => {
        // Log received message
        console.log(`Shard[${client.shard.ids[0]}] Message has been sent in a server.`);
        console.log(`  > Channel type: ${message.channel.type}`);
        if(message.channel instanceof TextChannel || message.channel instanceof NewsChannel) {
            // This only applies to server channels (text or news channels)
            console.log(`  > Guild: '${message.guild.name}' (ID ${message.guild.id})`)
            console.log(`  > Channel: '${message.channel.name}' (ID ${message.channel.id})`);
        }
        console.log(`  > Message author: '${message.author.tag}' (ID ${message.author.id})`);
        console.log(`  > Posted by bot: ${message.author.bot ? 'yes' : 'no'}`);
        console.log(`  > Posted at: ${message.createdAt.toDateString()}`);
        console.log(`  > Message content:`);
        message.content.split('\n').forEach(line => {
            console.log(`      | ${line}`);
        });

        // TODO: Command handling
    }
);