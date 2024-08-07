import { CanvasTextMetrics, Point, TextStyle } from "pixi.js"

export function getLinesFromStyle(text: string, style: TextStyle) {
    let textMetrics = CanvasTextMetrics.measureText(text, style)
    let lines = textMetrics.lines

    return lines;
}

export function getFullLines(text: string, lines: string[]) {
    const allFullLines = [];

    let startIndex = 0;
    let endIndex = 0;
    let searchIndex = lines[0].length;
    let searchText = text.slice(searchIndex)

    for (const line of lines.slice(1)) {
        if (line === "") {
            const crIndex = searchText.indexOf("\n")
            if (crIndex === -1) {
                endIndex = text.length;
            } else {
                endIndex = searchIndex + crIndex + 1
            }
        } else {
            endIndex = searchIndex + searchText.indexOf(line)
        }

        const fullLine = text.slice(startIndex, endIndex)
        allFullLines.push(fullLine)

        startIndex = endIndex;

        searchIndex = startIndex + line.length
        searchText = text.slice(searchIndex)

    }

    const fullLine = text.slice(startIndex)
    allFullLines.push(fullLine)

    return allFullLines;
}


export function sliceFullLines(fullLines: string[], endIndex: number) {
    let cumIndex = 0;
    let slicedFullLines = []

    for (const line of fullLines) {
        cumIndex += line.length;

        if (cumIndex >= endIndex) {
            let localEndIndex = line.length + endIndex - cumIndex
            slicedFullLines.push(line.slice(0, localEndIndex))
            break
        } else {
            slicedFullLines.push(line)
        }
    }

    return slicedFullLines;
}

export function getIndexPosition(charIndex: number, text: string, style: TextStyle) {
    const lines = getLinesFromStyle(text, style)
    const fullLines = getFullLines(text, lines);

    const slicedLines = sliceFullLines(fullLines, charIndex)

    let currentLine = slicedLines[slicedLines.length - 1]
    let textBefore = slicedLines.slice(0, slicedLines.length - 1).join("")

    if (currentLine.endsWith("\n")) {
        textBefore = textBefore + currentLine
        currentLine = ""
    }

    if (textBefore.endsWith("\n")) {
        textBefore = textBefore.slice(0, -1)
    }

    // console.log("Index", charIndex)
    // console.log("lines", lines)
    // console.log("full lines", fullLines)
    // console.log("currentLine", [currentLine])
    // console.log("textBefore", [textBefore])

    const width = getTextWidth(currentLine, style)
    const height = textBefore.length === 0 ? 0 : getTextHeight(textBefore, style)

    return new Point(width, height)

}


export function getTextWidth(text: string, style: TextStyle) {
    const formatedText = text.replace(" ", "\u00A0").replace("\n", "")

    return CanvasTextMetrics.measureText(formatedText, style, undefined, false).width
}

export function getTextHeight(text: string, style: TextStyle) {
    const formatedText = formatTextForRendering(text)

    return CanvasTextMetrics.measureText(formatedText, style).height;
}


export function formatTextForRendering(text: string) {
    // Remove all end spaces at end or just before an end CR (\n) at end   
    const formatedText = text.replace(/[ \t]+(?=\n|$)/g, '');

    return formatedText;
}