import { Element } from "./element";
import { Selection } from "./selections/selection";


export class Selector {
    private _selection: Selection;
    private _elements: Element[] = []

    constructor() {
        this._selection = new Selection([])
    }

    private registerElement(element: Element) {
        this._elements.push(element)

        return element;
    }

    setSelection(selection: Selection) {
        if (this._selection.isSameSelection(selection)) {
            console.log(this._selection, selection)
            console.log("not apply")
            return;
        }

        console.log("CHANGE SELECTION", selection)

        this._selection.destroy()
        this._selection = selection;
        this._selection.init()
        this._selection.emitChangeEvent()
    }

    getSelection() {
        return this._selection;
    }

    getRegistredElement(element: Element) {
        const selectionElement = this._elements.find(el => el === element);

        if (!selectionElement) {
            return this.registerElement(element)
        }

        return selectionElement;
    }

    unselectAll() {
        this.setSelection(new Selection([]))
    }

    clearCache() {
        const keededSelectionElement = []

        for (const selectionElement of this._elements) {
            if (selectionElement.isSelected()) {
                keededSelectionElement.push(selectionElement)
            }
        }

        this._elements = keededSelectionElement;
    }
}
