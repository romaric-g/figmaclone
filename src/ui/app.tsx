import React, { MouseEvent } from "react";
import TreeView from "./tree/tree";
import ToolbarView from "./tool/toolbar";
import Canvas from "./canvas/canvas";
import { Editor } from "../core/editor";
import { contextMenuChangeSubject, ContextMenuData, currentToolSubject, ToolType, TreeData, treeElementSubject } from "./subjects";
import SelectionEditorContainer from "./selection/selectionEditorContainer";
import ContextMenu from "./components/ContextMenu";
import "./app.scss";
import "./reset.scss"


const App: React.FC = () => {

    const [treeData, setTreeData] = React.useState<TreeData>({ tree: [] });
    const [currentTool, setCurrentTool] = React.useState<ToolType>();

    const [contextMenu, setContextMenu] = React.useState<ContextMenuData | null>(null);

    const handleContextMenu = (event: MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const handleClick = () => {
        if (contextMenu) {
            setContextMenu(null);
        }
    };

    React.useEffect(() => {

        setCurrentTool(Editor.getEditor().toolManager.getCurrentToolType())

        const treeSub = treeElementSubject.subscribe(newValue => {
            setTreeData(newValue);
        });

        const toolSub = currentToolSubject.subscribe(newValue => {
            setCurrentTool(newValue);
        });

        const menuSub = contextMenuChangeSubject.subscribe(newValue => {
            setTimeout(() => {
                setContextMenu(newValue)
            }, 20);
        })

        return () => {
            treeSub.unsubscribe();
            toolSub.unsubscribe();
            menuSub.unsubscribe();
        };
    }, []);

    return (
        <div
            className="App"
            onContextMenu={handleContextMenu}
            onClick={handleClick}
        // onMouseDown={handleClick}
        >
            <div className="App__leftside">
                <ToolbarView selectedTool={currentTool} />
                <TreeView treeData={treeData} />
            </div>
            <div className="App__middle">
                <Canvas />
            </div>
            <div className="App__rightside">
                <SelectionEditorContainer />
            </div>
            {contextMenu &&
                <ContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    items={contextMenu.items}
                    onClose={() => setContextMenu(null)}
                />
            }
        </div >
    )
}

export default App;