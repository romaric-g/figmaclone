import React from "react";
import TreeView from "./tree/tree";
import ToolbarView from "./tool/toolbar";
import { ToolType } from "../core/tools/toolManager";
import Canvas from "./canvas/canvas";
import ElementEditor from "./selection/selectionEditor";
import { Editor } from "../core/editor";
import { currentToolSubject, TreeData, treeElementSubject } from "./subjects";
import "./app.scss";
import "./reset.scss"

const App: React.FC = () => {

    const [treeData, setTreeData] = React.useState<TreeData>({ tree: [] });
    const [currentTool, setCurrentTool] = React.useState<ToolType>();

    React.useEffect(() => {

        setCurrentTool(Editor.getEditor().toolManager.getCurrentToolType())

        const treeSub = treeElementSubject.subscribe(newValue => {
            setTreeData(newValue);
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
                <TreeView treeData={treeData} />
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