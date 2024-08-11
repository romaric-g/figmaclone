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
    type: "rect" | "text"
}

const TreeBoxView: React.FC<Props> = ({
    indexs,
    name,
    isSelected,
    dragTarget,
    isDragging,
    setDragOrigin,
    setDragTarget,
    type
}) => {

    return (
        <TreeComponentView
            indexs={indexs}
            name={name}
            type={type}
            isSelected={isSelected}
            isDragging={isDragging}
            dragTarget={dragTarget}
            setDragOrigin={setDragOrigin}
            setDragTarget={setDragTarget}
        />
    )
}

export default TreeBoxView;