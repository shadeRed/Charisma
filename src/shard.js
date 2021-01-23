let Discord = require('discord.js');
let fs = require('fs');

let options = require('./config/options.json');
let token = require('./token.json').token;
let colors = require('./core/colors.js');
let utils = require('./core/utils.js');
let excluded = require('./excluded.json');

function getOutput(content, marker, highlighted) {
    if (!marker) { marker = '' }
    else { marker = `${marker} ` }
    
    let lines = [];
    if (typeof content === 'object' && typeof content != null)  {
        let objectString = utils.inspect(content);
        let regexp = /^\d\d:\d\d$/;
        lines = objectString.split('\n');
    }
    
    else { content = `${content}`; lines = content.split('\n') }
    lines.filter(line => line != '');
    if (highlighted) { lines = colors.highlight(lines.join('\n')).split('\n') }
    for (let l = 0; l < lines.length; l++) { lines[l] = `${marker}${lines[l]}` }
    return lines.join('\n');
}


// overwrites console object with new methods
// (not really sure if this is good practice but I did it anyway)
// TODO: possibly store any errors logged with error methods in some sort of error log file

//process.stdout.on('data', function(data) { process.send({ type: 'log', content: data }) });

global.console = {
    log: function(toLog) {
        let error = new Error();
        let marker = colors.fg.wrap('[?]', colors.colors.log);
        let from = error.stack.split('\n')[2].split('\\')[error.stack.split('\n')[2].split('\\').length - 1].slice(0, -1);
        if (options.logs.showOriginFile) { marker = colors.fg.wrap(`[${from}]`, colors.colors.log) }
        let out = getOutput(toLog, marker);
        process.stdout.write(`${out}\n`);
    },

    info: function(toLog) {
        let marker = colors.fg.wrap('[~]', colors.colors.ready);
        let out = getOutput(toLog, marker);
        process.stdout.write(`${out}\n`);
    },

    infolight: function(toLog) {
        if (options.logs.infoWeight > 1) {
            let marker = colors.fg.wrap('[~]', colors.colors.ready);
            let out = getOutput(toLog, marker);
            process.stdout.write(`${out}\n`);
        }
    },

    infoheavy: function(toLog) {
        if (options.logs.infoWeight > 2) {
            let marker = colors.fg.wrap('[~]', colors.colors.ready);
            let out = getOutput(toLog, marker);
            process.stdout.write(`${out}\n`);
        }
    },

    ready: function(toLog) {
        let marker = colors.fg.wrap('[+]', colors.colors.success);
        let out = getOutput(toLog, marker);
        process.stdout.write(`${out}\n`);
    },

    warn: function(toLog) {
        let marker = colors.fg.wrap('[-]', colors.colors.warning);
        let out = getOutput(toLog, marker, true);
        process.stdout.write(`${out}\n`);
    },

    warnlight: function(toLog) {
        if (options.logs.warnWeight > 1) {
            let marker = colors.fg.wrap('[-]', colors.colors.warning);
            let out = getOutput(toLog, marker, true);
            process.stdout.write(`${out}\n`);
        }
    },

    warnheavy: function(toLog) {
        if (options.logs.warnWeight > 2) {
            let marker = colors.fg.wrap('[-]', colors.colors.warning);
            let out = getOutput(toLog, marker, true);
            process.stdout.write(`${out}\n`);
        }
    },

    error: function(error) {
        let marker = colors.fg.wrap('[!]', colors.colors.error);
        let content;
        if (error instanceof Error) { content = error.stack }
        else { content = error }
        process.stdout.write(`${getOutput(content, marker)}\n`);
    },

    errorlight: function(error) {
        if (options.logs.errorWeight > 1) {
            let marker = colors.fg.wrap('[!]', colors.colors.error);
            let content;
            if (error instanceof Error) { content = error.stack }
            else { content = error }
            process.stdout.write(`${getOutput(content, marker)}\n`);
        }
    },

    errorheavy: function(error) {
        if (options.logs.errorWeight > 2) {
            let marker = colors.fg.wrap('[!]', colors.colors.error);
            let content;
            if (error instanceof Error) { content = error.stack }
            else { content = error }
            process.stdout.write(`${getOutput(content, marker)}\n`);
        }
    }
}

let client = new Discord.Client();

let imports = {
    client: client,
    config: {},
    commands: {
        functions: new Map(),
        configs: new Map(),
        permissions: {},
        aliases: new Map(),
        parameters: new Map()
    },

    core: {},

    gets: {
        inits: [],
        data: {}
    },

    sets: {
        inits: [],
        data: {}
    }
}

let load = {
    gets: function() {
        let dir = fs.readdirSync(`./src/gets`);
        for (let d = 0; d < dir.length; d++) {
            if (dir[d].endsWith('.js')) {
                let gets = require(`./gets/${dir[d]}`);
                if (gets.init) { imports.gets.inits.push(gets.init) }
                if (gets.gets) { for (let g in gets.gets) { imports.gets.data[g] = gets.gets[g] } }
            }
        }
    },

    sets: function() {
        let dir = fs.readdirSync(`./src/sets`);
        for (let d = 0; d < dir.length; d++) {
            if (dir[d].endsWith('.js')) {
                let sets = require(`./sets/${dir[d]}`);
                if (sets.init) { imports.sets.inits.push(sets.init) }
                if (sets.sets) { for (let s in sets.sets) { imports.sets.data[s] = sets.sets[s] } }
            }
        }
    },

    permissions: function() {
        let count = 0;

        let dir = fs.readdirSync(`./src/permissions`);
        for (let d = 0; d < dir.length; d++) {
            let perms = require(`./permissions/${dir[d]}`);
            function recur(src, dest) {
                for (let s in src) {
                    if (typeof src[s] == 'object') { dest[s] = {}; recur(src[s], dest[s]) }
                    else { dest[s] = src[s]; count++; }
                }
            }

            recur(perms, imports.commands.permissions);
        }

        return `loaded ${count} permissions`;
    },

    parameters: function() {
        let count = 0;
        let dir = fs.readdirSync('./src/parameters');
        for (let d = 0; d < dir.length; d++) {
            if (dir[d].endsWith('.js')) {
                let name = dir[d].split('.js')[0];
                imports.commands.parameters.set(name, require(`./parameters/${dir[d]}`));
                count++;
            }
        }

        return `loaded ${count} parameter types`;
    },

    commands: function() {
        let count = 0;

        function recur(path) {
            let dir = fs.readdirSync(`./src/${path}`);
            for (let d = 0; d < dir.length; d++) {
                if (fs.statSync(`./src/${path}/${dir[d]}`).isDirectory()) { recur(`${path}/${dir[d]}`) }
                else {
                    if (dir[d].endsWith('.js')) {
                        let command = require(`./${path}/${dir[d]}`);
                        let name = dir[d].split('.js')[0];

                        if (!excluded.includes(name)) {
                            if (command.config.aliases) { for (let a = 0; a < command.config.aliases.length; a++) { imports.commands.aliases.set(command.config.aliases[a], name) } }

                            if (command.config.params && command.config.params.length > 0 && !(command.config.params[0] instanceof Array)) { command.config.params = [command.config.params] }
                            if (!(command.command instanceof Array)) { command.command = [command.command] }

                            imports.commands.configs.set(name, command.config);
                            imports.commands.functions.set(name, command.command instanceof Array ? command.command : [command.command]);
                            count++;
                        }
                    }
                }
            }
        }

        recur('commands');

        return `loaded ${count} commands`;
    },

    daemons: async function() {
        let count = 0;

        async function recur(path) {
            let dir = fs.readdirSync(`./src/${path}`);
            for (let d = 0; d < dir.length; d++) {
                if (fs.statSync(`./src/${path}/${dir[d]}`).isDirectory()) { await recur(`${path}/${dir[d]}`) }
                else {
                    if (dir[d].endsWith('.js')) {
                        let daemon = require(`./${path}/${dir[d]}`);
                        if (daemon.constructor.name === 'AsyncFunction') { await daemon(imports) }
                        else { daemon(imports) }
                        count++;
                    }
                }
            }
        }

        await recur('daemons');

        return `loaded ${count} daemons`;
    },

    configs: function() {
        let configs = fs.readdirSync('./src/config');
        let count = 0;
        for (let c = 0; c < configs.length; c++) {
            if (!configs[c].endsWith(`.example.json`)) {
                imports.config[configs[c].split('.')[0]] = require(`./config/${configs[c]}`);
                count++;
            }
        }

        return `loaded ${count} config files`;
    },

    cores: function() {
        let cores = fs.readdirSync('./src/core');
        for (let c = 0; c < cores.length; c++) { imports.core[cores[c].split('.')[0]] = require(`./core/${cores[c]}`) }
        return `loaded ${cores.length} cores`;
    },

    finish: async function() {
        for (let i = 0; i < imports.gets.inits.length; i++) {
            if (imports.gets.inits[i].constructor.name === 'AsyncFunction') { await imports.gets.inits[i](imports) }
            else { imports.gets.inits[i](imports) }
        }

        for (let i = 0; i < imports.sets.inits.length; i++) {
            if (imports.sets.inits[i].constructor.name === 'AsyncFunction') { await imports.sets.inits[i](imports) }
            else { imports.sets.inits[i](imports) }
        }

        if (imports.data) { await imports.data.start() }
        if (imports.messageListener) { imports.messageListener() }
    }
}

async function start() {
    client.on('ready', async function() {
        for (let c = 0; c < client.voice.connections.array().length; c++) { client.voice.connections.array()[c].disconnect() }
        console.info(load.configs());
        console.info(load.cores());
        console.info(await load.commands());
        console.info(await load.daemons());
        
        console.info(await load.parameters());
        console.info(await load.permissions());

        await load.sets();
        await load.gets();

        await load.finish();

        console.ready(`logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`);
        //client.emit('guildMemberRemove', await (await client.guilds.fetch('555915323858223105')).members.fetch('277731072496631809'));
    });

    process.on('message', async function(msg) {
        if (msg == 'STOP') {
            console.log(`shard killed!`);
            for (let c = 0; c < client.voice.connections.array().length; c++) { await client.voice.connections.array()[c].disconnect() }
            process.send('STOP');
        }
    });
}

client.on('error', function(error) { console.error(error) });
client.on('disconnect', function() { console.error(disconnected) });

start();

client.login(token);