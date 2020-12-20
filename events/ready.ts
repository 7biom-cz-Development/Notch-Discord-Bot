/****************************************
 * Notch Discord Bot - created by CZghost
 * 
 * File: ready.ts (bot ready event)
 ****************************************/

import { Client } from 'discord.js';
import { Event } from '../classes/Event';

export = new Event(
    'ready',                        // name
    (client: Client) => {
        console.log(`Shard[${client.shard.ids[0]}] Client logged in as '${client.user.tag}' with ID '${client.user.id}'`);
    }                               // run
);
