import React from "react"
import { Editor } from "../../core/editor"
import SelectionEditor from "./selectionEditor"
import "./selectionEditorContainer.scss"

const SelectionEditorContainer: React.FC = () => {
    const selection = Editor.getEditor().selectionManager.getSelectionModifier()
    const data = selection.toData()

    if (!data) {
        return (
            <div className="SelectionEditorContainer SelectionEditorContainer--no-element">
                <p className="SelectionEditorContainer__text">Aucun element selectionné</p>
            </div>
        )
    } else {
        return (
            <div className="SelectionEditorContainer">
                <SelectionEditor
                    initialHeight={data.height}
                    initialWidth={data.width}
                    initialX={data.x}
                    initialY={data.y}
                    initialBorderColor={data.borderColor}
                    initialBorderWidth={data.borderWidth}
                    initialColor={data.color}
                    initFontSize={data.fontSize}
                />
            </div>
        )

    }
}

export default SelectionEditorContainer