import { Application, Sprite, Assets } from 'pixi.js';
import { Editor } from './editor';
import { Rect } from './element';

console.log("Welcome")

async function main() {

    const editor = new Editor()

    await editor.init(document.body)

    const rects: Rect[] = [
        new Rect(20, 20, 100, 100),
        new Rect(200, 0, 100, 100),
        new Rect(100, 200, 100, 100),
        new Rect(400, 200, 100, 100)
    ]

    for (let rect of rects) {
        editor.addElement(rect)
    }

}

main()