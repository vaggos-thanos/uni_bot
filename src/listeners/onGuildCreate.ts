import Bot from "../Classes/Bot";
import { Events, Guild } from "discord.js";
import Event from "../Classes/Event";

export default class onGuildCreate extends Event {
    client: Bot;
    constructor(client) {
        super(Events.GuildCreate);
        this.client = client;
    }

    async run(guild: Guild) {
        await this.client.dbManager.create_row('GuildSettingsFiveM', 'guild_id', guild.id)
        await this.client.GuildConfigs.set(guild.id, {guild_id: guild.id, lastSendDate: null})
        
    }
}