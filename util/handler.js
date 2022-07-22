var colors = require('colors');
const { readdirSync } = require(`fs`);
module.exports = async (client) => {
    // Commands
    console.log(`${client.getTime()} :: Loading Commands`.bgBrightYellow);
    readdirSync(`${process.cwd()}/commands/`)
        .forEach((directory) => {
            const commands = readdirSync(`${process.cwd()}/commands/${directory}/`)
                .filter((file) => file.endsWith(`.js`))
                .forEach(file => {
                    let pull = require(`${process.cwd()}/commands/${directory}/${file}`);
                    client.commands.set(pull.name, pull);
                })
        })

    // Events
    console.log(`${client.getTime()} :: Loading Events`.bgBrightYellow);
    readdirSync(`${process.cwd()}/events/`).filter((file) => file.endsWith(`.js`))
        .forEach((file) => {
            const pull = require(`${process.cwd()}/events/${file}`)
            let eventName = file.split(`.`)[0];
            client.on(eventName, pull.bind(null, client));
        });

    // Slash Commands
    console.log(`${client.getTime()} :: Loading SlashCommands`.bgBrightYellow);
    const slashCommandsArray = [];
    readdirSync(`${process.cwd()}/slashCommands/`)
        .forEach((directory) => {
            readdirSync(`${process.cwd()}/slashCommands/${directory}/`)
                .filter((file) => file.endsWith(`.js`))
                .forEach(file => {
                    let pull = require(`${process.cwd()}/slashCommands/${directory}/${file}`);
                    client.slashCommands.set(pull.name, pull);
                    slashCommandsArray.push(pull);
                })
        })


    client.on(`ready`, async () => {
        if(client.deploySlash.enabled) {
            if(client.deploySlash.guild) {
                client.guilds.cache.get(client.deploySlash.guild).commands.set(slashCommandsArray); 
            } else {
                client.application.commands.set(slashCommandsArray);
            }

        } 
    });

    process.on('unhandledRejection', (reason, p) => {
        console.log('\n\n\n\n\n=== unhandled Rejection ==='.toUpperCase().bgGray);
        console.log('Reason: ', reason.stack ? String(reason.stack.bgGray) : String(reason).bgGray);
        console.log('=== unhandled Rejection ===\n\n\n\n\n'.toUpperCase().bgGray);
    });
    process.on("uncaughtException", (err, origin) => {
        console.log('\n\n\n\n\n\n=== uncaught Exception ==='.toUpperCase().bgGray);
        console.log('Exception: ', err.stack ? err.stack : err.bgGray)
        console.log('=== uncaught Exception ===\n\n\n\n\n'.toUpperCase().bgGray);
    })
    process.on('uncaughtExceptionMonitor', (err, origin) => {
        console.log('=== uncaught Exception Monitor ==='.toUpperCase().bgGray);
    });
    process.on('multipleResolves', (type, promise, reason) => {
        console.log('\n\n\n\n\n=== multiple Resolves ==='.toUpperCase().bgGray);
        console.log(type, promise, reason.bgGray);
        console.log('=== multiple Resolves ===\n\n\n\n\n'.toUpperCase().bgGray);
    });
};