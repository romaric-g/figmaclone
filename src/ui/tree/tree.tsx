import React from "react";
import "./tree.scss"
import TreeElementView, { TreeElementData } from "./treeElement";

interface TreeProps {
    elements: TreeElementData[]
}

const TreeView: React.FC<TreeProps> = ({ elements }) => {

    return <div className="Tree">
        <p className="Tree__title">Tree element</p>
        <br />
        <ul>
            {
                elements.map((element) => (
                    <TreeElementView key={element.index} index={element.index} name={element.name} />
                ))
            }
        </ul>
    </div>
}

export default TreeView;