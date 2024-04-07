import { Container, Graphics, GraphicsContext, Point, Sprite } from "pixi.js";
import { Editor } from "./editor";

export abstract class Element {
    private graphics: Graphics;

    private _contextEditor?: Editor;


    private _selected: boolean = false;
    private _pressUpUnselectable: boolean = false;

    private _hover: boolean = false;

    private _x: number;
    private _y: number;
    private _width: number;
    private _height: number;

    constructor(x: number, y: number, width: number, height: number) {
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;

        this.graphics = new Graphics()

        this.graphics.on('pointerdown', (event) => this.pointerDownHandler(event.global));
        this.graphics.on('pointerup', (event) => this.pointerUpHandler())
        this.graphics.on('pointerupoutside', (event) => this.pointerUpHandler())


        this.graphics.on('pointerenter', (event) => this.requestHoverOn());
        this.graphics.on('pointerleave', (event) => this.requestHoverOff());



        // this.graphics.on('globalpointermove', (event) => {

        //     if (this._pressed) {
        //         if (this._pressedStartX != undefined && this._pressedStartY != undefined && this._pressedOriginalX != undefined && this._pressedOriginalY != undefined) {
        //             this._x = this._pressedOriginalX + event.global.x - this._pressedStartX
        //             this._y = this._pressedOriginalY + event.global.y - this._pressedStartY
        //         }
        //     }
        // })

        this.graphics.eventMode = "static"
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }


    private pointerDownHandler(pointerPosition: Point) {
        if (this._contextEditor) {
            this._contextEditor.onElementPointerDown(this, pointerPosition)
        }
    }

    private pointerUpHandler() {

        // to editor
        if (this._contextEditor) {
            this._contextEditor.onElementPointerUp(this)
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

    render() {
        const commonContext = new GraphicsContext()
            .rect(0, 0, this._width, this._height)
            .fill("red")

        if (this._selected) {
            commonContext
                .stroke({
                    width: 2,
                    color: "blue"
                })
        }


        if (this._hover) {
            commonContext
                .stroke({
                    width: 1,
                    color: "blue"
                })
        }

        this.graphics.context = commonContext
        this.graphics.x = this._x
        this.graphics.y = this._y
    }

    getContainer() {
        return this.graphics;
    }

    select() {
        this._selected = true;
    }

    pressUpUnselectable() {
        this._pressUpUnselectable = true
    }

    isPressUpUnselectable() {
        return this._pressUpUnselectable;
    }

    unselect() {
        this._selected = false;
        this._pressUpUnselectable = false;
    }

    isSelected() {
        return this._selected;
    }

    setEditorContext(editor: Editor) {
        this._contextEditor = editor;
    }

    setPosition(x: number, y: number) {
        this._x = x;
        this._y = y;
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

