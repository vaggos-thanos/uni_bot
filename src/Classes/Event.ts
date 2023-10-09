export default class Event {
    name: string;
    once?: boolean;

    constructor(name: string, once?: boolean) {
        this.name = name;
        this.once = once == undefined ? false : once;
    }

    run(...args) {}
}