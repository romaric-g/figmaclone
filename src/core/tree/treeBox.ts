import { Point } from "pixi.js";
import { TreeComponentData, TreeRectData } from "../../ui/subjects";
import { TreeComponent } from "./treeComponent";
import { Editor } from "../editor";

export interface TreeBoxProps {
    name: string,
    id?: string,
    x: number,
    y: number,
    width: number,
    height: number
}


export abstract class TreeBox<T extends TreeComponentData = TreeComponentData> extends TreeComponent<T> {

    protected _hover: boolean = false;
    protected _selected: boolean = false;

    private _x!: number;
    private _y!: number;
    private _width!: number;
    private _height!: number;

    constructor({ id, name, x, y, width, height }: TreeBoxProps) {
        super({ id, name })
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
    }

    set x(value: number) {
        this._x = Math.round((value) * 100) / 100
    }

    get x() {
        return this._x
    }

    set y(value: number) {
        this._y = Math.round((value) * 100) / 100
    }

    get y() {
        return this._y
    }

    set width(value: number) {
        this._width = Math.round((value) * 100) / 100
    }

    get width() {
        return this._width
    }

    set height(value: number) {
        this._height = Math.round((value) * 100) / 100
    }

    get height() {
        return this._height
    }

    getDrawingCoveredRect(): { minX: number; minY: number; maxX: number; maxY: number; } {
        return {
            minX: this.x,
            minY: this.y,
            maxX: this.x + this.width,
            maxY: this.y + this.height
        }
    }

    getCanvasCoveredRect(): { minX: number; minY: number; maxX: number; maxY: number; } {
        const editor = Editor.getEditor()

        const globalPoint = editor.getCanvasPosition(new Point(this.x, this.y))
        const [globalWidth, globalHeight] = editor.getCanvasSize(this.width, this.height)

        return {
            minX: globalPoint.x,
            minY: globalPoint.y,
            maxX: globalPoint.x + globalWidth,
            maxY: globalPoint.y + globalHeight
        }
    }
}