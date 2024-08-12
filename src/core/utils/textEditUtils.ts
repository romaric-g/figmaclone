import { HsvaColor } from "@uiw/react-color";
import { CanvasTextMetrics, Point, TextStyle } from "pixi.js"

function getLinesFromStyle(text: string, style: TextStyle) {
    let textMetrics = CanvasTextMetrics.measureText(text, style)
    let lines = textMetrics.lines

    return lines;
}

function getFullLines(text: string, lines: string[]) {
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


function sliceFullLines(fullLines: string[], endIndex: number) {
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

export interface LinePosition {
    start: Point,
    end: Point
}

function getLinesLocalPositions(text: string, style: TextStyle, startIndex = 0, endIndex = -1) {
    const lines = getLinesFromStyle(text, style)
    const fullLines = getFullLines(text, lines);

    let linesBefore = []

    if (endIndex === -1) {
        endIndex = text.length;
    }

    if (startIndex === endIndex) {
        return []
    }

    const linesPositions: LinePosition[] = []

    let lineStartIndex = 0;
    let lineEndIndex = 0;

    for (const line of fullLines) {
        lineStartIndex = lineEndIndex;
        lineEndIndex = lineStartIndex + line.length;

        let textBefore = linesBefore.join("")
        linesBefore.push(line)

        if (textBefore.endsWith("\n")) {
            textBefore = textBefore.slice(0, -1)
        }

        if (lineEndIndex < startIndex || lineStartIndex > endIndex) {
            continue;
        }

        let xStart = 0
        let xEnd = getTextWidth(line, style)
        const y = textBefore.length === 0 ? 0 : getTextHeight(textBefore, style)

        if (startIndex > lineStartIndex && startIndex < lineEndIndex) {
            if (lineEndIndex !== startIndex) {
                const charsBeforeStart = line.slice(0, startIndex - lineStartIndex)
                xStart = getTextWidth(charsBeforeStart, style)
            }
        }

        if (endIndex > lineStartIndex && endIndex < lineEndIndex) {
            const charsBeforeEnd = line.slice(0, endIndex - lineEndIndex)
            xEnd = getTextWidth(charsBeforeEnd, style)
        }

        const linePosition: LinePosition = {
            start: new Point(xStart, y),
            end: new Point(xEnd, y)
        }

        linesPositions.push(linePosition)

    }

    return linesPositions;
}

function getIndexPointerPosition(charIndex: number, text: string, style: TextStyle) {
    const lines = getLinesFromStyle(text, style)
    const fullLines = getFullLines(text, lines);

    const slicedLines = sliceFullLines(fullLines, charIndex)

    let currentLine = slicedLines[slicedLines.length - 1]
    let textBefore = slicedLines.slice(0, slicedLines.length - 1).join("")

    // Permet de mettre le curseur au debut de la ligne suivante si le dernier caractere est un retour à la ligne
    if (currentLine.endsWith("\n")) {
        textBefore = textBefore + currentLine
        currentLine = ""
    }

    // Permet de ne pas prendre en compte le dernier \n dans le calcule de la hauteur
    if (textBefore.endsWith("\n")) {
        textBefore = textBefore.slice(0, -1)
    }

    const width = getTextWidth(currentLine, style)
    const height = textBefore.length === 0 ? 0 : getTextHeight(textBefore, style)

    return new Point(width, height)

}


function getTextWidth(text: string, style: TextStyle) {
    const formatedText = text.replace(" ", "\u00A0").replace("\n", "")

    return CanvasTextMetrics.measureText(formatedText, style, undefined, false).width
}

function getTextHeight(text: string, style: TextStyle) {
    const formatedText = formatTextForRendering(text)

    return CanvasTextMetrics.measureText(formatedText, style).height;
}


function formatTextForRendering(text: string) {
    // Remove all end spaces at end or just before an end CR (\n) at end   
    const formatedText = text.replace(/[ \t]+(?=\n|$)/g, '');

    return formatedText;
}

interface TextStyleProps {
    wordWrapWidth: number,
    fontSize: number,
    color: HsvaColor
}


function getTextStyle(props: TextStyleProps) {
    return new TextStyle({
        fontFamily: 'Arial',
        fontSize: props.fontSize,
        fill: props.color,
        wordWrap: true,
        wordWrapWidth: props.wordWrapWidth,
        breakWords: true,
        whiteSpace: "pre",
    });
}

function getClosestIndex(fullLines: string[], localPoint: Point, style: TextStyle) {
    const lineIndex = getClosestLineIndex(fullLines, localPoint.y, style)

    const fullLine = fullLines[lineIndex]
    const letterIndex = getClosestLetterIndex(fullLine, localPoint.x, style)
    const targetIndex = fullLines.slice(0, lineIndex).join("").length + letterIndex;

    return targetIndex;
}

function getClosestLineIndex(fullLines: string[], yClick: number, style: TextStyle) {

    let minDiffHeight;
    let bestIndex = 0;

    for (let index = 0; index < fullLines.length; index++) {
        const slicedFullLines = fullLines.slice(0, index)
        let textBefore = slicedFullLines.join("")

        if (textBefore.endsWith("\n")) {
            textBefore = textBefore.slice(0, -1)
        }

        const textHeight = index === 0 ? 0 : getTextHeight(textBefore, style)
        const height = textHeight + (style.fontSize / 2)
        const diffHeight = Math.abs(height - yClick)

        if (minDiffHeight == undefined || diffHeight <= minDiffHeight) {
            minDiffHeight = diffHeight;
            bestIndex = index;
        } else {
            return bestIndex;
        }
    }

    return fullLines.length - 1;
}


function getClosestLetterIndex(fullLine: string, xClick: number, style: TextStyle) {
    let textBefore = ""
    for (let index = 0; index < fullLine.length; index++) {
        const char = fullLine[index];
        textBefore += char;

        const width = getTextWidth(textBefore, style)

        if (width - 2 > xClick) {
            return index;
        }
    }

    return fullLine.length;
}


export const TextEditUtils = {
    getLinesFromStyle,
    getFullLines,
    sliceFullLines,
    getLinesLocalPositions,
    getIndexPointerLocalPosition: getIndexPointerPosition,
    formatTextForRendering,
    getTextStyle,
    getClosestIndex
}
