import Bot from "src/Classes/Bot";
import { EmbedBuilder, TextChannel } from "discord.js";

export default class WelcomeService {
    client: Bot;
    channelId: string;
    channel: any;
    roleId: string;

    constructor(client: Bot) {
        this.client = client
        this.channelId = "1159020057213546557"
        this.roleId = "1160612853783461888"
    }

    async start() {
        this.channel = await this.client.guilds.fetch(this.client.guildId).then(guild => guild.channels.cache.get(this.channelId)) as TextChannel;
        await this.createListener()
    }

    async createListener() {
        this.client.on('guildMemberAdd', async (member) => {this.sendWelcomeMessage(member)})
    }


    async sendWelcomeMessage(member) {
        if(member.user.bot) return;

        const embed = new EmbedBuilder()
            .setColor('#34eb92')
            .setTitle(`Welcome to our community, ${member.user.username}!`)
            .setDescription('We are excited to have you here.')
            .setThumbnail(member.user.displayAvatarURL())
            .setTimestamp()
            .setFooter({text: 'Thanks for joining!'});

        await this.channel.send({embeds: [embed]});
        this.giveRoles(member)
    }

    async giveRoles(member) {
        await member.roles.add(this.roleId)
    }
}