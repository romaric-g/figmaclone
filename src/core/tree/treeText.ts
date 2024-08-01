import { TreeTextData } from "../../ui/subjects";
import { SerialisedTreeText } from "./serialized/serialisedTreeText";
import { HsvaColor } from "@uiw/react-color";
import { hsvaToRgba, rgbaToHsva } from '@uiw/color-convert'
import { TreeBox } from "./treeBox";

export interface TreeTextProps {
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

export class TreeText extends TreeBox {

    private _fillColor!: HsvaColor;

    constructor({
        name,
        x = 0,
        y = 0,
        width = 100,
        height = 100,
        fillColor = { h: 0, s: 0, v: 0, a: 1 },
    }: TreeTextProps) {
        super({
            name: name,
            x: x,
            y: y,
            height: height,
            width: width
        })

        this._fillColor = fillColor;
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

    serialize(): SerialisedTreeText {
        return {
            type: "text",
            props: {
                id: this.getId(),
                name: this.getName(),
                x: this.x,
                y: this.y,
                width: this.width,
                height: this.height,
                fillColor: this._fillColor
            }
        }
    }

    toData(index: number): TreeTextData {
        return {
            type: "text",
            index: index,
            name: this.getName(),
            selected: this.isSelected()
        }
    }


}