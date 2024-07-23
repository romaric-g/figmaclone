import { Editor } from "../editor";



export abstract class Action {

    readonly name: string;

    constructor(name: string) {
        this.name = name
    }


    apply(editor: Editor) {

    }

}