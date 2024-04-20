import React from "react";
import "./tree.scss"
import TreeElementView from "./treeElement";
import classNames from "classnames";
import { TreeElementData } from "../subjects";
import { Editor } from "../../core/editor";

interface TreeProps {
    elements: TreeElementData[]
}

const TreeView: React.FC<TreeProps> = ({ elements }) => {

    const [currentMoveIndex, setCurrentMoveIndex] = React.useState<number>()
    const [targetIndexPosition, setTargetPositionIndex] = React.useState<number>()
    const [indicatorTop, setIndicatorTop] = React.useState<number>()

    React.useEffect(() => {

        const onMouseUp = () => {
            const tree = Editor.getEditor().treeManager.getTree()

            if (targetIndexPosition !== undefined && currentMoveIndex !== undefined) {
                console.log(currentMoveIndex, targetIndexPosition)

                tree.move([currentMoveIndex], [targetIndexPosition])
            }

            setCurrentMoveIndex(undefined)
            setTargetPositionIndex(undefined)
            setIndicatorTop(undefined)
        }

        document.addEventListener("mouseup", onMouseUp)

        return () => {
            document.removeEventListener("mouseup", onMouseUp)
        }
    }, [currentMoveIndex, targetIndexPosition])

    return <div className="Tree">
        <p className="Tree__title">Tree element</p>
        <br />
        <div className={classNames("Tree__elements", { "Tree__elements--no-hover": currentMoveIndex !== undefined })}>
            {
                currentMoveIndex !== undefined && targetIndexPosition !== undefined && (
                    <span className="Tree__elements__moovbar" style={{
                        top: indicatorTop
                    }}></span>
                )
            }
            <ul>
                {
                    elements.map((element) => (
                        <TreeElementView
                            key={element.index}
                            index={element.index}
                            name={element.name}
                            isSelected={element.selected}
                            activeMove={() => {
                                setCurrentMoveIndex(element.index)
                            }}
                            updateMoveBar={(direction, offsetTop, offsetHeight) => {
                                if (direction === "top") {
                                    setIndicatorTop(offsetTop - 2)
                                } else {
                                    setIndicatorTop(offsetTop + offsetHeight - 2)
                                }

                                setTargetPositionIndex(element.index)
                            }}
                        />
                    ))
                }
            </ul>
        </div>
    </div>
}

export default TreeView;