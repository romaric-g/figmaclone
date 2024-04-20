import { Point } from "pixi.js";
import { SelectTool } from "../selectTool";
import { TreeRect } from "../../tree/treeRect";

export abstract class SelectToolState {

    protected selectTool: SelectTool;

    constructor(selectTool: SelectTool) {
        this.selectTool = selectTool;
    }

    abstract onInit(): void

    abstract onDestroy(): void

    abstract onClickDown(element: TreeRect, shift: boolean, pointerPosition: Point): void

    abstract onClickUp(element: TreeRect, shift: boolean): void

    abstract onMove(newPosition: Point): void

    abstract onBackgroundPointerDown(clickPosition: Point): void

    abstract onBackgroundPointerUp(clickPosition: Point): void

}

