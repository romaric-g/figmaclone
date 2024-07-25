import React from "react";
import { Editor } from "../../core/editor";
import { cursorChangeSubject } from "../subjects";
import "./canvas.scss";


const Canvas: React.FC = () => {

    const [cursor, setCursor] = React.useState<string>("default")

    React.useEffect(() => {

        setTimeout(async () => {
            const canvasContainer = document.getElementById("canvas")
            const editor = Editor.getEditor();

            if (canvasContainer) {
                await editor.init({
                    resizeTo: canvasContainer
                })

                canvasContainer.appendChild(editor.getCanvas());
            }

            cursorChangeSubject.subscribe((cursor) => {
                setCursor(cursor)
            })
        }, 0)

    }, [])

    return (
        <div className="Canvas" id="canvas" style={{ cursor: cursor }}>
        </div>
    )
}

export default Canvas;