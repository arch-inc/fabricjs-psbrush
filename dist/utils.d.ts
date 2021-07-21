import PSPoint from "./PSPoint";
import { PSStrokeIface } from "./PSStroke";
export declare type FabricPointerEvent = TouchEvent | MouseEvent | PointerEvent;
export interface FabricEvent {
    e: FabricPointerEvent;
    pointer: FabricPointer;
}
export interface FabricPointer {
    x: number;
    y: number;
}
export declare function isPSStroke(object: fabric.Object | fabric.ICollection<any>): object is PSStrokeIface;
export declare function isPSPoint(object: any): object is PSPoint;
export declare function getPressure(ev: FabricPointerEvent): number;
