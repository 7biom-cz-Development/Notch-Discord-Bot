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
    public once: boolean;
    public disabled: boolean;
    public run: (client: Client, ...args: any) => Promise<any>;

    // Public methods
    public disable = (): void => { this.disabled = true; };
    public enable = (): void => { this.disabled = false; };

    // Class constructor
    constructor(name: string, once: boolean, disabled: boolean, run: (client: Client, ...args: any) => Promise<any>) {
        this.name = name;
        this.run = run;
        this.disabled = disabled;
    };
}
