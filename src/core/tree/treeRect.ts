import { Container, FillStyleInputs, Graphics, GraphicsContext, Point, Sprite } from "pixi.js";
import { Editor } from "../editor";
import { Selector } from "../selector";
import { Selection } from "../selections/selection";
import { ElementTreeRenderer } from "../canvas/renderer/elementTree";
import { ElementSelectorRenderer } from "../canvas/renderer/elementSelector";
import { TreeComponent } from "./treeComponent";

interface ElementProps {
    x: number,
    y: number,
    width?: number,
    height?: number,
    fill?: FillStyleInputs
    name?: string
}

export class TreeRect extends TreeComponent {
    // private graphics: Graphics;

    private _contextEditor?: Editor;

    private _selected: boolean = false;
    private _movePositionOrigin?: Point;

    private _elementTreeRenderer: ElementTreeRenderer;
    private _elementSelectionRenderer: ElementSelectorRenderer;

    private _hover: boolean = false;

    private _x: number;
    private _y: number;
    private _width: number;
    private _height: number;

    public name: string;

    fill: FillStyleInputs;

    constructor({ x, y, width = 100, height = 100, fill = "red", name = "" }: ElementProps) {
        super()

        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
        this.fill = fill;
        this.name = name;

        this._elementSelectionRenderer = new ElementSelectorRenderer(this)
        this._elementTreeRenderer = new ElementTreeRenderer(this)

        const graphics = this._elementTreeRenderer.getContainer()

        graphics.on('pointerdown', (event) => this.pointerDownHandler(event.global));
        graphics.on('pointerup', (event) => this.pointerUpHandler())
        graphics.on('pointerupoutside', (event) => this.pointerUpHandler())

        graphics.on('pointerenter', (event) => this.requestHoverOn());
        graphics.on('pointerleave', (event) => this.requestHoverOff());

        graphics.eventMode = "static"
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

    private pointerDownHandler(pointerPosition: Point) {
        if (this._contextEditor) {
            this._contextEditor.eventsManager.onElementPressDown.emit({
                element: this,
                pointerPosition: pointerPosition
            })
        }
    }

    private pointerUpHandler() {

        // to editor
        if (this._contextEditor) {
            this._contextEditor.eventsManager.onElementPressUp.emit({
                element: this
            })
        }




    }

    private requestHoverOn() {
        if (!this._hover) {
            this._hover = true;
        }

    }

    private requestHoverOff() {
        if (this._hover) {
            this._hover = false;
        }
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
    }

    isSelected() {
        return this._selected;
    }

    isHover() {
        return this._hover;
    }


    init(editor: Editor) {
        this._contextEditor = editor;

        this._elementSelectionRenderer.init(editor.canvasApp.getSelectionLayer())
        this._elementTreeRenderer.init(editor.canvasApp.getTreeLayer())
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
}


