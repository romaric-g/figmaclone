import classNames from "classnames";
import React from "react";
import Button from "../components/Button";
import "./toolbar.scss";
import { ToolType } from "../../core/tools/toolManager";
import { Editor } from "../../core/editor";

interface Props {
    selectedTool?: ToolType
}

const ToolbarView: React.FC<Props> = ({ selectedTool }) => {

    const selectTool = React.useCallback((tool: ToolType) => {
        Editor.getEditor().toolManager.setCurrentTool(tool)
    }, [])

    return (
        <div className="Toolbar">
            <Button selected={selectedTool == "select"} onClick={() => selectTool("select")}>Selection</Button>
            <Button selected={selectedTool == "rect"} onClick={() => selectTool("rect")}>Dessin</Button>
            <Button selected={selectedTool == "text"} onClick={() => selectTool("text")}>Texte</Button>
        </div>
    )
}

export default ToolbarView;