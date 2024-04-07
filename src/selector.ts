import { Point } from "pixi.js";
import { Element } from "./element";
import { Move } from "./move";


export class Selector {
    private elements: Element[] = []
    private move?: Move;

    private registerElement(element: Element) {
        this.elements.push(element)

        return element;
    }

    getRegistredElement(element: Element) {
        const selectionElement = this.elements.find(el => el === element);

        if (!selectionElement) {
            return this.registerElement(element)
        }

        return selectionElement;
    }

    unselectAll() {
        for (const selectionElement of this.elements) {
            selectionElement.unselect()
        }
    }

    clearCache() {
        const keededSelectionElement = []

        for (const selectionElement of this.elements) {
            if (selectionElement.isSelected()) {
                keededSelectionElement.push(selectionElement)
            }
        }

        this.elements = keededSelectionElement;
    }

    getSelectedElement() {
        return this.elements.filter((el) => el.isSelected())
    }

    activateMoov(element: Element, pointerPosition: Point) {
        this.move = new Move(this, element, pointerPosition)
    }

    selectedElementPressionIsActivate() {
        return this.move !== undefined;
    }

    disableSelectedElementPression() {
        this.move = undefined;
    }

    selectedElementPressionMove() {
        if (!this.move) {
            throw "Aucune référence pour mesurer le déplacement de la selection"
        }

        return this.move.haveMoov()
    }

    pointerMove(position: Point) {
        if (this.move) {
            this.move.moveSelection(position)
        }
    }


}
