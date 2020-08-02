/**************************************************
 * Notch Discord Bot
 * 
 * Created by: CZghost
 * Created for: 7biom.cz
 * 
 * Open-sourced under GNU-GPL v3.0 or later
 * Make sure to comply with source code licence
 * when redistributing, forking or linking,
 * always specify original author of this bot!
 **************************************************/

// Get the literals definitions
const literals = require("./literals.js");

// Required libraries
const { Client, Collection } = require("discord.js");       // Discord.js library -> main driver for this bot
const { readdirSync } = require("fs");                      // Reading directories/folders
const { stripIndents } = require("common-tags");            // Format strings in code
const MySQL = require("mysql");                             // MySQL library -> keeps settings
const colors = require("colors");                           // Colouring the Node.js output
const mysql_handler = require("./inc/mysql_handler.js");    // MySQL response handler (non-select queries)

// Look for local environment variables defined in .env file (development mode)
require("dotenv").config();

// Set up bot client instance, ignore @everyone mentions
const client = new Client({disableMentions: "everyone"});

// Setup credentials
client.credentials = Object.freeze({
    token:      process.env.TOKEN,
    mysql: Object.freeze({
        host:   process.env.MYSQL_HOST,
        user:   process.env.MYSQL_USER,
        pswd:   process.env.MYSQL_PSWD,
        db:     process.env.MYSQL_DB
    })
});

// Setup locale strings
client.locales = {
    fallback_locale: "en-US",
    supported_locales: {
        'cs-CZ': literals.locale_support_types.COMPLETELY,
        'en-GB': literals.locale_support_types.COMPLETELY,
        'en-US': literals.locale_support_types.COMPLETELY
    },
    locale_strings: {}      // Will be filled in programatically
}

const locales_new = readdirSync('./locales/').filter(f => f.endsWith(".json"));
let table = new ASCII("Locales").setHeading("Locale", "Load Status");

for(let file of locales_new) {
    let pull = require(`./locales/${file}`);

    if(literals.locales.includes(pull.language)) {
        if(Object.prototype.hasOwnProperty.call(literals.locales_map, pull.language)) {
            table.addRow(pull.language, 'Default language definition, skipping'.red);
        } else {
            client.locales.locale_strings[pull.language] = pull.content;
            table.addRow(pull.language, 'Okay'.green);
        }
    } else if(pull.language == 'xx-XX') {
        console.log('Template locale file found, ignoring');
        table.addRow(pull.language, 'Template definition, ignored'.yellow);
    } else {
        table.addRow(pull.language, 'Error - not a language'.red);
    }
}

// Print out the contents of the table
console.log(table.toString());

// Setup default settings (later to be completed by MySQL settings)
// Settings is using locale strings. Locale is defined by wrapping content in #locale{} between those brackets {}
// Content inside brackets {} is then path to the locale string. There is nothing allowed before or after locale string.
client.settings = {
    guilds: {
        default: Object.freeze({
            prefix: process.env.DEFAULT_PREFIX,     // Bot prefix. Use this to prefix any content of messages you wish to use as commands
            emotes_settings: Object.freeze({
                voting: Object.freeze({
                    default: true,          // Defines default => will be compared with default guild settings
                    type: 'object',         // Type of the base => for voting emotes shall be always 'object'
                    base: Object.freeze({
                        agree: '\ud83d\udc4d',      // Agreement emote => defaults to Thumbs up emoji (unicode)
                        disagree: '\ud83d\udc4e'    // Disagreement emote -> defaults to Thumbs down emoji (unicode)
                    })
                }),
                diceroll: Object.freeze({
                    default: true,          // Defines default => will be compared with default guild settings
                    type: 'string',         // Type of the base => string for default dice numbers suffix, otherwise array
                    base: '\ufe0f\u20e3'    // Defaults to dice numbers suffix, which is a box for holding a number.
                                            // Number before that defines the emoji to display (keypad unicode emojis)
                                            // Naturally, dice numbers can be only [1-6] (including),
                                            // 60 % of all keypad numbers (full keypad ranges numbers [0-9])
                }),
                coinflip: Object.freeze({
                    default: true,          // Defines default => will be compared with default guild settings
                    type: 'object',         // Type of the base => for coinflip emotes shall be always 'object'
                    base: Object.freeze({
                        heads: '\ud83d\udc78',      // Heads emote => defaults to Princess emoji (unicode)
                        tails: '\ud83e\udd85'       // Tails emote => defaults to Eagle emoji (unicode)
                    })
                })
            }),
            leveling: Object.freeze({
                disabled: false,            // Disables leveling for this guild (defaults to false === enable leveling)
                channel: null,              // Channel to query user levels in (defaults to null === every channel allowed)
                message: "#locale{leveling:level_up:message}"    // Message content of level up message (defaults to generic message)
            }),
            auditlog_channel: null,     // Channel for audit logs of the bot (defaults to null === none channel)
            swearing_filter: Object.freeze([]),     // Swearing filter with list of filtered words
                                                    // (defaults to empty arraz === none words)
            welcomes: Object.freeze({
                channel: null,          // Channel for posting welcomes into (defaults to null === general/default channel)
                content: "#locale{welcomes:message}",     // Welcome message content
                                        // (defaults to locale dependent message)
                dm: null                // Direct message content (defaults to null === don't post direct messages)
            }),
            farewells: Object.freeze({
                channel: null,          // Channel for posting farewells into (defaults to null === general/default channel)
                content: "#locale{farewells:message}",      // Farewell message content
                                        // (defaults to locale dependent message)
                dm: null                // Direct message content (defaults to null === don't post direct messages)
            }),
            query: Object.freeze({
                channel: null,              // Restriction to one channel for query (info) commands (defaults to null === every channel)
                imunity: ['ADMINISTRATOR']  // Imunity for certain permissions (defaults to 'ADMINISTRATOR' === server OP)
                                            // Full list of permissions can be accessed here:
                                            // https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS
            }),
            locale: 'en-US',                // Locale settings (defaults to 'en-US')
            muting_roles: Object.freeze({
                global: null,               // Global muting role (need to be set in order to mute users)
                channels: Object.freeze({}) // Channel dependent muting roles (defaults to empty dictionary)
            })
        })
        // Guild dependent settings will be added programatically by MySQL connection.
    },
    developers: Object.freeze({
        chief: process.env.CHIEF_DEVELOPER,     // The UUID (user unique ID) of the chief developer
        assistants: []                          // Assisting developers of this bot (filled by MySQL connection)
    })
}

// Moderation and leveling activity of the bot => filled in programatically from MySQL database
client.activity = Object.freeze({
    moderation: Object.freeze({
        warns: {},      // Warns currently issued by the bot in every guild
        bans: {},       // Bans currently issued by the bot in every guild
        mutes: {},      // Mutes currenlty issued by the bot in every guild
        statistics: Object.freeze({
            warns: {},  // User dependent statistics of warns issued by the bot in every guild
            bans: {},   // User dependent statistics of bans issued by the bot in every guild
            kicks: {},  // User dependent statistics of kicks issued by the bot in every guild
            mutes: {}   // User dependent statistics of mutes issued by the bot in every guild
        })
    }),
    other: Object.freeze({
        leveling: {},   // Leveling of users in every guild (keeps settings for disabled leveling)
        gaming: Object.freeze({     // Minigame on server: settings for every guild for every user (keeps settings for disabled)
            working: {},            // Users currently working
            coins: {},              // Current amount of coins of users
            dead: {},               // Users currently dead
            jail: {}                // Users currently in jail
        })
    })
});

// Create MySQL connection to be used later on
client.mysql = MySQL.createConnection({
    host:       client.credentials.mysql.host,
    user:       client.credentials.mysql.user,
    password:   client.credentials.mysql.pswd,
    database:   client.credentials.mysql.db
});

// Perform initial MySQL connection to set up all individual settings
client.mysql.connect(err => {
    if(err) throw err;      // An error occured -> terminate application
    
    // Create tables if they don't exist
    client.mysql.query(stripIndents`
        CREATE TABLE IF NOT EXISTS settings_guild_general
        (
            id INT AUTOINCREMENT PRIMARY KEY,
            guild_id CHAR(18),
            leveling_disabled VARCHAR(20),
            locale VARCHAR(20),
            prefix VARCHAR(20)
        )
    `, mysql_handler);
    client.mysql.query(stripIndents`
        CREATE TABLE IF NOT EXISTS settings_emotes_defaults
        (
            id INT AUTOINCREMENT PRIMARY KEY,
            guild_id CHAR(18),
            voting_emotes VARCHAR(20),
            coinflip_emotes VARCHAR(20),
            diceroll_emotes VARCHAR(20)
        )
    `, mysql_handler);
    // Continue further: settings_guild_voting_emotes

    // TODO: Get every single query and fill in the blanks
})

// Create collections for commands and their aliases
client.commands   = new Collection();
client.aliases    = new Collection();

// Create a presence list => currently empty (will be filled by program)
client.presenceList = {};

// Get handlers and run them
["command", "event"].forEach(handler => require(`./handlers/${handler}.js`)(client));

// Bot is initialised, ready to be connected
client.login(client.credentials.token);
