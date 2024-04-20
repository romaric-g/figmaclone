import React from 'react';
import ReactDOM from 'react-dom/client';
import { Application, Sprite, Assets } from 'pixi.js';
import { Editor } from './core/editor';
import TreeView from './ui/tree/tree';
import App from './ui/app';
import { TreeRect } from './core/tree/treeRect';
import { TreeContainer } from './core/tree/treeContainer';
import { TreeComponent } from './core/tree/treeComponent';

console.log("Welcome")

async function main() {

    const editor = Editor.getEditor()

    // await editor.init()

    const container = new TreeContainer()

    const a = new TreeRect({
        x: 300,
        y: 300,
        height: 100,
        width: 100,
        fill: { r: 255, g: 0, b: 255 },
        name: "in group 1"
    })

    const b = new TreeRect({
        x: 400,
        y: 400,
        height: 100,
        width: 100,
        fill: { r: 255, g: 255, b: 0 },
        name: "in group 2"
    })

    editor.treeManager.registerContainer(a)
    editor.treeManager.registerContainer(b)

    container.add(a)
    container.add(b)

    const rects: TreeComponent[] = [
        container,
        new TreeRect({
            x: 0,
            y: 0,
            height: 100,
            width: 100,
            fill: { r: 255, g: 0, b: 0 },
            name: "element 1"
        }),
        new TreeRect({
            x: 100,
            y: 100,
            height: 100,
            width: 100,
            fill: { r: 0, g: 0, b: 255 },
            name: "element 2"
        }),
        // new TreeRect(40, 40, 100, 100, "blue"),
        // new TreeRect(60, 60, 100, 100, "green"),
        // new TreeRect(80, 80, 100, 100),

        // new TreeRect(-650, 60, 100, 100, "yellow"),
    ]

    for (let rect of rects) {
        editor.treeManager.registerContainer(rect, true)
    }

    editor.treeManager.getTree().move([1], [3])
    editor.treeManager.emitTreeChangeEvent()

    const domElement = document.getElementById('app')

    if (domElement) {
        const root = ReactDOM.createRoot(domElement);

        root.render(<App />);
    }
}

main()