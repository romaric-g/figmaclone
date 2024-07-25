import { selectionChangeSubject, treeElementSubject } from "../../../ui/subjects";
import { DeleteSelectedElementsAction } from "../../actions/deleteSelectedElementsAction";
import { GroupeSelectionAction } from "../../actions/groupeSelectionAction";
import { PasteCopiedSelectionAction } from "../../actions/pasteCopiedSelectionAction";
import { SetSelectionPropertiesAction } from "../../actions/setSelectionPropertiesAction";
import { UndoAction } from "../../actions/undoAction";
import { UpdateSelectionPropertiesAction } from "../../actions/updateSelectionPropertiesAction";
import { Editor } from "../../editor";
import { Snapshot } from "../../history/snapshot";
import { KeyboardAction } from "../keyboardAction";
import { KeyboardAttach } from "../keyboardAttach";


let snapshot: Snapshot | undefined;

export class CanvasAttach extends KeyboardAttach {

    constructor() {
        super()

        const editor = Editor.getEditor()

        this.add(
            new KeyboardAction("backspace", (type) => {
                const selection = editor.selectionManager.getSelection()

                if (type == "down") {
                    if (!selection.isEmpty()) {
                        editor.actionManager.push(
                            new DeleteSelectedElementsAction(selection)
                        )
                    }
                }

            }),
            new KeyboardAction("left", (type) => {
                const selection = editor.selectionManager.getSelection()
                if (!selection.isEmpty()) {
                    if (type == "down") {
                        editor.actionManager.push(
                            new UpdateSelectionPropertiesAction(selection, (selection) => selection.addX(-5))
                        )
                    } else {
                        editor.actionManager.push(
                            new SetSelectionPropertiesAction(selection)
                        )
                    }
                }

            }),
            new KeyboardAction("right", (type) => {
                const selection = editor.selectionManager.getSelection()
                if (!selection.isEmpty()) {
                    if (type == "down") {
                        editor.actionManager.push(
                            new UpdateSelectionPropertiesAction(selection, (selection) => selection.addX(5))
                        )
                    } else {
                        editor.actionManager.push(
                            new SetSelectionPropertiesAction(selection)
                        )
                    }
                }
            }),
            new KeyboardAction("up", (type) => {
                const selection = editor.selectionManager.getSelection()
                if (!selection.isEmpty()) {
                    if (type == "down") {
                        editor.actionManager.push(
                            new UpdateSelectionPropertiesAction(selection, (selection) => selection.addY(-5))
                        )
                    } else {
                        editor.actionManager.push(
                            new SetSelectionPropertiesAction(selection)
                        )
                    }
                }
            }),
            new KeyboardAction("down", (type) => {
                const selection = editor.selectionManager.getSelection()
                if (!selection.isEmpty()) {
                    if (type == "down") {
                        editor.actionManager.push(
                            new UpdateSelectionPropertiesAction(selection, (selection) => selection.addY(5))
                        )
                    } else {
                        editor.actionManager.push(
                            new SetSelectionPropertiesAction(selection)
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
            }),
            new KeyboardAction("c", (type) => {
                if (type == "down") {
                    if (editor.keyboardManager.keyboardController.keys.control.pressed) {
                        const selection = editor.selectionManager.getSelection()
                        if (!selection.isEmpty()) {
                            editor.selectionManager.copySelection()
                        }
                    }
                }
            }),
            new KeyboardAction("v", (type) => {
                if (type == "down") {
                    if (editor.keyboardManager.keyboardController.keys.control.pressed) {
                        const copiedSelection = editor.selectionManager.getCopiedSelection()

                        if (copiedSelection) {
                            editor.actionManager.push(
                                new PasteCopiedSelectionAction(copiedSelection)
                            )
                        }
                    }
                }
            }),
            new KeyboardAction("z", (type) => {
                if (type === "down") {
                    if (editor.keyboardManager.keyboardController.keys.control.pressed) {
                        editor.actionManager.push(
                            new UndoAction()
                        )
                    }

                }
            })
        )

    }


}