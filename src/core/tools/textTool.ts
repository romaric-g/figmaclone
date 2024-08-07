import { SetSelectionAction } from "../actions/setSelectionAction";
import { Editor } from "../editor";
import { SelectedComponentsModifier } from "../selections/selectedComponentsModifier";
import { TreeText } from "../tree/treeText";
import { DrawTool } from "./drawTool";
import { TextEditState } from "./selectStates/textEditState";
import { SelectTool } from "./selectTool";


export class TextTool extends DrawTool<TreeText> {

    constructor() {
        super("text")
    }

    getNewDrawingBox(x: number, y: number) {
        return new TreeText({
            text: "Bonjour à tous", // \u00A0
            x,
            y,
            width: 0,
            height: 0,
            name: Editor.getEditor().treeManager.getNextName(),
            fillColor: {
                h: 100,
                s: 20,
                v: 80,
                a: 1
            }
        })
    }

    validateDrawingBox(drawingBox: TreeText): void {
        const editor = Editor.getEditor()

        editor.selectionManager.setSelectionModifier(new SelectedComponentsModifier([drawingBox]))
        editor.toolManager.setCurrentTool("select")

        editor.actionManager.push(
            new SetSelectionAction(editor.selectionManager.getSelectionModifier())
        )

        const currentTool = editor.toolManager.getCurrentTool()
        if (currentTool instanceof SelectTool) {
            currentTool.setState(new TextEditState(currentTool, drawingBox))
        }
    }
}