import Simplify from "./Simplify";
import PSPoint from "./PSPoint";
declare class PSSimplify extends Simplify<PSPoint> {
    pressureCoeff: number;
    getSquareDistance(p1: PSPoint, p2: PSPoint): number;
    getSquareSegmentDistance(p: PSPoint, p1: PSPoint, p2: PSPoint): number;
}
export default PSSimplify;
