import DiscordJS, {Intents} from 'discord.js';
import WOKCommands from "wokcommands";
import * as path from "path";
import dotenv from 'dotenv';

dotenv.config();

const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
});

client.on('ready', () => {
    console.log('The bot is ready')

    const guildId = '927643625964331148';
    const guild = client.guilds.cache.get(guildId);
    let commands;

    if (guild) {
        commands = guild.commands;
    } else {
        commands = client.application?.commands;
    }

    commands?.create({
        name: 'ping',
        description: 'Replies with pong'
    });

    commands?.create({
        name: 'add',
        description: 'Adds two numbers',
        options: [
            {
                name: 'num1',
                description: 'The first number',
                required: true,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
            },
            {
                name: 'num2',
                description: 'The second number',
                required: true,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
            },
        ]
    })
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) {
        return
    }

    const {commandName, options} = interaction

    if (commandName === 'ping') {
        await interaction.reply({
            content: 'pong',
            ephemeral: true
        });
    } else if (commandName === 'add') {
        const num1 = options.getNumber('num1')!;
        const num2 = options.getNumber('num2')!;

        await interaction.deferReply({
            ephemeral: true
        })

        await new Promise(resolve => setTimeout(resolve, 5000));

        await interaction.editReply({
            content: `The sum is ${num1 + num2}`
        })
    }
})

client.on('messageCreate', (msg) => {
    if (msg.content === 'ping') {
        msg.reply({
            content: 'pong'
        });
    }
});

client.login(process.env.TOKEN);