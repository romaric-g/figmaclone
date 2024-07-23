import { DeleteSelectedElements } from "../../actions/deleteSelectedElements";
import { GroupeSelectionAction } from "../../actions/groupeSelectionAction";
import { UpdateSelectionPropertiesAction } from "../../actions/updateSelectionPropertiesAction";
import { Editor } from "../../editor";
import { KeyboardAction } from "../keyboardAction";
import { KeyboardAttach } from "../keyboardAttach";


export class CanvasAttach extends KeyboardAttach {

    constructor() {
        super()

        const editor = Editor.getEditor()

        this.add(
            new KeyboardAction("backspace", () => {
                const selection = editor.selectionManager.getSelection()
                if (!selection.isEmpty()) {
                    editor.actionManager.push(
                        new DeleteSelectedElements(selection)
                    )
                }

            }),
            new KeyboardAction("left", (type) => {
                if (type == "down") {
                    const selection = editor.selectionManager.getSelection()
                    if (!selection.isEmpty()) {
                        editor.actionManager.push(
                            new UpdateSelectionPropertiesAction(selection, (selection) => selection.addX(-5))
                        )
                    }
                }
            }),
            new KeyboardAction("right", (type) => {
                if (type == "down") {
                    const selection = editor.selectionManager.getSelection()
                    if (!selection.isEmpty()) {
                        editor.actionManager.push(
                            new UpdateSelectionPropertiesAction(selection, (selection) => selection.addX(5))
                        )
                    }
                }
            }),
            new KeyboardAction("up", (type) => {
                if (type == "down") {
                    const selection = editor.selectionManager.getSelection()
                    if (!selection.isEmpty()) {
                        editor.actionManager.push(
                            new UpdateSelectionPropertiesAction(selection, (selection) => selection.addY(-5))
                        )
                    }
                }
            }),
            new KeyboardAction("down", (type) => {
                if (type == "down") {
                    const selection = editor.selectionManager.getSelection()
                    if (!selection.isEmpty()) {
                        editor.actionManager.push(
                            new UpdateSelectionPropertiesAction(selection, (selection) => selection.addY(5))
                        )
                    }
                }
            }),
            new KeyboardAction("g", (type) => {
                if (type == "down") {
                    if (editor.keyboardManager.keyboardController.keys.control.pressed) {
                        const selection = editor.selectionManager.getSelection()
                        if (!selection.isEmpty()) {
                            editor.actionManager.push(
                                new GroupeSelectionAction(selection)
                            )
                        }
                    }
                }
            })
        )

    }


}