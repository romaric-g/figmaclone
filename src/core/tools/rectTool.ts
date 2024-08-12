import { SetSelectionAction } from "../actions/setSelectionAction";
import { Editor } from "../editor";
import { SelectedComponentsModifier } from "../selections/selectedComponentsModifier";
import { TreeBox } from "../tree/treeBox";
import { TreeRect } from "../tree/treeRect";
import { DrawTool } from "./drawTool";
import { SelectionState } from "./selectStates/selectionState";
import { SelectTool } from "./selectTool";


export class RectTool extends DrawTool<TreeRect> {


    constructor() {
        super("rect")
    }

    getNewDrawingBox(x: number, y: number) {
        return new TreeRect({
            x,
            y,
            width: 0,
            height: 0,
            name: Editor.getEditor().treeManager.getNextName(),
            fillColor: {
                h: 0,
                s: 0,
                v: 80,
                a: 1
            }
        })
    }

    validateDrawingBox(drawingBox: TreeRect): void {

        const editor = Editor.getEditor()

        editor.selectionManager.setSelectionModifier(new SelectedComponentsModifier([drawingBox]))
        editor.toolManager.setCurrentTool("select")

        editor.actionManager.push(
            new SetSelectionAction(editor.selectionManager.getSelectionModifier())
        )

        const currentTool = editor.toolManager.getCurrentTool()
        if (currentTool instanceof SelectTool) {
            currentTool.setState(new SelectionState(currentTool))
        }
    }
}