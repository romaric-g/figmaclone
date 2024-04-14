import React, { useCallback } from "react";
import { selectionChangeSubject } from "../subjects";
import { ColorSource, FillStyleInputs } from "pixi.js";
import { every } from "rxjs";
import { Editor } from "../../core/editor";
import { AlphaPicker, BlockPicker, ChromePicker, CirclePicker, ColorResult, CompactPicker, GithubPicker, HuePicker, PhotoshopPicker, RGBColor, SketchPicker, SliderPicker, SwatchesPicker, TwitterPicker } from 'react-color'
import "./selectionEditor.scss"

interface Props {

}


const changeNumericalValue = (type: "x" | "y" | "height" | "width", value: string) => {
    const selection = Editor.getEditor().selector.getSelection()

    if (Number.isNaN(Number(value))) {
        return
    }
    const newValue = Number(value)
    switch (type) {
        case "x":
            selection.setX(newValue)
            break;
        case "y":
            selection.setY(newValue)
            break;
        case "width":
            selection.setWidth(newValue)
            break;
        case "height":
            selection.setHeight(newValue)
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

    if (selection.getElements().length == 0) {
        return <div>
            <p>pas de selection</p>
        </div>
    }

    return (
        <div className="SelectionEditor">
            <div className="SelectionEditor__properites">
                <div className="SelectionEditor__properites__position">
                    <input className="SelectionEditor__properites__position__input" type="number" value={x} onChange={(event) => changeNumericalValue("x", event.target.value)} />
                    <input className="SelectionEditor__properites__position__input" type="number" value={y} onChange={(event) => changeNumericalValue("y", event.target.value)} />
                </div>
                <div className="SelectionEditor__properites__dimensions">
                    <input className="SelectionEditor__properites__dimensions__input" type="number" value={widht} onChange={(event) => changeNumericalValue("width", event.target.value)} />
                    <input className="SelectionEditor__properites__dimensions__input" type="number" value={height} onChange={(event) => changeNumericalValue("height", event.target.value)} />
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