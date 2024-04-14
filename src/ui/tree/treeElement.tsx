import React from "react";
import "./treeElement.scss";

export interface TreeElementData {
    index: number,
    name: string
}

const TreeElementView: React.FC<TreeElementData> = ({ index, name }) => {
    return (
        <li className="TreeElement" key={index}>{name}</li>
    )
}

export default TreeElementView;