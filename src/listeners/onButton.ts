import { Events, ButtonStyle, ButtonBuilder, ActionRowBuilder, EmbedBuilder, Interaction } from 'discord.js';
import Event from '../Classes/Event'
import Bot from '../Classes/Bot';

export default class onButton extends Event {
    client: Bot;
    constructor(client) {
        super(Events.InteractionCreate);
        this.client = client;
    }

    async run(interaction: Interaction) {
        if (!interaction.isButton()) return;

    }
}