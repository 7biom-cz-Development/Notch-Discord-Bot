/****************************************
 * Notch Discord Bot - created by CZghost
 * 
 * File: Command.ts (bot command class)
 ****************************************/

import { Client, Message } from 'discord.js';

export class Command {
    public name: string;
    public aliases: string[];
    public run: (client: Client, message: Message, args: string[]) => void;

    constructor(name: string, aliases: string[], run: (client: Client, message: Message, args: string[]) => void) {
        this.name = name;
        this.aliases = aliases;
        this.run = run;
    }
}