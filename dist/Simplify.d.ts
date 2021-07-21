/*!
 * Copyright (c) 2017 Vladimir Agafonkin (rewrite by Jun Kato in TypeScript for PSBrush implementation)
 *
 * Simplify.js, a high-performance JS polyline simplification library
 * https://mourner.github.io/simplify-js/
 * @license BSD-2-Clause
 */
declare class Simplify<P extends fabric.Point> {
    set tolerance(tolerance: number);
    get tolerance(): number;
    private _tolerance;
    private sqTolerance;
    getSquareDistance(p1: P, p2: P): number;
    getSquareSegmentDistance(p: P, p1: P, p2: P): number;
    simplifyRadialDistance(points: P[]): P[];
    simplifyDouglasPeucker(points: P[]): any[];
    do(points: P[], highestQuality: boolean): P[];
}
export default Simplify;
