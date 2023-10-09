import colors from 'ansi-colors';

export default class functions {
    private formatDate(date) {
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        var hours = date.getHours();
        var mins  = date.getMinutes();
        var secs  = date.getSeconds();
        
        day = (day < 10 ? "0" : "") + day;
        month = (month < 10 ? "0" : "") + month;
        year = (year < 10 ? "0" : "") + year;
        hours = (hours < 10 ? "0" : "") + hours;
        mins = (mins < 10 ? "0" : "") + mins;
        secs = (secs < 10 ? "0" : "") + secs;

        return `${hours}:${mins}:${secs} ${day}/${month}/${year}`;
    }

    async log(str: string, error?: string): Promise<void> {
        if(error) {
            console.log(colors.red(`[${this.formatDate(new Date())}] ${str}`));
            console.log(error);
        } else {
            console.log(`${colors.cyan(`[${this.formatDate(new Date())}]:`)} ${str}`);
        }
        
    }

    async sleep(ms: number): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }

    async isOwner(member: string): Promise<boolean> {
        try {
            const users = ['667357315950706704']

            const state = users.reduce((result, user) => {
                return result || user == member
            }, false);
            return state;

        } catch (error: any) {
           this.log(error, error)
            return false
        }
    }

    async isAuthor(id: string): Promise<boolean> {
        try {
            const authors = ['588416409407848457'] /*Vaggos[1] */
            if (authors[0] == id) {
                return true
            }

            return false
        } catch (error: any) {
           this.log(error, error)
            return false
        }
    }
}