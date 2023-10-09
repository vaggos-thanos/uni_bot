import colors from 'ansi-colors';
import Bot from './Bot';

type initType = {
    done: boolean
}

class db_handler {
    mysql: any;
    toggle: boolean;
    client: Bot;
    identifier: any;
    database_name: string;

    constructor(client, mysql, toggle?: boolean) {
        this.mysql = mysql;
        this.toggle = toggle ? toggle : true;
        this.client = client;
    }

    async login(host: string, username: string, password: string, database: string): Promise<any> {  
        let while_v = true

        const db = this.mysql.createPool({
            host: host,
            user: username,
            password: password,
            database: database
        })

        db.query('SELECT * FROM INFORMATION_SCHEMA.TABLES', (err, rows) => {
            if (err) {
                log('Failed to login! ❌', this.toggle, 'red')
                throw err;
            }
            this.identifier = db;
            this.database_name = database;

            log('[+] Connected to database', this.toggle , 'green');

            while_v = false
        })

        while(while_v) {
            await sleep(10)
        }
        
        return db;
    }

    async init(db_names: string[], local_dbs: any[]): Promise<initType> {
        let counter = 0
        while(counter < db_names.length) {
            const db_data = await this.get_all_rows(db_names[counter]);
            let counter1 = 0
            while(counter1 < db_data.length) {
                let key;
                const data = db_data[counter1];
                if(db_names[counter] == 'GuildSettingsFiveMServers') {
                    key = data.server_ip
                } else if (db_names[counter] == "GuildSettingsCfxData") {
                    key = data.id
                }else {
                    key = data.guild_id
                }
                local_dbs[counter].set(key, data);
                counter1++
            }
            counter++;              
        }
        console.log(colors.green('[+] Local Database initialized!'));
        return {done: true}
    }

    async check_table(table_name: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.identifier.query(`SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = '${table_name}'`, (err, rows) => {
                if (err) {
                    reject(err);
                }
                if(rows.length == 0) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            })
        })
    }

    // check_table_content(table_name, key_name, key_value) {
        
    // }

    async get_all_rows(table_name: string): Promise<any> {
        let while_v = true
        let Rows = []

        this.identifier.query(`SELECT * FROM ${table_name}`, (err, rows) => {
            if (err) {
                throw err;
            }
            while_v = false
            Rows.push(rows);
        })

        while(while_v) {
            await sleep(10)
        }

        return Rows[0];
    }

    async get_row(table_name: string, key_name: string, key_value: string): Promise<any> {
        let while_v = true
        let Rows = []

        this.identifier.query(`SELECT * FROM ${table_name} WHERE ${key_name} = ${key_value}`, (err, rows) => {
            if (err) throw err;
            while_v = false
            Rows.push(rows);
        })

        while(while_v) {
            await sleep(10)
        }
        return Rows[0][0];
    }

    async create_row(table_name: string, values_keys: string, values: string, ignore?: boolean): Promise<any> {
        let while_v = true
        let code = []
        values_keys = values_keys != null ? `(${values_keys})` : ' '
        let ignore_v = ignore ? 'IGNORE' : ' '
        this.identifier.query(`INSERT ${ignore_v} INTO ${table_name} ${values_keys} VALUES (${values})`, (err, rows) => {
            if (err) throw err;
            code.push({
                text: 'Done!', 
                value: true,
                data: [values]
            })
            while_v = false
        })

        while(while_v) {
            await sleep(10)
        }
        return code[0];
    }

    async update_row(table_name: string, set_value: string, value: string, key_name: string, key_value: string): Promise<any> {
        let while_v = true
        let code = []
        let set = ''
        if(set_value.split(',').length > 1) {
            const set_values = set_value.split(',')
            const values = value.split(',')
            let comma = ','
            for (const word of set_values) {
                if(set_values.indexOf(word) == set_values.length - 1) comma = ''
                set += `${word} = "${values[set_values.indexOf(word)]}"${comma}`
            }
        } else {
            set = `${set_value} = '${value}'`
        }

        this.identifier.query(`UPDATE IGNORE ${table_name} SET ${set} WHERE ${key_name} = ${key_value}`, (err, rows) => {
            if (err) throw err;
            this.identifier.query(`SELECT * FROM ${table_name} WHERE ${key_name} = ${key_value}`, (err, rows) => {
                code.push({
                    text: 'Done!', 
                    value: true,
                    data: rows[0]
                })
                while_v = false
            })
        })
        
        while(while_v) {
            await sleep(10)
        }

        return code[0];
    }

    async delete_row(table_name: string, key_name: string, key_value: string): Promise<any> {
        let while_v = true
        let code = []

        this.identifier.query(`DELETE IGNORE FROM ${table_name} WHERE ${key_name} = ${key_value}`, (err, rows) => {
            if (err) throw err;
            code.push({
                text: 'Done!', 
                value: true,
                data: undefined
            })
            while_v = false
        })

        while(while_v) {
            await sleep(10)
        }

        return code[0];
    }

    async query(query: string): Promise<any> {
        let while_v = true
        let Rows = []

        this.identifier.query(query, (err, rows) => {
            if (err) {
                throw err;
            }
            while_v = false
            Rows.push(rows);
        })

        while(while_v) {
            await sleep(10)
        }

        return Rows[0];
    }
}

function log(msg: string, toggle: boolean, color_: string): void {
    let color = color_ ? color_ : 'white';

    if(toggle) {
        console.log(colors[color](msg));
    }
}

async function sleep(ms: number): Promise<any> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default db_handler