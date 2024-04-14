import { Container, FillStyleInputs, Graphics, GraphicsContext, Point, Sprite } from "pixi.js";
import { Editor } from "./editor";
import { Selector } from "./selector";
import { Selection } from "./selections/selection";
import { ElementTreeRenderer } from "./canvas/renderer/elementTree";
import { ElementSelectorRenderer } from "./canvas/renderer/elementSelector";

export abstract class Element {
    // private graphics: Graphics;

    private _contextEditor?: Editor;

    private _selected: boolean = false;
    private _pressUpUnselectable: boolean = false;
    private _movePositionOrigin?: Point;

    private _elementTreeRenderer: ElementTreeRenderer;
    private _elementSelectoionRenderer: ElementSelectorRenderer;

    private _hover: boolean = false;

    private _x: number;
    private _y: number;
    private _width: number;
    private _height: number;

    public name: string = "";

    fill: FillStyleInputs;

    constructor(x: number, y: number, width: number, height: number, fill = "red") {
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
        this.fill = fill;

        this._elementSelectoionRenderer = new ElementSelectorRenderer(this)
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
        // console.log("Hover on")
        if (!this._hover) {
            this._hover = true;
        }

    }

    private requestHoverOff() {
        // console.log("Hover off")

        if (this._hover) {
            this._hover = false;
        }
    }

    render(zIndex: number) {

        this._elementSelectoionRenderer.render(zIndex)
        this._elementTreeRenderer.render(zIndex)

        // const commonContext = new GraphicsContext()
        //     .rect(0, 0, this.width, this.height)
        //     .fill(this.fill)

        // if (this._selected) {
        //     const strokeStyle = {
        //         width: 2,
        //         color: "blue"
        //     }
        //     commonContext.stroke(strokeStyle)

        //     if (this._contextEditor?.selector.getSelection().getElements().length == 1) {
        //         commonContext.rect(-4, -4, 8, 8).fill("white").stroke(strokeStyle)
        //         commonContext.rect(-4, this.height - 4, 8, 8).fill("white").stroke(strokeStyle)
        //         commonContext.rect(this.width - 4, -4, 8, 8).fill("white").stroke(strokeStyle)
        //         commonContext.rect(this.width - 4, this.height - 4, 8, 8).fill("white").stroke(strokeStyle)
        //     }
        // }


        // if (this._hover && !this._selected) {
        //     commonContext
        //         .stroke({
        //             width: 1,
        //             color: "blue"
        //         })
        // }

        // this.graphics.zIndex = zIndex;
        // this.graphics.context = commonContext
        // this.graphics.x = this.x
        // this.graphics.y = this.y
    }

    getContainer() {
        return this._elementTreeRenderer.getContainer();
    }

    pressUpUnselectable() {
        this._pressUpUnselectable = true
    }

    // isPressUpUnselectable() {
    //     return this._pressUpUnselectable;
    // }

    onSelectionInit() {
        console.log("SELECT ON " + this.name + "prev=" + this._selected)
        this._selected = true;
    }

    onSelectionDestroy() {
        console.log("SELECT OFF " + this.name + "prev=" + this._selected)
        this._selected = false;
        this._pressUpUnselectable = false;
    }

    isSelected() {
        return this._selected;
    }

    isHover() {
        return this._hover;
    }


    init(editor: Editor) {
        this._contextEditor = editor;

        this._elementSelectoionRenderer.init(editor.canvasApp.getSelectionLayer())
        this._elementTreeRenderer.init(editor.canvasApp.getTreeLayer())
    }

    destroy() {
        if (this._contextEditor) {
            this._elementSelectoionRenderer.destroy(this._contextEditor.canvasApp.getSelectionLayer())
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

interface Childable {
    addChild(childElement: Element): void
}

export class Rect extends Element implements Childable {
    private children: Element[] = []

    addChild(childElement: Element): void {
        this.children.push(childElement)
    }
}

