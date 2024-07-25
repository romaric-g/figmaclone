import React from "react"
import "./selectionEditorBox.scss"
import { Editor } from "../../core/editor"
import SelectionEditor from "./selectionEditor"


const SelectionEditorBox: React.FC = () => {
    const selection = Editor.getEditor().selectionManager.getSelection()
    const data = selection.toData()

    if (!data) {
        return (
            <div className="SelectionEditorBox">
            </div>
        )
    } else {
        return (
            <div className="SelectionEditorBox">
                <SelectionEditor
                    initialHeight={data.height}
                    initialWidth={data.width}
                    initialX={data.x}
                    initialY={data.y}
                />
            </div>
        )

    }
}

export default SelectionEditorBox