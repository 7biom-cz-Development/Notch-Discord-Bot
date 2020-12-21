/****************************************
 * Notch Discord Bot - created by CZghost
 * 
 * File: Command.ts (bot command class)
 ****************************************/

const fetch = require('node-fetch');
const util = require('util');
import { Validator } from 'jsonschema';
import { Client, Message, Util } from 'discord.js';

export class Command {
    public name: string;
    public aliases: string[];
    public help: {[key: string]: any};
    public run: (client: Client, message: Message, args: string[]) => Promise<any>;

    constructor(name: string, aliases: string[], help: {[key: string]: any}, run: (client: Client, message: Message, args: string[]) => Promise<any>) {
        this.name = name;
        this.aliases = aliases;
        this.run = run;

        let schema = {};
        let promise = fetch('https://github.7biom.cz/json/schemas/Notch/help.json')
            .then((res: { json: () => any; }) => res.json()).then((data: any) => {Object.assign(schema, data)});

        while(util.inspect(promise).includes("pending"));   // Loop until promise is finished

        const validator = new Validator();
        if(!validator.validate(help, schema)) throw new Error(`Validation of help object for command ${name} failed!`);

        this.help = help;
    }
}
