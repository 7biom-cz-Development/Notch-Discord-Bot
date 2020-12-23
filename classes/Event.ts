/****************************************
 * Notch Discord Bot - created by CZghost
 * 
 * File: Event.ts (bot event class)
 ****************************************/

import { Client } from "discord.js";

// TODO: import necessary files

export class Event {
    // Public properties
    public name: string;
    public run: (client: Client, ...args: any) => Promise<any>;

    // Class constructor
    constructor(name: string, run: (client: Client, ...args: any) => Promise<any>) {
        this.name = name;
        this.run = run;
    }
}
