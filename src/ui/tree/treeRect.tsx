import React from "react";
import "./treeRect.scss";
import TreeComponentView from "./treeComponent";
import { DragOrigin, DragTarget } from "./tree";

interface Props {
    indexs: number[],
    name: string,
    isSelected: boolean,
    isDragging: boolean,
    setDragOrigin: (dragOrigin: DragOrigin) => void,
    dragTarget: DragTarget | undefined,
    setDragTarget: (dragTarget: DragTarget) => void,
}

const TreeRectView: React.FC<Props> = ({
    indexs,
    name,
    isSelected,
    dragTarget,
    isDragging,
    setDragOrigin,
    setDragTarget
}) => {

    return (
        <TreeComponentView
            indexs={indexs}
            name={name}
            type={"rect"}
            isSelected={isSelected}
            isDragging={isDragging}
            dragTarget={dragTarget}
            setDragOrigin={setDragOrigin}
            setDragTarget={setDragTarget}
        />
    )
}

export default TreeRectView;