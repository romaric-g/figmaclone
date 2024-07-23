import React from "react"
import "./selectionEditorBox.scss"
import { Editor } from "../../core/editor"
import SelectionEditor from "./selectionEditor"


const SelectionEditorBox: React.FC = () => {
    const selection = Editor.getEditor().selectionManager.getSelection()

    if (selection.isEmpty()) {
        return (
            <div className="SelectionEditorBox">
            </div>
        )
    } else {
        return (
            <div className="SelectionEditorBox">
                <SelectionEditor
                    initialHeight={selection.getHeight()}
                    initialWidth={selection.getWidth()}
                    initialX={selection.getX()}
                    initialY={selection.getY()}
                />
            </div>
        )

    }
}

export default SelectionEditorBox