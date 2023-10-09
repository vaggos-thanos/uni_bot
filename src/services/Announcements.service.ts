import Parser from 'rss-parser';
import Bot from '../Classes/Bot';
import { EmbedBuilder, Guild } from 'discord.js';

export default class AnnouncementsService {
    client: Bot;
    announcURL: string;
    announcChannel: string;
    safeStart: boolean = true;
    lastSendDate: string;

    constructor(client: Bot) { 
        this.client = client;
        this.announcURL = "https://www.iee.ihu.gr/category/news/feed"
        this.announcChannel = "1160670439761252362"
    }

    public async start(safeStart?: boolean) {
        this.startLogic(safeStart);
        setInterval(async () => {
            this.startLogic(safeStart);
        }, 1000 * 60 * 60 * 12);
    }

    private async startLogic(safeStart?: boolean) {
        this.lastSendDate = this.client.GuildConfigs.get(this.client.guildId).lastSendDate;
        console.log(this.lastSendDate);
        if(safeStart !== undefined) {
            this.safeStart = safeStart;
        }

        const feed = await this.getRssFeed();
        if(this.safeStart && this.lastSendDate !== feed.items[0].isoDate) {           
            await this.getLastDay(feed.items);
            this.sendAnnouncement(feed);
        }
    }

    async sendAnnouncement(feed) {
        const guild = await this.client.guilds.fetch(this.client.guildId)
        const channel = await guild.channels.cache.get(this.announcChannel);
        for(const data of feed.items.reverse()) {
            const words = data.title.split(' ');
            const truncatedWords = words.slice(0, 14);
            const truncatedTitle = truncatedWords.join(' ');

            const embed = new EmbedBuilder()
            .setTitle(truncatedTitle)
            .setURL(data.link)
            .setDescription(data.contentSnippet)
            .setTimestamp(new Date(data.isoDate))
            .setFooter({text: feed.description})
            .setColor('#9f71f5');
            if(channel.isTextBased()) channel.send({embeds: [embed]});

            await this.client.functions.sleep(5000)
        }        
    }

    async getLastDay(items: any[]) {
        const today = new Date().getTime();
        let closestDay = items[0];
        let closestDiff = Math.abs(today - new Date(closestDay.isoDate).getTime());
        for (const item of items) {
            const itemDate = new Date(item.isoDate).getTime();
            const diff = Math.abs(today - itemDate);
            if (diff < closestDiff) {
                closestDay = item;
                closestDiff = diff;
            }
        }
        const update = await this.client.dbManager.update_row('Guilds', 'lastSendDate', closestDay.isoDate, 'guild_id', this.client.guildId);
        if(!update.data) return console.log('Failed to update lastSendDate');
        this.client.GuildConfigs.get(this.client.guildId).lastSendDate = closestDay.isoDate;
        this.lastSendDate = closestDay.isoDate
    }

    async getRssFeed() {
        const parser = new Parser();
        return await parser.parseURL(this.announcURL);
    }
}