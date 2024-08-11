import React from "react";
import { selectionChangeSubject } from "../subjects";
import { Editor } from "../../core/editor";
import "./selectionEditor.scss"
import SelectionInput from "./selectionInput";
import { HsvaColor } from "@uiw/react-color";
import ColorPicker from "./colorPicker";
import Icon from "../components/Icon";
import { SetSelectionPropertiesAction } from "../../core/actions/setSelectionPropertiesAction";
import FillColorSection from "./sections/fillColorSection";
import FillBorderColorSection from "./sections/fillBorderColorSection";
import BoxDimensionSection from "./sections/boxDimensionSection";
import TextProperitesSection from "./sections/textProperitesSection";




const getSelectionModifier = () => {
    return Editor.getEditor().selectionManager.getSelectionModifier()
}

const getActionManager = () => {
    return Editor.getEditor().actionManager
}



interface Props {
    initialHeight: number | "mixed" | undefined,
    initialWidth: number | "mixed" | undefined,
    initialX: number | "mixed" | undefined,
    initialY: number | "mixed" | undefined,
    initialColor: HsvaColor | "mixed" | undefined,
    initialBorderColor: HsvaColor | "mixed" | undefined,
    initialBorderWidth: number | "mixed" | undefined,
    initFontSize: number | "mixed" | undefined
}


const SelectionEditor: React.FC<Props> = (props) => {
    const selection = getSelectionModifier()
    const {
        initialHeight,
        initialWidth,
        initialX,
        initialY,
        initialColor,
        initialBorderColor,
        initialBorderWidth,
        initFontSize
    } = props

    const [color, setColor] = React.useState<HsvaColor | "mixed" | undefined>(initialColor)
    const [borderColor, setBorderColor] = React.useState<HsvaColor | "mixed" | undefined>(initialBorderColor)
    const [borderWidth, setBorderWidth] = React.useState<number | "mixed" | undefined>(initialBorderWidth)
    const [height, setHeight] = React.useState<number | "mixed" | undefined>(initialHeight)
    const [widht, setWidth] = React.useState<number | "mixed" | undefined>(initialWidth)
    const [x, setX] = React.useState<number | "mixed" | undefined>(initialX)
    const [y, setY] = React.useState<number | "mixed" | undefined>(initialY)
    const [fontSize, setFontSize] = React.useState<number | "mixed" | undefined>(initFontSize)

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
                setFontSize(event.fontSize)
            }
        });

        return () => {
            eventSub.unsubscribe();
        };
    }, []);

    const handleFillColorChange = React.useCallback((newColor: HsvaColor) => {
        const selection = getSelectionModifier()
        const actionManager = getActionManager()

        setColor(newColor)

        selection.setFillColor(newColor)

        actionManager.push(
            new SetSelectionPropertiesAction(selection)
        )
    }, [])

    const handlBorderColorChange = React.useCallback((newColor: HsvaColor) => {
        const selection = getSelectionModifier()
        const actionManager = getActionManager()

        setBorderColor(newColor)

        selection.setBorderColor(newColor)

        actionManager.push(
            new SetSelectionPropertiesAction(selection)
        )
    }, [])

    const handlBorderWidthChange = React.useCallback((newWidth: number) => {
        const selection = getSelectionModifier()
        const actionManager = getActionManager()
        setBorderWidth(newWidth)

        selection.setBorderWidth(newWidth)

        actionManager.push(
            new SetSelectionPropertiesAction(selection)
        )
    }, [])

    const handlFontSizeChange = React.useCallback((newFontSize: number) => {
        const selection = getSelectionModifier()
        const actionManager = getActionManager()
        setFontSize(newFontSize)

        selection.setFontSize(newFontSize)

        actionManager.push(
            new SetSelectionPropertiesAction(selection)
        )
    }, [])

    if (selection.getDepthComponents().length == 0) {
        return <div className="SelectionEditor">
        </div>
    }

    return (
        <div className="SelectionEditor">

            {(x !== undefined && y !== undefined && widht !== undefined && height !== undefined) && (
                <>
                    <BoxDimensionSection
                        x={x}
                        y={y}
                        width={widht}
                        height={height}
                    />
                    <hr className="SelectionEditor__separator" />

                </>
            )}


            {(color !== undefined) && (
                <>
                    <FillColorSection
                        color={color}
                        setColor={handleFillColorChange}
                    />
                    <hr className="SelectionEditor__separator" />
                </>
            )}

            {(borderColor !== undefined && borderWidth != undefined) && (
                <>
                    <FillBorderColorSection
                        borderColor={borderColor}
                        borderWidth={borderWidth}
                        setBorderColor={handlBorderColorChange}
                        setBorderWidth={handlBorderWidthChange}
                    />
                    <hr className="SelectionEditor__separator" />
                </>
            )}

            {(fontSize !== undefined) && (
                <>
                    <TextProperitesSection
                        fontSize={fontSize}
                        setFontSize={handlFontSizeChange}
                    />
                    <hr className="SelectionEditor__separator" />
                </>
            )}

        </div>
    )
}

export default SelectionEditor;