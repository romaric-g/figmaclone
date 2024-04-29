import { Container, FillStyleInputs, Graphics, GraphicsContext, Point, Sprite } from "pixi.js";
import { Editor } from "../editor";
import { RectRenderer } from "../canvas/renderer/rect";
import { RectSelectionRenderer } from "../canvas/renderer/rectSelectionBox";
import { TreeComponent } from "./treeComponent";
import { TreeRectData } from "../../ui/subjects";
import { HsvaColor, RgbColor } from "@uiw/react-color";

interface ElementProps {
    x: number,
    y: number,
    width?: number,
    height?: number,
    fillColor?: HsvaColor
    name?: string
}

export class TreeRect extends TreeComponent<TreeRectData> {

    // private graphics: Graphics;

    private _contextEditor?: Editor;

    private _selected: boolean = false;
    private _movePositionOrigin?: Point;

    private _elementTreeRenderer: RectRenderer;
    private _elementSelectionRenderer: RectSelectionRenderer;

    private _hover: boolean = false;

    private _x: number;
    private _y: number;
    private _width: number;
    private _height: number;

    private _fillColor: HsvaColor;

    public get fillColor() {
        return this._fillColor
    }

    public set fillColor(value: HsvaColor) {
        this._fillColor = {
            h: value.h,
            s: value.s,
            v: value.v,
            a: Math.round((value.a + Number.EPSILON) * 100) / 100
        }
    }

    constructor({ x, y, width = 100, height = 100, fillColor = { h: 0, s: 0, v: 0, a: 1 }, name = "" }: ElementProps) {
        super(name)

        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
        this._fillColor = fillColor;

        this._elementSelectionRenderer = new RectSelectionRenderer(this)
        this._elementTreeRenderer = new RectRenderer(this)
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

    setHover(value: boolean) {
        this._hover = value;
    }

    render(zIndex: number) {
        this._elementSelectionRenderer.render(zIndex)
        this._elementTreeRenderer.render(zIndex)

        return zIndex + 1
    }

    getContainer() {
        return this._elementTreeRenderer.getContainer();
    }

    onSelectionInit() {
        this._selected = true;
    }

    onSelectionDestroy() {
        this._selected = false;
        this._hover = false;
    }

    isSelected() {
        return this._selected;
    }

    isHover() {
        return this._hover;
    }


    init() {
        if (this._contextEditor) {
            return;
        }

        console.log("INIT RECT")

        const editor = Editor.getEditor()

        this._contextEditor = editor;

        this._elementSelectionRenderer.init(editor.canvasApp.getSelectionLayer())
        this._elementTreeRenderer.init(editor.canvasApp.getTreeLayer())

        const graphics = this._elementTreeRenderer.getContainer()
        const eventsManager = editor.eventsManager;

        graphics.on('pointerdown', (event) => eventsManager.onElementPressDown.emit({
            element: this,
            pointerPosition: event.global
        }));
        graphics.on('pointerup', (event) => eventsManager.onElementPressUp.emit({ element: this }))
        graphics.on('pointerupoutside', (event) => eventsManager.onElementPressUp.emit({ element: this }))

        graphics.on('pointerenter', (event) => eventsManager.onElementHoverOn.emit({ component: this }));
        graphics.on('pointerleave', (event) => eventsManager.onElementHoverOff.emit({ component: this }));

        graphics.eventMode = "static"
    }

    destroy() {
        if (this._contextEditor) {
            this._elementSelectionRenderer.destroy(this._contextEditor.canvasApp.getSelectionLayer())
            this._elementTreeRenderer.destroy(this._contextEditor.canvasApp.getTreeLayer())
            this._contextEditor = undefined;
        }
    }

    setPosition(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    unfreezeOriginalPosition() {
        this._movePositionOrigin = undefined;
    }

    getOriginalPosition() {
        if (this._movePositionOrigin) {
            return this._movePositionOrigin;
        }
        return new Point(this.x, this.y)
    }

    freezeOriginalPosition() {
        this._movePositionOrigin = new Point(this.x, this.y);
    }

    getContextEditor() {
        return this._contextEditor;
    }

    toData(index: number): TreeRectData {
        return {
            type: "rect",
            index: index,
            name: this.getName(),
            selected: this.isSelected()
        }
    }

    getCoveredRect(): { minX: number; minY: number; maxX: number; maxY: number; } {
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


