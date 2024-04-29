import { Subject } from 'rxjs';
import { ToolType } from '../core/tools/toolManager';
import { FillStyleInputs, ColorSource } from 'pixi.js';
import { HsvaColor, RgbaColor, RgbColor } from '@uiw/react-color';

export const treeElementSubject = new Subject<TreeData>();
export const currentToolSubject = new Subject<ToolType>();
export const selectionChangeSubject = new Subject<SelectionData>();
export const cursorChangeSubject = new Subject<string>()


export interface TreeData {
    tree: TreeComponentData[]
}

export type TreeComponentData = TreeRectData | TreeContainerData

export interface TreeComponentBaseData<T extends string> {
    type: T,
    index: number,
    name: string
    selected: boolean
}

export type TreeRectData = TreeComponentBaseData<"rect">

export interface TreeContainerData extends TreeComponentBaseData<"container"> {
    children: TreeComponentData[]
}

export interface SelectionData {
    lenght: number
    x: number | "mixed",
    y: number | "mixed",
    width: number | "mixed",
    height: number | "mixed",
    color: HsvaColor | "mixed"
}