import React, { useCallback } from "react";
import { selectionChangeSubject } from "../subjects";
import { ColorSource, FillStyleInputs } from "pixi.js";
import { every } from "rxjs";
import { Editor } from "../../core/editor";
import "./selectionEditor.scss"
import SelectionInput from "./selectionInput";
import { HsvaColor, RgbaColor, RgbColor } from "@uiw/react-color";
import ColorPicker from "./colorPicker";
import Icon from "../components/Icon";

interface Props {

}


const changeNumericalValue = (type: "x" | "y" | "height" | "width", value: number) => {
    const selection = Editor.getEditor().selectionManager.getSelection()

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

// function isRGBColor(obj: any): obj is RGBColor {
//     return obj && typeof obj.r === 'number' && typeof obj.g === 'number' && typeof obj.b === 'number';
// }

function getSelection() {
    return Editor.getEditor().selectionManager.getSelection()
}

const ElementEditor: React.FC<Props> = () => {
    const selection = getSelection()

    const [color, setColor] = React.useState<HsvaColor | "mixed">()
    const [borderColor, setBorderColor] = React.useState<HsvaColor | "mixed">()
    const [borderWidth, setBorderWidth] = React.useState<number | "mixed">()
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
            setColor(event.color)
            setBorderColor(event.borderColor)
            setBorderWidth(event.borderWidth)
        });

        return () => {
            eventSub.unsubscribe();
        };
    }, []);

    const handleFillColorChange = React.useCallback((newColor: HsvaColor) => {
        const selection = getSelection()
        setColor(newColor)
        selection.setFillColor(newColor)

    }, [])

    const handlBorderColorChange = React.useCallback((newColor: HsvaColor) => {
        const selection = getSelection()
        setBorderColor(newColor)
        selection.setBorderColor(newColor)

    }, [])

    const handlBorderWidthChange = React.useCallback((newWidth: number) => {
        const selection = getSelection()
        setBorderWidth(newWidth)
        selection.setBorderWidth(newWidth)

    }, [])

    if (selection.getFlatComponents().length == 0) {
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
                <span className="SelectionEditor__color__title">Remplissage</span>
                {
                    color === "mixed" ? (
                        <div className="SelectionEditor__color__mixed">
                            <p className="SelectionEditor__color__mixed__title">Couleur mixte</p>
                        </div>
                    ) : (

                        color ? (
                            <ColorPicker
                                color={color}
                                onChange={handleFillColorChange}
                            />
                        ) : undefined
                    )
                }
            </div>

            <hr className="SelectionEditor__separator" />

            <div className="SelectionEditor__color">
                <span className="SelectionEditor__color__title">Bordure</span>
                {
                    borderColor === "mixed" ? (
                        <div className="SelectionEditor__color__mixed">
                            <p className="SelectionEditor__color__mixed__title">Couleur mixte</p>
                        </div>
                    ) : (

                        borderColor !== undefined && borderWidth !== undefined ? (
                            <div>
                                <ColorPicker
                                    color={borderColor}
                                    onChange={handlBorderColorChange}
                                />
                                <SelectionInput
                                    value={borderWidth}
                                    icon={(
                                        <Icon type="stroke" />
                                    )}
                                    setValue={handlBorderWidthChange}
                                />
                            </div>
                        ) : undefined
                    )
                }
            </div>


        </div>
    )
}

export default ElementEditor;