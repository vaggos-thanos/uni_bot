import Bot from "../../Classes/Bot";
import { SubCommandHandler } from "../../Classes/Command";
import CheckDBSubcommand from "./checkDB";
import reloadCommandsSubcommand from "./reloadCommands";

export default class dev extends SubCommandHandler {
    client: Bot;
    constructor(client) {
        super(client, "dev", "Commands for the dev", 5, false, [
            reloadCommandsSubcommand,
            CheckDBSubcommand
        ])
    }
}