import React from 'react'
import SelectionInput from '../selectionInput'
import { Editor } from '../../../core/editor'
import { SetSelectionPropertiesAction } from '../../../core/actions/setSelectionPropertiesAction'
import "./boxDimensionSection.scss"

const getSelectionModifier = () => {
    return Editor.getEditor().selectionManager.getSelectionModifier()
}

const getActionManager = () => {
    return Editor.getEditor().actionManager
}

const changeNumericalValue = (type: "x" | "y" | "height" | "width", value: number) => {
    const selectionModifier = getSelectionModifier()
    const actionManager = getActionManager()

    switch (type) {
        case "x":
            selectionModifier.setX(value)
            break;
        case "y":
            selectionModifier.setY(value)
            break;
        case "width":
            selectionModifier.setWidth(value)
            break;
        case "height":
            selectionModifier.setHeight(value)
            break;
        default:
            break;
    }

    actionManager.push(
        new SetSelectionPropertiesAction(selectionModifier)
    )
}

interface Props {
    x: number | "mixed",
    y: number | "mixed",
    width: number | "mixed",
    height: number | "mixed"
}

const BoxDimensionSection: React.FC<Props> = (props) => {

    const {
        x,
        y,
        width,
        height
    } = props;

    return (
        <div className="BoxDimensionSection">
            <div className="BoxDimensionSection__position">
                <SelectionInput value={x} label="X" setValue={(value) => changeNumericalValue("x", value)} />
                <SelectionInput value={y} label="Y" setValue={(value) => changeNumericalValue("y", value)} />
            </div>
            <div className="BoxDimensionSection__position">
                <SelectionInput value={width} label="W" setValue={(value) => changeNumericalValue("width", value)} />
                <SelectionInput value={height} label="H" setValue={(value) => changeNumericalValue("height", value)} />
            </div>
        </div>
    )
}

export default BoxDimensionSection