import React from 'react';
import ReactDOM from 'react-dom/client';
import { Application, Sprite, Assets } from 'pixi.js';
import { Editor } from './core/editor';
import App from './ui/app';
import { TreeRect } from './core/tree/treeRect';
import { TreeContainer } from './core/tree/treeContainer';
import { TreeComponent } from './core/tree/treeComponent';
import { Selection } from './core/selections/selection';

async function main() {
    const editor = Editor.getEditor()

    const a = new TreeRect({
        x: 300,
        y: 300,
        height: 100,
        width: 100,
        fillColor: { h: 200, s: 100, v: 100, a: 1 },
        name: "in group 1"
    })

    const rootComponents: TreeComponent[] = [
        new TreeContainer("group 1", [
            a,
            new TreeContainer("group 2 in group 1", [
                new TreeRect({
                    x: 500,
                    y: 500,
                    height: 100,
                    width: 100,
                    fillColor: { h: 50, s: 100, v: 50, a: 1 },
                    name: "in group 2"
                }),
                new TreeRect({
                    x: 600,
                    y: 600,
                    height: 100,
                    width: 100,
                    fillColor: { h: 100, s: 50, v: 50, a: 1 },
                    name: "in group 2"
                })
            ]),
            new TreeRect({
                x: 400,
                y: 400,
                height: 100,
                width: 100,
                fillColor: { h: 20, s: 100, v: 100, a: 1 },
                name: "in group 1"
            })
        ]),
        new TreeRect({
            x: 0,
            y: 0,
            height: 100,
            width: 100,
            fillColor: { h: 150, s: 70, v: 70, a: 1 },
            name: "element 1"
        }),
        new TreeRect({
            x: 100,
            y: 100,
            height: 100,
            width: 100,
            fillColor: { h: 200, s: 90, v: 90, a: 1 },
            name: "element 2"
        })
    ]

    for (let rect of rootComponents) {
        editor.treeManager.registerContainer(rect, true)
    }

    editor.treeManager.getTree().moveFromIndexs([1], [3])
    editor.treeManager.emitTreeChangeEvent()

    const domElement = document.getElementById('app')

    // setTimeout(() => {
    //     editor.selectionManager.setSelection(new Selection([a]))
    // }, 200)

    if (domElement) {
        const root = ReactDOM.createRoot(domElement);

        root.render(<App />);
    }
}

main()