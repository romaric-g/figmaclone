import React from 'react';
import ReactDOM from 'react-dom/client';
import { Application, Sprite, Assets } from 'pixi.js';
import { Editor } from './core/editor';
import { Rect } from './core/element';
import TreeView from './ui/tree/tree';
import App from './ui/app';

console.log("Welcome")

async function main() {

    const editor = Editor.getEditor()

    // await editor.init()

    const rects: Rect[] = [
        new Rect(0, 0, 100, 100),
        new Rect(100, 100, 100, 100, "blue"),
        // new Rect(40, 40, 100, 100, "blue"),
        // new Rect(60, 60, 100, 100, "green"),
        // new Rect(80, 80, 100, 100),

        // new Rect(-650, 60, 100, 100, "yellow"),
    ]

    let i = 1
    for (let rect of rects) {
        editor.tree.addElement(rect)

        rect.name = "element_" + i;
        i++;

    }

    editor.tree.changeIndex(rects[1], 3)

    const domElement = document.getElementById('app')

    if (domElement) {
        const root = ReactDOM.createRoot(domElement);

        root.render(<App />);
    }
}

main()