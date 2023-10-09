import Bot from 'src/Classes/Bot';
import { SubCommand } from '../../Classes/Command';
import { ChannelType, ChatInputCommandInteraction, SlashCommandSubcommandBuilder } from 'discord.js';

export default class MonitorSubCommand extends SubCommand {
    client: Bot;
    constructor(client) {
        super('monitor', 'A live monitor for Cfx activity', 0, false);
        this.client = client;
    }

    getSlashCommandBuilder() {
        const builder = super.getSlashCommandBuilder();
        builder.addChannelOption(option => 
            option.setName('channel')
            .setDescription('The channel to send the monitor to')
            .setRequired(true)
        ).addBooleanOption(option =>
            option.setName('enable')
            .setDescription('Enable or disable the monitor')
            .setRequired(true)
        ).addBooleanOption(option =>
            option.setName('notify_me')
            .setDescription('Notify me when the server is online')
            .setRequired(true)
        )
        return builder;
    }

    async run(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        const channel = interaction.options.getChannel('channel');
        const enable = interaction.options.getBoolean('enable');
        const notify_me = interaction.options.getBoolean('notify_me');
        if(channel.type !== ChannelType.GuildText) return interaction.editReply({content: 'You must provide a text channel'});
        // if(enable) {
        //     const monitor = await this.client.CfxMonitorService.addChannel(interaction.guild, channel.id, notify_me)
        //     if(monitor.status) return interaction.editReply({content: monitor.message});
        //     else return interaction.editReply({content: monitor.message});

        // } else {
        //     const monitor = await this.client.CfxMonitorService.removeChannel(channel.id, interaction.guild);
        //     if(monitor.status) return interaction.editReply({content: monitor.message});
        //     else return interaction.editReply({content: monitor.message});
        //     // interaction.channel.
        // }
       
    }
}