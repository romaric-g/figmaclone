import { contextMenuChangeSubject } from "../../ui/subjects";
import { SelectedComponentsModifier } from "../selections/selectedComponentsModifier";
import { CopyItem } from "./items/copyItem";
import { DelItem } from "./items/delItem";
import { GroupeItem } from "./items/groupeItem";
import { PasteItem } from "./items/pasteItem";
import { Menu } from "./menu";
import { Editor } from "../editor";
import { SetSelectionAction } from "../actions/setSelectionAction";
import { UndoItem } from "./items/undoItem";

export class MenuManager {

    init() {
        const editor = Editor.getEditor()

        editor.eventsManager.onPointerRightDown.subscribe((event) => {
            const editor = Editor.getEditor()
            const selection = editor.selectionManager.getSelectionModifier()
            const position = event.pointerPosition.clone();
            const originalEvent = event.originalEvent;

            const mouseIsInSelction = selection.mouseIsIn(position)

            if (mouseIsInSelction) {
                editor.menuManager.requestSelectionMenu(selection, originalEvent.clientX, originalEvent.clientY)
            } else {
                editor.menuManager.requestEmptyMenu(originalEvent.clientX, originalEvent.clientY)
            }
        })

        editor.eventsManager.onElementRightDown.subscribe((event) => {
            const selectionManager = editor.selectionManager;
            const selection = selectionManager.getSelectionModifier()
            const originalEvent = event.originalEvent

            const isIncludeInSelection = selection.getAllBoxComponents().includes(event.element)

            if (isIncludeInSelection) {
                editor.menuManager.requestSelectionMenu(selection, originalEvent.clientX, originalEvent.clientY)
            } else {

                const componentToSelect = selectionManager.getComponentsChainFromRoot(event.element)[0]

                Editor.getEditor().actionManager.push(
                    new SetSelectionAction(new SelectedComponentsModifier([componentToSelect]))
                )

                const newSelection = Editor.getEditor().selectionManager.getSelectionModifier()

                editor.menuManager.requestSelectionMenu(newSelection, originalEvent.clientX, originalEvent.clientY)

            }

        })

    }

    requestSelectionMenu(selection: SelectedComponentsModifier, x: number, y: number) {

        const menu = new Menu(x, y)

        menu.addItem(new CopyItem(selection))
        menu.addItem(new DelItem(selection))
        menu.addItem(new GroupeItem(selection))
        menu.addItem(new PasteItem())
        menu.addItem(new UndoItem())

        contextMenuChangeSubject.next(menu.toData())
    }

    requestEmptyMenu(x: number, y: number) {
        const menu = new Menu(x, y)

        menu.addItem(new PasteItem())
        menu.addItem(new UndoItem())

        contextMenuChangeSubject.next(menu.toData())

    }

}