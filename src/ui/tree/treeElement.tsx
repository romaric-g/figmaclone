import React from "react";
import "./treeElement.scss";
import { Editor } from "../../core/editor";
import { Selection } from "../../core/selections/selection";
import classNames from "classnames";
import { SelectTool } from "../../core/tools/selectTool";
import { SelectionState } from "../../core/tools/selectStates/selection";
import { TreeRect } from "../../core/tree/treeRect";

interface Props {
    index: number,
    name: string,
    isSelected: boolean,
    activeMove: () => void,
    updateMoveBar: (direction: "top" | "bottom", offsetTop: number, offsetHeight: number) => void
}

const TreeElementView: React.FC<Props> = ({ index, name, isSelected, activeMove, updateMoveBar }) => {

    const onMouseDown = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {

        const editor = Editor.getEditor()

        if (editor.keyboardController.keys.control.pressed) {
            const container = editor.treeManager.getTree().getContainer([index])

            if (container instanceof TreeRect) {
                editor.selector.getSelection().getBuilder(editor).add().apply(editor.selector)
            }
        } else {
            const container = editor.treeManager.getTree().getContainer([index])

            if (container instanceof TreeRect) {
                editor.selector.setSelection(new Selection([container]))
            }
        }

        const currentTool = editor.toolManager.getCurrentTool()
        if (currentTool instanceof SelectTool) {
            currentTool.setState(new SelectionState(currentTool))
        }

        activeMove()
    }

    const onMouseMove = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        const top = event.currentTarget.getBoundingClientRect().top

        let direction: "top" | "bottom" = "top"

        if ((event.clientY - top) > event.currentTarget.offsetHeight / 2) {
            direction = "bottom"
        }

        updateMoveBar(direction, event.currentTarget.offsetTop, event.currentTarget.offsetHeight)
    }

    return (
        <li
            className={classNames("TreeElement", { "TreeElement--selected": isSelected })}
            key={index}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
        >
            {name}
        </li>
    )
}

export default TreeElementView;