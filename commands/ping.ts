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
    require('./help_json/ping.json'),           // help
    false,                                      // disabled
    async (client: Client, message: Message, args: string[]): Promise<any> => {
        // TODO: Ping command
    }                                           // run
);