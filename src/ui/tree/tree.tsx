import React from "react";
import { TreeData } from "../subjects";
import "./tree.scss"
import classNames from "classnames";
import TreeContainerContentView from "./treeContainerContent";
import { Editor } from "../../core/editor";
import { MoveElementAction } from "../../core/actions/moveElementAction";

interface TreeProps {
    treeData: TreeData
}

export interface DragOrigin {
    indexs: number[]
}

export interface DragTarget {
    indexs: number[],
    target: "before" | "after" | "in"
}

const TreeView: React.FC<TreeProps> = ({ treeData }) => {

    const [dragOrigin, setDrawOrigin] = React.useState<DragOrigin>()
    const [dragTarget, setDragTarget] = React.useState<DragTarget>()

    React.useEffect(() => {

        const onMouseUp = () => {


            if (dragOrigin !== undefined && dragTarget !== undefined) {
                const targetIndexs = dragTarget.indexs

                if (dragTarget.target === "after") {
                    targetIndexs[targetIndexs.length - 1] = targetIndexs[targetIndexs.length - 1] + 1
                }

                const from = dragOrigin.indexs
                const to = targetIndexs

                Editor.getEditor().actionManager.push(
                    new MoveElementAction(from, to)
                )
            }

            setDrawOrigin(undefined)
            setDragTarget(undefined)
        }

        document.addEventListener("mouseup", onMouseUp)

        return () => {
            document.removeEventListener("mouseup", onMouseUp)
        }
    }, [dragOrigin, dragTarget])

    const isDragging = React.useMemo(() => {
        return dragOrigin !== undefined
    }, [dragOrigin])

    const setDragTargetHandler = React.useCallback((dragTarget: DragTarget) => {

        if (dragOrigin !== undefined) {
            const dragTargetId = dragTarget.indexs.join(".")
            const dragOriginId = dragOrigin.indexs.join(".")

            if (!dragTargetId.startsWith(dragOriginId)) {
                setDragTarget(dragTarget)
            } else if (dragOriginId === dragTargetId && dragTarget.target === "before") {
                setDragTarget(dragTarget)
            } else {
                setDragTarget({
                    indexs: dragOrigin.indexs,
                    target: "after"
                })
            }
        }


    }, [dragOrigin, setDragTarget])

    return (
        <div className="Tree">
            <p className="Tree__title">Tree element</p>
            <br />
            <div className={classNames("Tree__elements")}>
                <TreeContainerContentView
                    indexs={[]}
                    selected={false}
                    isDragging={isDragging}
                    drawActivate={isDragging}
                    dragTarget={dragTarget}
                    setDragOrigin={setDrawOrigin}
                    setDragTarget={setDragTargetHandler}
                    tree={treeData.tree}
                />
            </div>
        </div>
    )



}

export default TreeView;