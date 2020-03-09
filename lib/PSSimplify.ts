import Simplify from "./Simplify";
import PSPoint from "./PSPoint";

class PSSimplify extends Simplify<PSPoint> {
  public pressureCoeff: number = 100;

  // square distance between 2 points
  public getSquareDistance(p1: PSPoint, p2: PSPoint) {
    var dx = p1.x - p2.x,
      dy = p1.y - p2.y,
      dz = p1.pressure - p2.pressure;

    return dx * dx + dy * dy + dz * dz * this.pressureCoeff;
  }

  // square distance from a point to a segment
  public getSquareSegmentDistance(p: PSPoint, p1: PSPoint, p2: PSPoint) {
    var x = p1.x,
      y = p1.y,
      z = p1.pressure,
      dx = p2.x - x,
      dy = p2.y - y,
      dz = p2.pressure - z;

    if (dx !== 0 || dy !== 0 || dz !== 0) {
      var t =
        ((p.x - x) * dx +
          (p.y - y) * dy +
          (p.pressure - z) * dz * this.pressureCoeff) /
        (dx * dx + dy * dy + dz * dz * this.pressureCoeff);

      if (t > 1) {
        x = p2.x;
        y = p2.y;
        z = p2.pressure;
      } else if (t > 0) {
        x += dx * t;
        y += dy * t;
        z += dz * t;
      }
    }

    dx = p.x - x;
    dy = p.y - y;
    dz = p.pressure - z;

    return dx * dx + dy * dy + dz * dz * this.pressureCoeff;
  }
}

export default PSSimplify;
