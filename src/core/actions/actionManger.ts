import { Editor } from "../editor";
import { Action } from "./action";


export class ActionManager {

    push(action: Action) {
        const editor = Editor.getEditor()

        action.apply(editor)
    }

}
