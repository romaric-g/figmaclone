import { TreeRect } from "./treeRect"
import { TreeComponent } from "./treeComponent"

export class TreeContainer extends TreeComponent {

    private components: TreeComponent[] = []

    add(element: TreeComponent, index?: number): void {
        console.log("ADD", element, index)
        if (index !== undefined && index >= 0 && index <= this.components.length) {
            this.components.splice(index, 0, element);
        } else {
            this.components.push(element);
        }
        element.setParentContainer(this);
    }

    remove(element: TreeComponent): void {
        console.log("REMOVE", element)
        const index = this.components.indexOf(element);
        if (index !== -1) {
            this.components.splice(index, 1);
            element.deleteParentContainer()

        }
    }
    getComponents(): TreeComponent[] {
        return this.components;
    }

    getAllComponents() {
        const depthComponents: TreeComponent[] = []

        for (const component of this.components) {
            if (component instanceof TreeContainer) {
                depthComponents.push(...component.getAllComponents())
            } else {
                depthComponents.push(component)
            }
        }

        return depthComponents;
    }

    getAllRects() {
        const depthRects: TreeRect[] = []

        for (const component of this.components) {
            if (component instanceof TreeContainer) {
                depthRects.push(...component.getAllRects())
            } else if (component instanceof TreeRect) {
                depthRects.push(component)
            }
        }

        return depthRects;
    }

    getContainer(depthIndex: number[]): TreeContainer | undefined {
        if (depthIndex) {
            const indexElement = this.getComponent(depthIndex)
            if (indexElement instanceof TreeContainer) {
                return indexElement
            }
            return undefined;
        }
        return this;
    }

    getComponent(depthIndex: number[]): TreeComponent | undefined {
        const currentIndex = depthIndex.shift()

        if (currentIndex === undefined) {
            return this;
        }

        const element = this.components[currentIndex]

        if (element instanceof TreeContainer) {
            return element.getComponent(depthIndex)
        }

        if (depthIndex.length > 0) {
            return undefined;
        }

        return element;
    }

    render(nextIndex: number): number {
        for (const component of this.getComponents()) {
            nextIndex = component.render(nextIndex)
        }

        return nextIndex
    }

}