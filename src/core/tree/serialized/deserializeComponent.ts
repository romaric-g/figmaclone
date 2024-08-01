import { TreeComponent } from "../treeComponent";
import { TreeContainer } from "../treeContainer";
import { TreeRect } from "../treeRect";
import { TreeText } from "../treeText";
import type { SerialisedTreeComponent } from "./serialisedTreeComponent";
import { SerialisedTreeComponentList } from "./serialisedTreeComponentList";
import type { SerialisedTreeContainer } from "./serialisedTreeContainer";
import type { SerialisedTreeRect } from "./serialisedTreeRect";
import type { SerialisedTreeText } from "./serialisedTreeText";

export function deserializeTreeComponentList(serialized: SerialisedTreeComponentList): TreeComponent[] {

    const components: TreeComponent[] = []

    for (const serializedComponent of serialized.components) {
        const component = deserializeTreeComponent(serializedComponent)
        if (component) {
            components.push(component)
        }
    }

    return components;
}


export function deserializeTreeComponent(serialisedTreeComponent: SerialisedTreeComponent) {
    if (isSerializedType<SerialisedTreeContainer>("container", serialisedTreeComponent)) {
        return deserializeTreeContainer(serialisedTreeComponent)
    } else if (isSerializedType<SerialisedTreeRect>("rect", serialisedTreeComponent)) {
        return deserializeTreeRect(serialisedTreeComponent)
    } else if (isSerializedType<SerialisedTreeText>("text", serialisedTreeComponent)) {
        return deserializeTreeText(serialisedTreeComponent)
    } else {
        return undefined;
    }
}

function deserializeTreeContainer(serialisedTreeContainer: SerialisedTreeContainer) {

    const newContainer = new TreeContainer({
        name: serialisedTreeContainer.props.name,
        id: serialisedTreeContainer.props.id
    })

    const newAnchors = serialisedTreeContainer.props.components.map((stc) => {
        const component = deserializeTreeComponent(stc)

        if (!component) {
            return undefined;
        }

        return component.getAnchor();
    }).filter((a) => !!a)

    newContainer.getAnchor().set(newAnchors)

    return newContainer;

}

function deserializeTreeRect(serialisedTreeRect: SerialisedTreeRect) {

    const newRect = new TreeRect({
        name: serialisedTreeRect.props.name,
        id: serialisedTreeRect.props.id,
        x: serialisedTreeRect.props.x,
        y: serialisedTreeRect.props.y,
        width: serialisedTreeRect.props.width,
        height: serialisedTreeRect.props.height,
        fillColor: serialisedTreeRect.props.fillColor,
        borderColor: serialisedTreeRect.props.borderColor,
        borderWidth: serialisedTreeRect.props.borderWidth || 0
    })

    return newRect;
}

function deserializeTreeText(serialisedTreeRect: SerialisedTreeText) {
    const newRect = new TreeText({
        name: serialisedTreeRect.props.name,
        id: serialisedTreeRect.props.id,
        x: serialisedTreeRect.props.x,
        y: serialisedTreeRect.props.y,
        width: serialisedTreeRect.props.width,
        height: serialisedTreeRect.props.height,
        fillColor: serialisedTreeRect.props.fillColor
    })

    return newRect;
}

export function isSerializedType<T extends SerialisedTreeComponent>(type: string, serialized: SerialisedTreeComponent): serialized is T {
    return serialized.type === type
}
