import React, { useCallback } from "react";
import { selectionChangeSubject } from "../subjects";
import { ColorSource, FillStyleInputs } from "pixi.js";
import { every } from "rxjs";
import { Editor } from "../../core/editor";
import { AlphaPicker, BlockPicker, ChromePicker, CirclePicker, ColorResult, CompactPicker, GithubPicker, HuePicker, PhotoshopPicker, RGBColor, SketchPicker, SliderPicker, SwatchesPicker, TwitterPicker } from 'react-color'
import "./selectionEditor.scss"
import SelectionInput from "./selectionInput";

interface Props {

}


const changeNumericalValue = (type: "x" | "y" | "height" | "width", value: number) => {
    const selection = Editor.getEditor().selector.getSelection()

    switch (type) {
        case "x":
            selection.setX(value)
            break;
        case "y":
            selection.setY(value)
            break;
        case "width":
            selection.setWidth(value)
            break;
        case "height":
            selection.setHeight(value)
            break;
        default:
            break;
    }

}

function isRGBColor(obj: any): obj is RGBColor {
    return obj && typeof obj.r === 'number' && typeof obj.g === 'number' && typeof obj.b === 'number';
}

function getSelection() {
    return Editor.getEditor().selector.getSelection()
}

const ElementEditor: React.FC<Props> = () => {
    const selection = getSelection()

    const [color, setColor] = React.useState<RGBColor | "mixed">()
    const [height, setHeight] = React.useState<number | "mixed">(selection.getHeight())
    const [widht, setWidth] = React.useState<number | "mixed">(selection.getWidth())
    const [x, setX] = React.useState<number | "mixed">(selection.getX())
    const [y, setY] = React.useState<number | "mixed">(selection.getY())

    React.useEffect(() => {
        const eventSub = selectionChangeSubject.subscribe(event => {
            setX(event.x)
            setY(event.y)
            setWidth(event.width)
            setHeight(event.height)

            if (event.color === "mixed") {
                setColor("mixed")
            } else {
                if (isRGBColor(event.color)) {
                    setColor(event.color)
                } else {
                    setColor({
                        r: 0,
                        b: 0,
                        g: 0
                    })
                }
            }


        });

        return () => {
            eventSub.unsubscribe();
        };
    }, []);

    const handleColorChange = React.useCallback((newColor: ColorResult) => {
        const selection = getSelection()

        setColor(newColor.rgb)

        selection.setFillColor(newColor.rgb)

    }, [])

    if (selection.getComponents().length == 0) {
        return <div className="SelectionEditor">

        </div>
    }

    return (
        <div className="SelectionEditor">
            <div className="SelectionEditor__properites">
                <div className="SelectionEditor__properites__position">
                    <SelectionInput value={x} label="X" setValue={(value) => changeNumericalValue("x", value)} />
                    <SelectionInput value={y} label="Y" setValue={(value) => changeNumericalValue("y", value)} />
                </div>
                <div className="SelectionEditor__properites__position">
                    <SelectionInput value={widht} label="W" setValue={(value) => changeNumericalValue("width", value)} />
                    <SelectionInput value={height} label="H" setValue={(value) => changeNumericalValue("height", value)} />
                </div>
            </div>
            <hr className="SelectionEditor__separator" />

            <div className="SelectionEditor__color">
                <span>Remplissage</span>
                {
                    color === "mixed" ? (
                        <p>Mixed</p>
                    ) : (
                        <SketchPicker
                            color={color}
                            onChange={handleColorChange}
                        />
                    )
                }
            </div>


        </div>
    )
}

export default ElementEditor;