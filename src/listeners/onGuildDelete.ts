import Bot from "../Classes/Bot";
import { Events, Guild } from "discord.js";
import Event from "../Classes/Event";

export default class onGuildCreate extends Event {
    client: Bot;
    constructor(client) {
        super(Events.GuildDelete);
        this.client = client;
    }

    async run(guild: Guild) {
        await this.client.dbManager.delete_row('GuildSettingsFiveM', 'guild_id', guild.id)
        await this.client.GuildConfigs.delete(guild.id)
    }
}