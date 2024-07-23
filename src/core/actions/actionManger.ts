import { Editor } from "../editor";
import { Action } from "./action";


export class ActionManager {

    push(action: Action) {

        console.log("new action pushed", action.name)

        const editor = Editor.getEditor()

        action.apply(editor)
    }

}
