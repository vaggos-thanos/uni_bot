import Bot from 'src/Classes/Bot';
import { SubCommand } from '../../Classes/Command';
import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

export default class UptimeSubCommand extends SubCommand {
    client: Bot;
    constructor(client) {
        super('uptime', 'Show the uptime of the Cfx Forum', 0, false);
        this.client = client;
    }

    async run(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        // const cfxStatus = await this.client.CfxStatusService.getStatus();
        // interaction.editReply('Cfx Forum is ' + cfxStatus.indicator + ' ' + cfxStatus.description);
    }
}