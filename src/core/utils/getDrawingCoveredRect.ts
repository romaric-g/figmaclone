import { Point } from "pixi.js";
import { Editor } from "../editor";
import { TreeRect } from "../tree/treeRect";

export function getDrawingCoveredRect(rects: TreeRect[], useOriginal = false) {
    let minX = undefined
    let minY = undefined
    let maxX = undefined
    let maxY = undefined

    for (const rect of rects) {
        let x1 = useOriginal ? rect.getOriginalPosition().x : rect.x;
        let x2 = x1 + rect.width;
        let y1 = useOriginal ? rect.getOriginalPosition().y : rect.y;
        let y2 = y1 + rect.height;

        if (minX == undefined || x1 < minX) {
            minX = x1
        }
        if (minY === undefined || y1 < minY) {
            minY = y1
        }
        if (maxX === undefined || x2 > maxX) {
            maxX = x2
        }
        if (maxY === undefined || y2 > maxY) {
            maxY = y2
        }
    }

    if (minX == undefined || minY == undefined || maxX === undefined || maxY === undefined) {
        return undefined
    }

    return {
        minX,
        minY,
        maxX,
        maxY
    }
}