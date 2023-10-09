import { Events, ChatInputCommandInteraction } from 'discord.js';
import Event from '../Classes/Event';
import Bot from '../Classes/Bot';

export default class onCommand extends Event {
    client: Bot;

    constructor(client) {
        super(Events.InteractionCreate);
        this.client = client;
    }

    async run(interaction: ChatInputCommandInteraction) {
        if (!interaction.isCommand()) return;
        let SubCommandName = null;
        if(interaction.options.getSubcommand() != null) {
            this.client.subCommands.get(interaction.commandName).subCommands.forEach(subCommand => {
                const subCommandName = new subCommand(this.client)
                if(subCommandName.name == interaction.options.getSubcommand()) {
                    SubCommandName = subCommandName        
                }    
            })
        }
        
        if(interaction.commandName === "dev" && !this.client.botAdmis.includes(interaction.user.id)) return interaction.reply("You are not allowed to use this command!");
        
        const command = SubCommandName == null ? this.client.commands.get(interaction.commandName) : SubCommandName;
        if (!command) return;

        try {           
            await command.run(interaction);
        } catch (error) {
            console.error(error);
            await interaction.editReply({ content: "There was an error with `" + command.name + "` please report it!" });
        }
    }
}