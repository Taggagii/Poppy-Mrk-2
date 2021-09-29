const Discord = require('discord.js');
const {token} = require("./config.json");


const fs = require('fs');
const { count } = require('console');
const client = new Discord.Client({
    intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MEMBERS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.DIRECT_MESSAGES],
});

//this is where commands are stored
client.commands = new Object();

//we grab the name of all the js files from the 'commands' folder
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

//going through all the files we then pull the data from the export and set it as keys and values in the client.commands object
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    client.commands[command.createData.name] = {
        data: command.createData, 
        fn: command.fn
    };
    
}


//because we're not deploying yet we're using guilds to work with quick updates

const GUILDID = '874683259718598677'; //testing
//const GUILDID = "763134200035278908"; //main

client.on("ready", async () => {
    console.clear();
    console.log('------------------------------------------------------------------------------------------------------------------------------------------------------------------');
    //tells you when the bot turns on
    console.log(`${client.user.username} active`);
    client.user.setPresence({activities: [{ name: "Making a dynamic bot", type: "PLAYING"}]})

    //grabs the appliactions connection to the guild
    const app = client.guilds.cache.get(GUILDID).commands;

    //clears old commands 
    const commands = await app.fetch();
    commands.forEach(command => {
        command.delete();
    });

    //goes through the commands in client.commands and creates them in the guild *ESSENTIAL, STOP DELETING THIS!*
    for (const command in client.commands)
    {
        app.create(client.commands[command].data);
    }
});




//when someone calls one of the functions
client.on('interactionCreate', async interaction => {
    //we make sure it's a command
    if (!interaction.isCommand()) return;
    try {
        //then we run the fn connected to that specific command
        client.commands[interaction.commandName].fn(interaction);
    } catch (error) {
        console.error(error);
        return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});


client.login(token);