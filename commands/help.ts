/****************************************
 * Notch Discord Bot - created by CZghost
 * 
 * File: help.ts (bot help command)
 ****************************************/

import { Client, Message } from 'discord.js';
import { Command } from '../classes/Command';

export = new Command(
    'help',                                     // name
    [],                                         // aliases
    require('./help_json/help.json'),           // help
    true,                                       // disabled
    async (client: Client, message: Message, args: string[]): Promise<any> => {
        // TODO: Help command
    }                                           // run
);
