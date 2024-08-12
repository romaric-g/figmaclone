
export interface SquaredZone {
    minX: number,
    minY: number,
    maxX: number,
    maxY: number
}

export function getSquaredCoveredZone(zones: SquaredZone[]): SquaredZone | undefined {

    let minX = undefined
    let minY = undefined
    let maxX = undefined
    let maxY = undefined

    for (const zone of zones) {
        if (minX == undefined || zone.minX < minX) {
            minX = zone.minX
        }
        if (minY === undefined || zone.minY < minY) {
            minY = zone.minY
        }
        if (maxX === undefined || zone.maxX > maxX) {
            maxX = zone.maxX
        }
        if (maxY === undefined || zone.maxY > maxY) {
            maxY = zone.maxY
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

