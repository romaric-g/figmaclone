import { GraphicsContext } from "pixi.js";

export function drawCross(context: GraphicsContext, x: number, y: number, size = 3, color = "red") {
    context
        .moveTo(x - size, y - size)
        .lineTo(x + size, y + size)
        .stroke({
            width: 1,
            a: 1,
            color: color
        })
        .moveTo(x + size, y - size)
        .lineTo(x - size, y + size)
        .stroke({
            width: 1,
            a: 1,
            color: color
        })
}