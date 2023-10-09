import { EmbedBuilder } from "discord.js";
import Bot from "../../Classes/Bot";
import { SubCommand } from "../../Classes/Command";

export default class reloadCommandsSubcommand extends SubCommand {
    client: Bot;
    constructor(client) {
        super("reloadcommands", "Reloads all commands", 0, false);
        this.client = client;
    }

    async run(interaction) {
        try {
            const guildId = interaction.options.getString('guildid') ? interaction.options.getString('guildid') : interaction.guild.id;
            await this.client.SlashCommandBuild(this.client.user.id, guildId, 'local', false);
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('Commands Reloaded')
                .setDescription('All commands have been reloaded')

            await interaction.reply({embeds: [embed], ephremeral: true});
        } catch (error) {
            console.log(error)
        }
    }
}