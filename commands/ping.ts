/****************************************
 * Notch Discord Bot - created by CZghost
 * 
 * File: ping.ts (bot ping command)
 ****************************************/

import { Client, Message } from 'discord.js';
import { Command } from '../classes/Command';

export = new Command(
    'ping',                                     // name
    ['botping', 'latency', 'botlatency'],       // aliases
    {
        // TODO: help object
    },                                          // help
    async (client: Client, message: Message, args: string[]): Promise<any> => {
        // TODO: Ping command
    }                                           // run
);
