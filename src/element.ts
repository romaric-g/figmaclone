import { Container, Graphics, GraphicsContext, Sprite } from "pixi.js";
import { Editor } from "./editor";


export abstract class Element {
    private graphics: Graphics;

    private _contextEditor?: Editor;
    private _selected: boolean = false;
    private _hover: boolean = false;

    private _pressed: boolean = false;
    private _pressedStartX?: number;
    private _pressedStartY?: number;
    private _pressedOriginalX?: number;
    private _pressedOriginalY?: number;

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
        this.graphics.on('pointerdown', (event) => {
            const global = event.global;

            this.requestPressed(global.x, global.y)
        });
        this.graphics.on('pointerdown', (event) => this.requestSelect());
        this.graphics.on('pointerenter', (event) => this.requestHoverOn());
        this.graphics.on('pointerleave', (event) => this.requestHoverOff());

        this.graphics.on('pointerup', (event) => this.unpress())
        this.graphics.on('pointerupoutside', (event) => this.unpress())


        this.graphics.on('globalpointermove', (event) => {

            if (this._pressed) {
                if (this._pressedStartX != undefined && this._pressedStartY != undefined && this._pressedOriginalX != undefined && this._pressedOriginalY != undefined) {
                    this._x = this._pressedOriginalX + event.global.x - this._pressedStartX
                    this._y = this._pressedOriginalY + event.global.y - this._pressedStartY
                }
            }


        })

        this.graphics.eventMode = "static"
    }

    private requestPressed(x: number, y: number) {
        console.log("Request pressed", x, y)

        if (!this._pressed) {
            this._pressed = true;
            this._pressedStartX = x;
            this._pressedStartY = y;
            this._pressedOriginalX = this._x;
            this._pressedOriginalY = this._y;
        }

    }

    private requestSelect() {
        console.log("Request select")

        if (this._contextEditor && !this._selected) {
            this._contextEditor.requestSelect(this)
        }
    }

    private unpress() {
        console.log("Request unpress")

        if (this._pressed) {
            this._pressed = false;
            this._pressedStartX = undefined;
            this._pressedStartY = undefined;
            this._pressedOriginalX = undefined;
            this._pressedOriginalY = undefined;
        }
    }

    private requestHoverOn() {
        console.log("Hover on")

        if (!this._hover) {
            this._hover = true;
        }

    }

    private requestHoverOff() {
        console.log("Hover off")

        if (this._hover) {
            this._hover = false;
        }
    }

    update() {
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

    deselect() {
        this._selected = false;
    }

    setEditorContext(editor: Editor) {
        this._contextEditor = editor;
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

