/****************************************
 * Notch Discord Bot - created by CZghost
 * 
 * File: Event.ts (bot event class)
 ****************************************/

import { Client } from "discord.js";

// TODO: import necessary files

export class Event {
    public name: string;
    public run: (client: Client, ...args: any) => void;

    constructor(name: string, run: (client: Client, ...args: any) => void) {
        this.name = name;
        this.run = run;
    }
}