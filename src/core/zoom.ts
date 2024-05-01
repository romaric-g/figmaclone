import { Container, FederatedPointerEvent, FederatedWheelEvent, Point } from "pixi.js";
import { Editor } from "./editor";

export class Zoom {
    private _editor: Editor;

    private _scale: number = 1;
    private _x = 0;
    private _y = 0;


    private wheelClickStart?: Point;
    private originalTreeContainerPosition?: Point;

    constructor(editor: Editor) {
        this._editor = editor;

        document.addEventListener('wheel', (event) => {
            if (event.ctrlKey) {
                event.preventDefault();
            }
        }, { passive: false });


        const onMouseDown = (event: FederatedPointerEvent) => {
            if (event.button === 1) {
                event.preventDefault()

                this._editor.toolManager.freeze()

                this.wheelClickStart = event.global.clone();
                this.originalTreeContainerPosition = this._editor.getTreeContainer().position.clone()
            }
        }
        const onMouseUp = (event: FederatedPointerEvent) => {
            if (event.button === 1) {

                this._editor.toolManager.unfreeze()

                this.wheelClickStart = undefined;
                this.originalTreeContainerPosition = undefined;
            }
        }

        const onMouseMove = (event: FederatedPointerEvent) => {
            if (this.wheelClickStart && this.originalTreeContainerPosition) {
                const moveX = this.wheelClickStart.x - event.global.x;
                const moveY = this.wheelClickStart.y - event.global.y;

                this._x = this.originalTreeContainerPosition.x - moveX
                this._y = this.originalTreeContainerPosition.y - moveY
            }
        }

        const onWheel = (event: FederatedWheelEvent) => {
            const canvas = this._editor.getCanvas()

            const maxX = canvas.width - this._x;
            const maxY = canvas.height - this._y;

            const global = event.global;

            const globalX = global.x - this._x;
            const globalY = global.y - this._y;

            let scaleFactor = 1;

            if (event.deltaY > 0 && this._scale > 0.1) {
                scaleFactor = 0.8
            } else if (event.deltaY < 0 && this._scale < 10) {
                scaleFactor = 1.2
            }

            if (scaleFactor !== 1) {
                this._scale = this._scale * scaleFactor;

                const correctionX = globalX - (globalX / maxX) * (maxX * scaleFactor)
                const correctionY = globalY - (globalY / maxY) * (maxY * scaleFactor)

                this._x = this._x + correctionX;
                this._y = this._y + correctionY;
            }
        }

        editor.getBackgroundContainer().on("mousedown", onMouseDown)
        editor.getBackgroundContainer().on("mouseup", onMouseUp)
        editor.getBackgroundContainer().on("mousemove", onMouseMove)
        editor.getBackgroundContainer().on("wheel", onWheel)

        editor.getTreeContainer().on("mousedown", onMouseDown)
        editor.getTreeContainer().on("mouseup", onMouseUp)
        editor.getTreeContainer().on("mousemove", onMouseMove)
        editor.getTreeContainer().on("wheel", onWheel)


    }

    getCurrentScale() {
        return this._scale;
    }

    getX(): number {
        return this._x;
    }

    getY(): number {
        return this._y;
    }

    getScale(): number {
        return this._scale;
    }
}

