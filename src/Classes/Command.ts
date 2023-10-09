import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandSubcommandBuilder } from 'discord.js';

interface Command {
    name: string;
    description: string;
    cooldown: number;
    ownerOnly: boolean;
    permissions: bigint;
    OnlyRoles: string[];
    OnlyUsers: string[];
}

class Command {
    constructor(name: string, description: string, cooldown: number, ownerOnly?: boolean, permissions?: bigint, OnlyRoles?: string[], OnlyUsers?: string[]) {
        this.name = name;
        this.description = description;
        this.cooldown = cooldown;
        this.ownerOnly = ownerOnly;
        this.permissions = permissions;
        this.OnlyRoles = OnlyRoles;
        this.OnlyUsers = OnlyUsers;
    }

    getSlashCommandBuilder(): any  {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
    }

    run(interaction: ChatInputCommandInteraction) {}
}

interface SubCommandHandler {
    client: any;
    subCommands: any[];
}

class SubCommandHandler extends Command {
    constructor(client, name, description, cooldown, ownerOnly, SubCommands) {
        super(name, description, cooldown, ownerOnly);
        this.client = client;
        this.subCommands = SubCommands;
    }

    getSlashCommandBuilder() {
        const builder = super.getSlashCommandBuilder();
        if(this.subCommands.length > 0) {
            for (const SubCommand of this.subCommands) {
                const subCommand = new SubCommand(this.client).getSlashCommandBuilder()
                builder.addSubcommand(subCommand)
            }
        } 


        return builder;
    }

    async run(interaction) {
        if(!interaction.isCommand()) return;

        const subCommands = interaction.options.getSubcommand();

        for (const subCommand of this.subCommands) {
            if (subCommand.name === subCommands) {
                await new subCommand(this.client).run(interaction);
                return;
            }
        }
    }
}

class SubCommand extends Command {
    getSlashCommandBuilder() {
        return new SlashCommandSubcommandBuilder()
        .setName(this.name)
        .setDescription(this.description)
    }
}

export { Command, SubCommandHandler, SubCommand };