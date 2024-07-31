import { Editor } from "../editor";
import { TreeText } from "../tree/treeText";
import { DrawTool } from "./drawTool";


export class TextTool extends DrawTool {

    constructor() {
        super("text")
    }

    getNewDrawingBox(x: number, y: number) {
        return new TreeText({
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
}