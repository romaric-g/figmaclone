import React from "react";
import TreeView from "./tree/tree";
import { TreeElementData } from "./tree/treeElement";
import ToolbarView from "./tool/toolbar";
import { ToolType } from "../core/tools/toolManager";
import Canvas from "./canvas/canvas";
import "./app.scss";
import "./reset.scss"
import ElementEditor from "./selection/selectionEditor";
import { Editor } from "../core/editor";
import { currentToolSubject, treeElementSubject } from "./subjects";

const App: React.FC = () => {

    const [treeElements, setTreeElements] = React.useState<TreeElementData[]>([]);
    const [currentTool, setCurrentTool] = React.useState<ToolType>();

    React.useEffect(() => {

        setCurrentTool(Editor.getEditor().toolManager.getCurrentToolType())

        const treeSub = treeElementSubject.subscribe(newValue => {
            setTreeElements(newValue);
        });

        const toolSub = currentToolSubject.subscribe(newValue => {
            setCurrentTool(newValue);
        });

        return () => {
            treeSub.unsubscribe();
            toolSub.unsubscribe();
        };
    }, []);

    return (
        <div className="App">
            <div className="App__leftside">
                <ToolbarView selectedTool={currentTool} />
                <TreeView elements={treeElements} />
            </div>
            <div className="App__middle">
                <Canvas />
            </div>
            <div className="App__rightside">
                <ElementEditor />
            </div>
        </div >
    )
}

export default App;