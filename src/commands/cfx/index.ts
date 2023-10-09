import { SubCommandHandler } from "../../Classes/Command";
import UptimeSubCommand from "./uptime";

export default class cfx extends SubCommandHandler {
    constructor(client) {
        super(client, "cfx", "Commands for the cfx.re", 5, false, [
            UptimeSubCommand
        ])
    }
}