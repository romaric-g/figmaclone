import { TreeRectData } from "../../ui/subjects";
import { SerialisedTreeRect } from "./serialized/serialisedTreeRect";
import { HsvaColor } from "@uiw/react-color";
import { hsvaToRgba, rgbaToHsva } from '@uiw/color-convert'
import { TreeBox } from "./treeBox";
import { TreeComponentVisitor } from "./treeComponentVisitor";

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

export class TreeRect extends TreeBox {

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
        return {
            type: "rect",
            props: {
                name: this.getName(),
                id: this.getId(),
                x: this.x,
                y: this.y,
                width: this.width,
                height: this.height,
                fillColor: this.fillColor,
                borderColor: this.borderColor,
                borderWidth: this.borderWidth
            }
        }
    }

    accept(visitor: TreeComponentVisitor): void {
        visitor.doForRect(this)
    }

}


