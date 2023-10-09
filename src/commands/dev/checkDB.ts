import Bot from "../../Classes/Bot";
import { SubCommand } from "../../Classes/Command";

export default class CheckDBSubcommand extends SubCommand {
    client: Bot;
    constructor(client) {
        super("checkdb", "check database", 0, false);
    }

    getSlashCommandBuilder() {
        const builder = super.getSlashCommandBuilder();
        builder.addBooleanOption(
            option => option.setName("check").setDescription("check database").setRequired(false)
        )
        .addBooleanOption(
            option => option.setName("autofix").setDescription("auto fixes the problems to the tables").setRequired(false)
        )
        .addStringOption(
            option => option.setName("table").setDescription("table to check").setRequired(false)
        )
        .addStringOption(
            option => option.setName("row").setDescription("column to check").setRequired(false)
        )
        return builder;
    }

    async run(interaction) {
        const check = interaction.options.getBoolean("check");
        const table = interaction.options.getString("table");
        const row = interaction.options.getString("row");


    }
}