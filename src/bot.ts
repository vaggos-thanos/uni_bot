require('dotenv').config();
import Bot from './Classes/Bot';
import { GatewayIntentBits } from 'discord.js'

const client = new Bot({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
    ]
});

client.dev = false;
client.Start(process.env.TOKEN, process.env.TOKEN_DEV);