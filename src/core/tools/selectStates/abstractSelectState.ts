import { Point } from "pixi.js";
import { SelectTool } from "../selectTool";
import { TreeRect } from "../../tree/treeRect";
import { TreeBox } from "../../tree/treeBox";

export abstract class SelectToolState {

    protected selectTool: SelectTool;

    constructor(selectTool: SelectTool) {
        this.selectTool = selectTool;
    }

    abstract onInit(): void

    abstract onDestroy(): void

    abstract onClickDown(element: TreeBox, shift: boolean, pointerPosition: Point, double: boolean): void

    abstract onClickUp(element: TreeBox, shift: boolean): void

    abstract onMove(newPosition: Point): void

    abstract onBackgroundPointerDown(clickPosition: Point): void

    abstract onBackgroundPointerUp(clickPosition: Point): void

}

