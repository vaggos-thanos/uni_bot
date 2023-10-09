import Bot from "../Classes/Bot";
import { Events, ActivityType } from "discord.js";
import Event from "../Classes/Event";

export default class onReady extends Event {
    client: Bot;
    constructor(client) {
        super(Events.ClientReady, true);
        this.client = client;
    }

    async run() {
        await this.client.guilds.fetch()
        await this.client.AnnouncementsService.start();
        await this.client.WelcomeService.start();
        await this.client.SelectRolesService.start();
        // await this.client.SelectRolesService.sendMessage()

        this.client.functions.log('Logged in as ' + this.client.user.tag);
        this.client.functions.log('Bot is ready to serve ' + this.client.guilds.cache.size + ' servers');
        this.client.user.setPresence({ activities: [{ name: `${this.client.guilds.cache.size} servers`, type: ActivityType.Watching }], status: "online" })         

        setTimeout(() => {
            this.client.user.setPresence({ activities: [{ name: `${this.client.guilds.cache.size} servers`, type: ActivityType.Watching }], status: "online" })         
        }, 1000 * 60 * 60 * 12);

    }
}