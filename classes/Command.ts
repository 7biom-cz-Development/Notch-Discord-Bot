/****************************************
 * Notch Discord Bot - created by CZghost
 * 
 * File: Command.ts (bot command class)
 ****************************************/

const fetch = require('node-fetch');
const util = require('util');
import { Validator, ValidatorResult } from 'jsonschema';
import { Client, Message, Util } from 'discord.js';

export class Command {
    // Public properties
    public name: string;
    public aliases: string[];
    public help: {[key: string]: any};
    public run: (client: Client, message: Message, args: string[]) => Promise<any>;

    // Public static methods
    public static validate = async (json: {[key: string]: any}): Promise<boolean> => {
        // Load schema for validation
        let schema: {[key: string]: any} = await fetch('https://github.7biom.cz/json/schemas/Notch/help.json')
            .then((res: { json: () => {[key: string]: any}; }) => res.json());

        // Validate
        const validator = new Validator();
        return validator.validate(json, schema).valid;
    };

    // Class constructor
    constructor(name: string, aliases: string[], help: {[key: string]: any}, run: (client: Client, message: Message, args: string[]) => Promise<any>) {
        // Assign objects
        this.name = name;
        this.aliases = aliases;
        this.help = help;
        this.run = run;
    }
}
