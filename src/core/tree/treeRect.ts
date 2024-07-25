import { Container, FillStyleInputs, Graphics, GraphicsContext, Point, Sprite } from "pixi.js";
import { Editor } from "../editor";
import { RectRenderer } from "../canvas/renderer/rect";
import { RectSelectionRenderer } from "../canvas/renderer/rectSelectionBox";
import { TreeComponent } from "./treeComponent";
import { TreeRectData } from "../../ui/subjects";
import { HsvaColor, RgbColor } from "@uiw/react-color";
import { SerialisedTreeComponent } from "./serialized/serialisedTreeComponent";
import { SerialisedTreeRect } from "./serialized/serialisedTreeRect";
import { hsvaToRgba, rgbaToHsva } from '@uiw/color-convert'

interface ElementProps {
    x?: number,
    y?: number,
    width?: number,
    height?: number,
    fillColor?: HsvaColor,
    borderColor?: HsvaColor
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

    private _x!: number;
    private _y!: number;
    private _width!: number;
    private _height!: number;
    private _fillColor!: HsvaColor;
    private _borderColor!: HsvaColor;

    private _borderWidth: number = 0;

    constructor({
        name = "",
        x = 0, y = 0, width = 100, height = 100,
        borderColor = { h: 0, s: 0, v: 0, a: 1 },
        fillColor = { h: 0, s: 0, v: 0, a: 1 },
    }: ElementProps) {
        super(name)

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.fillColor = fillColor;
        this.borderColor = borderColor;

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


    public get fillColor() {
        return this._fillColor
    }

    public set fillColor(value: HsvaColor) {

        const roundOpacityValue = {
            h: value.h,
            s: value.s,
            v: value.v,
            a: Math.round((value.a + Number.EPSILON) * 100) / 100
        }

        this._fillColor = rgbaToHsva(hsvaToRgba(roundOpacityValue))
    }

    get borderColor() {
        return this._borderColor;
    }

    set borderColor(value: HsvaColor) {
        const roundOpacityValue = {
            h: value.h,
            s: value.s,
            v: value.v,
            a: Math.round((value.a + Number.EPSILON) * 100) / 100
        }

        this._borderColor = rgbaToHsva(hsvaToRgba(roundOpacityValue))
    }

    get borderWidth() {
        return this._borderWidth;
    }

    set borderWidth(value: number) {
        this._borderWidth = Math.round((value) * 100) / 100
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

    setHover(value: boolean) {
        this._hover = value;
    }



    init(resetId: boolean) {
        if (this._contextEditor) {
            return;
        }

        super.init(resetId)

        const editor = Editor.getEditor()

        this._contextEditor = editor;

        this._elementSelectionRenderer.init(editor.canvasApp.getSelectionLayer())
        this._elementTreeRenderer.init(editor.canvasApp.getTreeLayer())

        const graphics = this._elementTreeRenderer.getContainer()
        const eventsManager = editor.eventsManager;

        graphics.on('pointerdown', (event) => {
            if (event.button === 2) return
            eventsManager.onElementPressDown.emit({
                element: this,
                pointerPosition: event.global,
                button: event.button
            })

        });
        graphics.on('pointerup', (event) => {
            if (event.button === 2) return
            eventsManager.onElementPressUp.emit({ element: this, button: event.button })
        })
        graphics.on('pointerupoutside', (event) => {
            if (event.button === 2) return
            eventsManager.onElementPressUp.emit({ element: this, button: event.button })
        })

        graphics.on('rightdown', (event) => {
            eventsManager.onElementRightDown.emit({
                element: this,
                pointerPosition: event.global,
                originalEvent: event
            })
        })

        graphics.on('pointerenter', (event) => {
            if ((event.nativeEvent.target as HTMLElement).tagName === "CANVAS") {
                eventsManager.onElementHoverOn.emit({ component: this })
            }
        });

        graphics.on('pointerleave', (event) => {
            if ((event.nativeEvent.target as HTMLElement).tagName === "CANVAS") {
                eventsManager.onElementHoverOff.emit({ component: this })
            }
        });

        graphics.eventMode = "static"
    }

    destroy() {
        if (this._contextEditor) {
            super.destroy()

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

    serialize(): SerialisedTreeRect {
        return new SerialisedTreeRect({
            name: this.getName(),
            id: this.getId(),
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            fillColor: this.fillColor,
            borderColor: this.borderColor,
            borderWidth: this.borderWidth
        })
    }

    public static deserialize(serialisedTreeRect: SerialisedTreeRect) {

        const newRect = new TreeRect({
            name: serialisedTreeRect.props.name
        })

        newRect._id = serialisedTreeRect.props.id;
        newRect._x = serialisedTreeRect.props.x;
        newRect._y = serialisedTreeRect.props.y;
        newRect._width = serialisedTreeRect.props.width;
        newRect._height = serialisedTreeRect.props.height;
        newRect._fillColor = serialisedTreeRect.props.fillColor;
        newRect._borderColor = serialisedTreeRect.props.borderColor;

        newRect._borderWidth = serialisedTreeRect.props.borderWidth || 0

        return newRect;

    }

}


