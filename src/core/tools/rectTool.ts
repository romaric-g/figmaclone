import { Editor } from "../editor";
import { TreeRect } from "../tree/treeRect";
import { DrawTool } from "./drawTool";


export class RectTool extends DrawTool {

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
}