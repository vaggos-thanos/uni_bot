require('dotenv').config();
import Bot from './Classes/Bot';
import { GatewayIntentBits } from 'discord.js'

const client = new Bot({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
    ]
});

client.dev = true;
client.SlashCommandBuild("1117064684911206410", "954056086237880340", 'local', false)