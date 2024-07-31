import { Editor } from "../editor";
import { RectRenderer } from "../canvas/renderer/rect";
import { TreeRectData } from "../../ui/subjects";
import { SerialisedTreeRect } from "./serialized/serialisedTreeRect";
import { HsvaColor } from "@uiw/react-color";
import { hsvaToRgba, rgbaToHsva } from '@uiw/color-convert'
import { TreeBox } from "./treeBox";

export interface TreeRectProps {
    name: string,
    id?: string,
    x?: number,
    y?: number,
    width?: number,
    height?: number,
    fillColor?: HsvaColor,
    borderColor?: HsvaColor,
    borderWidth?: number
}

console.log("TreeBox of RECT", TreeBox)

export class TreeRect extends TreeBox {

    private _elementTreeRenderer: RectRenderer;

    private _fillColor!: HsvaColor;
    private _borderColor!: HsvaColor;

    private _borderWidth: number = 0;

    constructor({
        name,
        x = 0,
        y = 0,
        width = 100,
        height = 100,
        borderColor = { h: 0, s: 0, v: 0, a: 1 },
        fillColor = { h: 0, s: 0, v: 0, a: 1 },
        borderWidth = 0
    }: TreeRectProps) {
        super({
            name,
            x,
            y,
            height,
            width
        })

        this._fillColor = fillColor;
        this._borderColor = borderColor;
        this._borderWidth = borderWidth;

        this._elementTreeRenderer = new RectRenderer(this)
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
        super.render(zIndex)
        this._elementTreeRenderer.render(zIndex)

        return zIndex + 1
    }

    getContainer() {
        return this._elementTreeRenderer.getContainer();
    }

    init(resetId: boolean) {
        if (this.isInit()) {
            return;
        }

        super.init(resetId)

        const editor = Editor.getEditor()


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
        if (this.isInit()) {
            super.destroy()

            const editor = Editor.getEditor()

            this._elementTreeRenderer.destroy(editor.canvasApp.getTreeLayer())
        }
    }

    setPosition(x: number, y: number) {
        this.x = x;
        this.y = y;
    }



    toData(index: number): TreeRectData {
        return {
            type: "rect",
            index: index,
            name: this.getName(),
            selected: this.isSelected()
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
            name: serialisedTreeRect.props.name,
            id: serialisedTreeRect.props.id,
            x: serialisedTreeRect.props.x,
            y: serialisedTreeRect.props.y,
            width: serialisedTreeRect.props.width,
            height: serialisedTreeRect.props.height,
            fillColor: serialisedTreeRect.props.fillColor,
            borderColor: serialisedTreeRect.props.borderColor,
            borderWidth: serialisedTreeRect.props.borderWidth || 0
        })

        return newRect;
    }

}


