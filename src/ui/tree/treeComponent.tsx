
import React from "react";
import classNames from "classnames";
import { Editor } from "../../core/editor";
import { SelectTool } from "../../core/tools/selectTool";
import { SelectionState } from "../../core/tools/selectStates/selection";
import "./treeComponent.scss";
import { DragOrigin, DragTarget } from "./tree";
import { SelectedComponentsModifier } from "../../core/selections/selectedComponentsModifier";
import { SetSelectionAction } from "../../core/actions/setSelectionAction";

interface Props {
    indexs: number[],
    name: string,
    type: "rect" | "container" | "other",
    isSelected: boolean,
    isDragging: boolean,
    setDragOrigin: (dragOrigin: DragOrigin) => void,
    dragTarget: DragTarget | undefined,
    setDragTarget: (dragTarget: DragTarget) => void,
}

const TreeComponentView: React.FC<Props> = ({
    indexs,
    name, type,
    isSelected,
    isDragging,
    setDragOrigin,
    dragTarget,
    setDragTarget
}) => {

    const onMouseDown = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {

        const editor = Editor.getEditor()
        const container = editor.treeManager.getTree().getChildComponent(indexs)

        if (container) {
            if (editor.keyboardManager.keyboardController.keys.control.pressed) {
                editor.actionManager.push(
                    new SetSelectionAction(
                        editor.selectionManager.getSelection().getBuilder(editor).add(container).build()
                    )
                )
            } else {
                const selection = editor.selectionManager.getSelection()

                if (e.button === 0 || (e.button === 2 && !selection.getComponents().includes(container))) {
                    editor.actionManager.push(
                        new SetSelectionAction(
                            new SelectedComponentsModifier([container])
                        )
                    )
                }
            }

            if (e.button === 2) {
                const newSelection = editor.selectionManager.getSelection()
                Editor.getEditor().menuManager.requestSelectionMenu(newSelection, e.clientX, e.clientY)
            }
        }

        const currentTool = editor.toolManager.getCurrentTool()
        if (currentTool instanceof SelectTool) {
            currentTool.setState(new SelectionState(currentTool))
        }

        setDragOrigin({
            indexs: indexs
        })
    }

    const onMouseMove = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        const top = event.currentTarget.getBoundingClientRect().top

        let target: "before" | "after" = "before"

        if ((event.clientY - top) > event.currentTarget.offsetHeight / 2) {
            target = "after"
        }

        if (isDragging) {
            setDragTarget({
                indexs: indexs,
                target: target
            })
        }
    }

    return (
        <li
            className={classNames("TreeComponent", {
                "TreeComponent--selected": isSelected
            })}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
        >
            <div className="TreeComponent__content" style={{
                marginLeft: (indexs.length - 1) * 20
            }}>
                <span className={classNames("TreeComponent__content__bar", {
                    "TreeComponent__content__bar--activate": dragTarget && indexs.join(".") == dragTarget.indexs.join("."),
                    "TreeComponent__content__bar--is-before": dragTarget?.target === "before",
                    "TreeComponent__content__bar--is-after": dragTarget?.target === "after",
                    "TreeComponent__content__bar--is-in": dragTarget?.target === "in"
                })}></span>
                <span className={`TreeComponent__content__icon TreeComponent__content__icon--${type}`}></span>

                {name}
            </div>

        </li>
    )
}

export default TreeComponentView;