

export abstract class MenuItem {

    readonly name: string;
    readonly key: string;

    constructor(name: string, key: string) {
        this.name = name;
        this.key = key;
    }

    abstract apply(): void

}