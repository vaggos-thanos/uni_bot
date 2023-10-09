import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Events, TextChannel } from "discord.js";
import Bot from "src/Classes/Bot";

export default class SelectRolesService {
    client: Bot;
    channelId: string;
    channel: any;
    roleIds: object;
    guild: any;

    constructor(client: Bot) {
        this.client = client
        this.channelId = "1160701428034187354"
        this.roleIds = {
            a1: "1159020280224698408",
            a2: "1159020315645591582",
            male: "1160612883709821082",
            female: "1160612909680971917",
            developer: "1160720955535020143",
            anime: "1160717611785519124",
            gamer: "1160715751288750131"
        }
    }

    async start() {
        if(!await this.checkChannel()) return;
        await this.createListener()
    }

    private async checkChannel() {
        this.guild = this.client.guilds.cache.get(this.client.guildId);
        this.channel = this.guild.channels.cache.get(this.channelId);
        if(!this.channel) return false;
        return true;
    }

    async createListener() {
        this.client.on(Events.InteractionCreate, async (interaction) => {this.buttonHandler(interaction)})
    }

    async buttonHandler(interaction) {
        if(!interaction.isButton()) return;
        const member = interaction.member;
        await interaction.deferReply({ephemeral: true});

        switch(interaction.customId) {
            case "A1":
                if(member.roles.cache.has(this.roleIds['a1'])) {
                    await member.roles.remove(this.roleIds['a1'])
                    interaction.editReply({content: `${member} have been removed from the <@&${this.roleIds['a2']}> role!`, ephemeral: true})
                    return;
                }
                await member.roles.add(this.roleIds['a1'])
                interaction.editReply({content: `${member} have been given the <@&${this.roleIds['a1']}> role!`, ephemeral: true})
            break;

            case "A2":
                if(member.roles.cache.has(this.roleIds['a2'])) {
                    await member.roles.remove(this.roleIds['a2'])
                    interaction.editReply({content: `${member} have been removed from the <@&${this.roleIds['a2']}> role!`, ephemeral: true})
                    return;
                }
                await member.roles.add(this.roleIds['a2'])
                interaction.editReply({content: `${member} have been given the <@&${this.roleIds['a2']}> role!`, ephemeral: true})
            break;  

            case "male":
                if(member.roles.cache.has(this.roleIds['male'])) {
                    await member.roles.remove(this.roleIds['male'])
                    interaction.editReply({content: `${member} have been removed from the <@&${this.roleIds['male']}> role!`, ephemeral: true})
                    return;
                }
                await member.roles.add(this.roleIds['male'])
                interaction.editReply({content: `${member} have been given the <@&${this.roleIds['male']}> role!`, ephemeral: true})
            break;

            case "female":
                if(member.roles.cache.has(this.roleIds['female'])) {
                    await member.roles.remove(this.roleIds['female'])
                    interaction.editReply({content: `${member} have been removed from the <@&${this.roleIds['female']}> role!`, ephemeral: true})
                    return;
                }
                await member.roles.add(this.roleIds['female'])
                interaction.editReply({content: `${member} have been given the <@&${this.roleIds['female']}> role!`, ephemeral: true})
            break;
            
            case "developer":
                if(member.roles.cache.has(this.roleIds['developer'])) {
                    await member.roles.remove(this.roleIds['developer'])
                    interaction.editReply({content: `${member} have been removed from the <@&${this.roleIds['developer']}> role!`, ephemeral: true})
                    return;
                }
                await member.roles.add(this.roleIds['developer'])
                interaction.editReply({content: `${member} have been given the <@&${this.roleIds['developer']}> role!`, ephemeral: true})
            break;

            case "anime":
                if(member.roles.cache.has(this.roleIds['anime'])) {
                    await member.roles.remove(this.roleIds['anime'])
                    interaction.editReply({content: `${member} have been removed from the <@&${this.roleIds['anime']}> role!`, ephemeral: true})
                    return;
                }
                await member.roles.add(this.roleIds['anime'])
                interaction.editReply({content: `${member} have been given the <@&${this.roleIds['anime']}> role!`, ephemeral: true})
            break;

            case "gamer":
                if(member.roles.cache.has(this.roleIds['gamer'])) {
                    await member.roles.remove(this.roleIds['gamer'])
                    interaction.editReply({content: `${member} have been removed from the <@&${this.roleIds['gamer']}> role!`, ephemeral: true})
                    return;
                }
                await member.roles.add(this.roleIds['gamer'])
                interaction.editReply({content: `${member} have been given the <@&${this.roleIds['gamer']}> role!`, ephemeral: true})
            break;
        }
    }

    async sendMessage() {
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Select your roles')
            .setDescription('Please select the roles that apply to you.')
            .setTimestamp()
            .setThumbnail(this.guild.iconURL())

        const buttons = await this.getButtons();
        await this.channel.send({embeds: [embed], components: buttons});
    }

    async getButtons() {
        const row1 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('male').setLabel('male').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('A1').setLabel('A1').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('A2').setLabel('A2').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('female').setLabel('female').setStyle(ButtonStyle.Danger),
        )

        const row2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('developer').setLabel('developer').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('anime').setLabel('anime').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('gamer').setLabel('gamer').setStyle(ButtonStyle.Success),
        )
        
        return [row1, row2]
    }
}