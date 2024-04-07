import { Point } from "pixi.js";
import { Element } from "./element";
import { Selector } from "./selector";


export class Move {

    private selector: Selector;
    private moveElements: MoveElement[] = [];

    private referenceElement: Element;
    private referenceElementPosition: Point;
    private referenceClickPosition: Point;

    constructor(selector: Selector, referenceElement: Element, referenceClickPosition: Point) {
        this.selector = selector;

        this.referenceElement = referenceElement;
        this.referenceElementPosition = new Point(referenceElement.x, referenceElement.y)

        this.referenceClickPosition = referenceClickPosition.clone();

        for (const selectedElement of this.selector.getSelectedElement()) {
            this.moveElements.push(new MoveElement(selectedElement))
        }
    }


    getMouvementVector(currentClickPosition: Point) {
        const x = currentClickPosition.x - this.referenceClickPosition.x;
        const y = currentClickPosition.y - this.referenceClickPosition.y;

        return new Point(x, y)
    }


    moveSelection(currentClickPosition: Point) {
        const movementVector = this.getMouvementVector(currentClickPosition)

        // console.log(movementVector)

        for (const moveElement of this.moveElements) {
            moveElement.moveElement(movementVector)
        }
    }

    haveMoov() {
        const sameX = this.referenceElement.x == this.referenceElementPosition.x
        const sameY = this.referenceElement.y == this.referenceElementPosition.y

        if (sameX && sameY) {
            return false;
        } else {
            return true;
        }

    }

}


export class MoveElement {
    originalPosition: Point;
    element: Element;

    constructor(element: Element) {
        this.element = element;
        this.originalPosition = new Point(this.element.x, this.element.y)
    }

    moveElement(movementVector: Point) {
        const newX = this.originalPosition.x + movementVector.x
        const newY = this.originalPosition.y + movementVector.y

        console.log(newX, newY)

        this.element.setPosition(newX, newY)
    }
}