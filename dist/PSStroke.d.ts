import PSPoint from "./PSPoint";
export interface PSStrokeIface extends fabric.Object {
    type: "PSStroke";
    strokePoints: PSPoint[];
}
/**
 * Pressure-sensitive stroke class
 * @class PSStroke
 * @extends fabricjs.Object
 */
declare const PSStroke: {
    new (paths: PSPoint[], options: any): PSStrokeIface;
    fromObject: (object: any, callback: Function) => void;
};
export default PSStroke;
