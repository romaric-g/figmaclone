import React from "react"
import { TreeContainerData } from "../subjects"
import "./treeContainerHead.scss"
import TreeComponentView from "./treeComponent"
import { DragOrigin, DragTarget } from "./tree"

interface Props {
    indexs: number[],
    drawActivate: boolean,
    treeContainer: TreeContainerData,
    children: React.ReactNode,
    isDragging: boolean,
    setDragOrigin: (dragOrigin: DragOrigin) => void,
    dragTarget: DragTarget | undefined,
    setDragTarget: (dragTarget: DragTarget) => void,
}

const TreeContainerHeadView: React.FC<Props> = ({
    indexs,
    treeContainer,
    children,
    isDragging,
    setDragOrigin,
    dragTarget,
    setDragTarget
}) => {

    return (
        <>
            <TreeComponentView
                type="container"
                name={treeContainer.name}
                indexs={indexs}
                isSelected={treeContainer.selected}
                isDragging={isDragging}
                setDragOrigin={setDragOrigin}
                dragTarget={dragTarget}
                setDragTarget={setDragTarget}
            />
            <div className="TreeContainerHead__content">
                {children}
            </div>
        </>
    )
}

export default TreeContainerHeadView