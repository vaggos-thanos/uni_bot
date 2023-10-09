import { Client, Collection, REST, Routes } from "discord.js";
import fs from "fs";
import path from "path";
import mysql from "mysql2";
import prompt from "prompt-sync";

import db_handler from "./dbManager";
import functions from "./functions";
import AnnouncementsService from "../services/Announcements.service";
import WelcomeService from "../services/Welcome.service";
import SelectRolesService from "../services/SelectRoles.service";


interface Bot {
    client: Client;
    dev: boolean;
    botAdmis: string[];
    guildId: string

    commands: Collection<string, any>;
    subCommands: Collection<string, any>;
    events: Collection<string, any>;

    GuildConfigs: Collection<string, {guild_id: string; lastSendDate: string;}>;

    dbManager: db_handler;
    functions: functions;
    AnnouncementsService: AnnouncementsService;
    WelcomeService: WelcomeService;
    SelectRolesService: SelectRolesService;

}

class Bot extends Client {
    constructor(args) {
        super(args);
        this.dev;
        this.botAdmis = ["588416409407848457"] // vaggos
        this.guildId = "1159020056496308375"
        
        this.commands = new Collection();
        this.subCommands = new Collection();
        this.events = new Collection();

        this.GuildConfigs = new Collection();

        this.dbManager = new db_handler(this, mysql);
        this.functions = new functions();
        this.AnnouncementsService = new AnnouncementsService(this);
        this.WelcomeService = new WelcomeService(this);
        this.SelectRolesService = new SelectRolesService(this);
    }

    private async InitCommands(dir: string) {
        const commands = fs.readdirSync(path.join(__dirname, dir))
        for (const file of commands) {
            if(file.endsWith('.ts') || file.endsWith('.js')) {
                const command = new (require(path.join(__dirname, dir, file)).default)(this)
                if(command.name !== file.split(".ts")[0] || command.name !== file.split(".js")[0]) return console.log(`Command name mismatch: ${file} vs ${command.name}`)
                await this.commands.set(command.name, command)
                console.log(`Loaded command: ${file}`)
            } else if (fs.lstatSync(path.join(__dirname, dir, file)).isDirectory()) {
                this.InitSubCommands(path.join(dir, file))
            } else {
                console.log(`Ignored file: ${file}`)
            }
        }
    }

    private InitSubCommands(dir: string) {
        const commands = fs.readdirSync(path.join(__dirname, dir))
        for (const file of commands) {
            if (file.endsWith('.ts') || file.endsWith('.js')) {
                if (file.split(".ts")[0] == "index" || file.split(".js")[0] == "index"){
                    const command = new (require(path.join(__dirname, dir, file)).default)(this)
                    this.subCommands.set(command.name, command)
                }
            } else if (fs.lstatSync(path.join(__dirname, dir, file)).isDirectory()) {
                this.InitSubCommands(path.join(dir, file))
            } else {
                console.log(`Ignored file: ${file}`)
            }
        }
    }

    private async InitEvents(dir: string) {
        const events = fs.readdirSync(path.join(__dirname, dir))
        for (const file of events) {
            if(file.endsWith('.ts') || file.endsWith('.js')) {
                const event = new (require(path.join(__dirname, dir, file)).default)(this)
                await this.events.set(event.name, event)
                if(event.once) {
                    this.once(event.name, (...args) => event.run(...args))
                } else {
                    this.on(event.name, (...args) => event.run(...args))
                }
                console.log(`Loaded listener: ${file}`)
            } else if (fs.lstatSync(path.join(__dirname, dir, file)).isDirectory()) {
                await this.InitEvents(path.join(dir, file))
            } else {
                console.log(`Ignored file: ${file}`)
            }
        }
    }

    async SlashCommandBuild(ClientID: string, GuildID: string, scope: string, autoStart: boolean) {
        console.log('Starting Slash Command Build')
        if(!ClientID || !GuildID || !scope) console.log('Please enter the following information: (leave blank to skip)')

        ClientID = !ClientID ? prompt('What is your client id?') : ClientID;
        GuildID = !GuildID ? prompt('What is your guild id?') : GuildID;
        scope = !scope ? prompt('What is your scope?') : scope;

        console.log(`Building slash command for ${GuildID}`)
        const SlashCommands = [];

        await this.InitCommands('../commands');
        const commands = this.commands
        const subCommands = this.subCommands

        for (const [name, command] of commands) {
            SlashCommands.push((command.getSlashCommandBuilder()).toJSON())
            console.log(`Slash Command is Ready for Build: ${name}`)
        }

        for ( const [name, subCommand] of subCommands) {                
            if(!this.dev) if(name === "dev") continue;
            const slashCommandBuilder = subCommand.getSlashCommandBuilder()
            SlashCommands.push(slashCommandBuilder.toJSON())
            console.log(`SubCommand handler is Ready for Build: ${name}`)
        }
    
        console.log(`Registering slash commands for ${GuildID}`);
        console.log(`Client ID: ${ClientID}`);
        const rest = new REST({ version: '9' }).setToken(this.dev ? process.env.TOKEN_DEV : process.env.TOKEN);
        
        if(scope == "local") {
            rest.put(Routes.applicationGuildCommands(ClientID, GuildID), { body: SlashCommands })
            .then(() => console.log('Successfully registered application commands [LOCAL].'))
            .catch(error => {
                console.log(`Error registering application commands: ${error}`)
                console.log(error);
            });
        } else if (scope == "global") {
            rest.put(Routes.applicationCommands(ClientID), { body: SlashCommands })
            .then(() => console.log('Successfully registered application commands [GLOBAL].'))
            .catch(error => {
                console.log(`Error registering application commands: ${error}`)
            });
        }
        if(autoStart == false) return;
        const startBot = prompt('Do you want to start the bot? (y/n)')
        if(startBot.toLowerCase() == "y") {
            console.log('Starting bot... in 5 seconds')
            await this.functions.sleep(5000)
            await this.Start(process.env.TOKEN, process.env.TOKEN_DEV)
        } else {
            console.log('Bot not started')
        }
    }

    async Start(token: string, tokenDev: string) {
        await this.dbManager.login(
            process.env.DB_HOST, 
            process.env.DB_USER, 
            process.env.DB_PASSWORD, 
            process.env.DB_DATA
        )
        await this.dbManager.init(['Guilds'], [this.GuildConfigs]);
        await this.InitCommands('../commands');
        await this.InitEvents('../listeners');
        await super.login(this.dev ? tokenDev : token);
    }
}

export default Bot;