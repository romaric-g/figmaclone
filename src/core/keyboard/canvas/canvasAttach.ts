import { Editor } from "../../editor";
import { KeyboardAction } from "../keyboardAction";
import { KeyboardAttach } from "../keyboardAttach";


export class CanvasAttach extends KeyboardAttach {

    constructor() {
        super()

        const editor = Editor.getEditor()

        this.add(
            new KeyboardAction("backspace", () => {
                for (const element of editor.selectionManager.getSelection().getFlatComponents()) {
                    editor.treeManager.unregisterContainer(element)
                }
            }),
            new KeyboardAction("left", (type) => {
                if (type == "down") {
                    editor.selectionManager.getSelection().addX(-5)
                }
            }),
            new KeyboardAction("right", (type) => {
                if (type == "down") {
                    editor.selectionManager.getSelection().addX(5)
                }
            }),
            new KeyboardAction("up", (type) => {
                if (type == "down") {
                    editor.selectionManager.getSelection().addY(-5)
                }
            }),
            new KeyboardAction("g", (type) => {
                if (type == "down") {
                    if (editor.keyboardManager.keyboardController.keys.control.pressed) {
                        const selection = editor.selectionManager.getSelection()
                        editor.selectionManager.getRootContainer().groupeSelection(selection)
                    }
                }
            })
        )

    }


}