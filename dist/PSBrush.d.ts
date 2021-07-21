import { FabricEvent, FabricPointer } from "./utils";
export interface PSBrushIface extends fabric.BaseBrush {
    pressureCoeff: number;
    simplifyTolerance: number;
    simplifyHighestQuality: boolean;
    pressureIgnoranceOnStart: number;
    opacity: number;
    onMouseDown(pointer: FabricPointer | FabricEvent, ev: FabricEvent): void;
    onMouseMove(pointer: FabricPointer | FabricEvent, ev: FabricEvent): void;
    onMouseUp(ev?: FabricEvent): void;
}
/**
 * PSBrush class
 * @class fabricjs.PSBrush
 * @extends fabricjs.BaseBrush
 */
declare const PSBrush: {
    new (canvas: fabric.StaticCanvas): PSBrushIface;
};
export default PSBrush;
