import { Subject } from 'rxjs';
import { TreeElementData } from './tree/treeElement';
import { ToolType } from '../core/tools/toolManager';
import { FillStyleInputs, ColorSource } from 'pixi.js';

export const treeElementSubject = new Subject<TreeElementData[]>();
export const currentToolSubject = new Subject<ToolType>();
export const selectionChangeSubject = new Subject<SelectionData>();
export const cursorChangeSubject = new Subject<string>()

export interface SelectionData {
    lenght: number
    x: number | "mixed",
    y: number | "mixed",
    width: number | "mixed",
    height: number | "mixed",
    color: FillStyleInputs | "mixed"
}