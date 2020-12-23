/****************************************
 * Notch Discord Bot - created by CZghost
 * 
 * File: Locale.ts (bot locale class)
 ****************************************/

const fetch = require('node-fetch');
import { Validator } from 'jsonschema';

export class Locale {
    // Public properties
    public code: string;
    public name: string;
    public author: string;
    public disabled: boolean;
    public locales: {[key: string]: any};

    public static validate = async (json: {[key: string]: any} ): Promise<boolean> => {
        // Load schema for validation
        let schema: {[key: string]: any} = await fetch('https://github.7biom.cz/json/schemas/Notch/locale.json')
            .then((res: { json: () => {[key: string]: any}; }) => res.json());

        // Validate
        const validator = new Validator();
        return validator.validate(json, schema).valid;
    };

    // Class constructor
    constructor(code: string, json: {[key: string]: any}) {
        // Get locale code and disabled status
        this.code = code;

        // Retrieve rest of the attributes from loaded JSON
        this.disabled = json.disabled || false;         // locale disabled status
        this.name = json.name || null;                  // locale translated name
        this.author = json.author || null;              // locale author
        this.locales = json.locales || null;            // locale strings
    }
}
