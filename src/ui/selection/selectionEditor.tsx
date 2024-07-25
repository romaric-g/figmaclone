import React, { useCallback } from "react";
import { selectionChangeSubject } from "../subjects";
import { Editor } from "../../core/editor";
import "./selectionEditor.scss"
import SelectionInput from "./selectionInput";
import { HsvaColor, RgbaColor, RgbColor } from "@uiw/react-color";
import ColorPicker from "./colorPicker";
import Icon from "../components/Icon";
import { UpdateSelectionPropertiesAction } from "../../core/actions/updateSelectionPropertiesAction";
import { SetSelectionPropertiesAction } from "../../core/actions/setSelectionPropertiesAction";




const getSelection = () => {
    return Editor.getEditor().selectionManager.getSelection()
}

const getActionManager = () => {
    return Editor.getEditor().actionManager
}


const changeNumericalValue = (type: "x" | "y" | "height" | "width", value: number) => {
    const selection = getSelection()
    const actionManager = getActionManager()

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

    actionManager.push(
        new SetSelectionPropertiesAction(selection)
    )
}

interface Props {
    initialHeight: number | "mixed",
    initialWidth: number | "mixed",
    initialX: number | "mixed",
    initialY: number | "mixed"
}


const SelectionEditor: React.FC<Props> = (props) => {
    const selection = getSelection()
    const {
        initialHeight,
        initialWidth,
        initialX,
        initialY
    } = props

    const [color, setColor] = React.useState<HsvaColor | "mixed">()
    const [borderColor, setBorderColor] = React.useState<HsvaColor | "mixed">()
    const [borderWidth, setBorderWidth] = React.useState<number | "mixed">()
    const [height, setHeight] = React.useState<number | "mixed">(initialHeight)
    const [widht, setWidth] = React.useState<number | "mixed">(initialWidth)
    const [x, setX] = React.useState<number | "mixed">(initialX)
    const [y, setY] = React.useState<number | "mixed">(initialY)

    React.useEffect(() => {
        const eventSub = selectionChangeSubject.subscribe(event => {
            if (event) {
                setX(event.x)
                setY(event.y)
                setWidth(event.width)
                setHeight(event.height)
                setColor(event.color)
                setBorderColor(event.borderColor)
                setBorderWidth(event.borderWidth)
            }
        });

        return () => {
            eventSub.unsubscribe();
        };
    }, []);

    const handleFillColorChange = React.useCallback((newColor: HsvaColor) => {
        const selection = getSelection()
        const actionManager = getActionManager()

        setColor(newColor)

        selection.setFillColor(newColor)

        actionManager.push(
            new SetSelectionPropertiesAction(selection)
        )
    }, [])

    const handlBorderColorChange = React.useCallback((newColor: HsvaColor) => {
        const selection = getSelection()
        const actionManager = getActionManager()

        setBorderColor(newColor)

        selection.setBorderColor(newColor)

        actionManager.push(
            new SetSelectionPropertiesAction(selection)
        )
    }, [])

    const handlBorderWidthChange = React.useCallback((newWidth: number) => {
        const selection = getSelection()
        const actionManager = getActionManager()
        setBorderWidth(newWidth)

        selection.setBorderWidth(newWidth)

        actionManager.push(
            new SetSelectionPropertiesAction(selection)
        )
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

export default SelectionEditor;