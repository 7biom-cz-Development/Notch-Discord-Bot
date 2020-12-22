/****************************************
 * Notch Discord Bot - created by CZghost
 * 
 * File: Locale.ts (bot locale class)
 ****************************************/

const fetch = require('node-fetch');
const util = require('util');
import { Validator } from 'jsonschema';

export class Locale {
    public code: string;
    public name: string;
    public author: string;
    public locales: {[key: string]: any};

    constructor(code: string, json: any) {
        // Get locale code
        this.code = code;

        // Load locale JSON and schema for validation
        let locale_json = json;
        let schema = {};
        let promise = fetch('https://github.7biom.cz/json/schemas/Notch/locale.json')
            .then((res: { json: () => any; }) => res.json()).then((data: any) => {Object.assign(schema, data)});

        // Debug line
        console.log(schema);

        // Validate
        const validator = new Validator();
        if(!validator.validate(locale_json, schema)) throw new Error(`Validation of locale object for ${code} failed!`);

        // Retrieve rest of the attributes from loaded and validated JSON
        this.name = locale_json.name;           // locale translated name
        this.author = locale_json.author;       // locale author
        this.locales = locale_json.locales;     // locale strings
    }
}
