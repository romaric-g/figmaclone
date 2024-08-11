import React from "react"
import { TreeComponentData } from "../subjects"
import TreeBoxView from "./treeRect"
import TreeContainerHeadView from "./treeContainerHead"
import { DragOrigin, DragTarget } from "./tree"
import classNames from "classnames"
import "./treeContainerContent.scss"

interface Props {
    indexs: number[],
    selected: boolean,
    drawActivate: boolean,
    isDragging: boolean,
    setDragOrigin: (dragOrigin: DragOrigin) => void,
    dragTarget: DragTarget | undefined,
    setDragTarget: (dragTarget: DragTarget) => void,
    tree: TreeComponentData[]
}

const TreeContainerContentView: React.FC<Props> = ({
    indexs,
    selected,
    drawActivate,
    isDragging,
    setDragOrigin,
    dragTarget,
    setDragTarget,
    tree
}) => {

    return (
        <ul className={classNames("TreeContainerContent", {
            "TreeContainerContent--selected": selected
        })}>
            {
                tree.map((treeComponent, childIndex) => {
                    const joinIndexs = [...indexs, childIndex]
                    const key = joinIndexs.join(".")

                    if (treeComponent.type === "container") {
                        return (
                            <TreeContainerHeadView
                                key={key}
                                indexs={joinIndexs}
                                drawActivate={drawActivate}
                                treeContainer={treeComponent}
                                dragTarget={dragTarget}
                                isDragging={isDragging}
                                setDragTarget={setDragTarget}
                                setDragOrigin={setDragOrigin}
                            >
                                <TreeContainerContentView
                                    indexs={joinIndexs}
                                    selected={treeComponent.selected}
                                    drawActivate={drawActivate}
                                    isDragging={isDragging}
                                    setDragOrigin={setDragOrigin}
                                    dragTarget={dragTarget}
                                    setDragTarget={setDragTarget}
                                    tree={treeComponent.children}
                                />
                            </TreeContainerHeadView>
                        )
                    }

                    return <TreeBoxView
                        key={key}
                        indexs={joinIndexs}
                        name={treeComponent.name}
                        isDragging={isDragging}
                        isSelected={treeComponent.selected}
                        setDragOrigin={setDragOrigin}
                        dragTarget={dragTarget}
                        setDragTarget={setDragTarget}
                        type={treeComponent.type}
                    />
                })
            }
        </ul>
    )
}

export default TreeContainerContentView