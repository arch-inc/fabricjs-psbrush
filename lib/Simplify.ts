/// <reference types="fabric" />

/*!
 * Copyright (c) 2017 Vladimir Agafonkin (rewrite by Jun Kato in TypeScript for PSBrush implementation)
 * 
 * Simplify.js, a high-performance JS polyline simplification library
 * https://mourner.github.io/simplify-js/
 * @license BSD-2-Clause
 */

class Simplify<P extends fabric.Point> {
  public set tolerance(tolerance: number) {
    if (typeof tolerance !== "number") {
      tolerance = 1;
    }
    this._tolerance = tolerance;
    this.sqTolerance = tolerance * tolerance;
  }
  public get tolerance() {
    return this._tolerance;
  }
  private _tolerance: number = 1;
  private sqTolerance: number = 1;

  // square distance between 2 points
  public getSquareDistance(p1: P, p2: P) {
    let dx = p1.x - p2.x,
      dy = p1.y - p2.y;
    return dx * dx + dy * dy;
  }

  // square distance from a point to a segment
  public getSquareSegmentDistance(p: P, p1: P, p2: P) {
    let x = p1.x,
      y = p1.y,
      dx = p2.x - x,
      dy = p2.y - y;

    if (dx !== 0 || dy !== 0) {
      let t = ((p.x - x) * dx + (p.y - y) * dy) / (dx * dx + dy * dy);

      if (t > 1) {
        x = p2.x;
        y = p2.y;
      } else if (t > 0) {
        x += dx * t;
        y += dy * t;
      }
    }

    dx = p.x - x;
    dy = p.y - y;

    return dx * dx + dy * dy;
  }
  // the rest of the code doesn't care for the point format

  // basic distance-based simplification
  public simplifyRadialDistance(points: P[]) {
    let prevPoint = points[0],
      newPoints = [prevPoint],
      point: P;

    for (let i = 1, len = points.length; i < len; i++) {
      point = points[i];

      if (this.getSquareDistance(point, prevPoint) > this.sqTolerance) {
        newPoints.push(point);
        prevPoint = point;
      }
    }

    if (prevPoint !== point) {
      newPoints.push(point);
    }

    return newPoints;
  }

  // simplification using optimized Douglas-Peucker algorithm with recursion elimination
  public simplifyDouglasPeucker(points: P[]) {
    let len = points.length,
      MarkerArray = typeof Uint8Array !== "undefined" ? Uint8Array : Array,
      markers = new MarkerArray(len),
      first = 0,
      last = len - 1,
      stack = [],
      newPoints = [],
      i: number,
      maxSqDist: number,
      sqDist: number,
      index: number;

    markers[first] = markers[last] = 1;

    while (last) {
      maxSqDist = 0;

      for (i = first + 1; i < last; i++) {
        sqDist = this.getSquareSegmentDistance(
          points[i],
          points[first],
          points[last]
        );

        if (sqDist > maxSqDist) {
          index = i;
          maxSqDist = sqDist;
        }
      }

      if (maxSqDist > this.sqTolerance) {
        markers[index] = 1;
        stack.push(first, index, index, last);
      }

      last = stack.pop();
      first = stack.pop();
    }

    for (i = 0; i < len; i++) {
      if (markers[i]) {
        newPoints.push(points[i]);
      }
    }

    return newPoints;
  }

  // both algorithms combined for awesome performance
  public do(points: P[], highestQuality: boolean) {
    points = highestQuality ? points : this.simplifyRadialDistance(points);
    points = this.simplifyDouglasPeucker(points);
    return points;
  }
}

export default Simplify;
