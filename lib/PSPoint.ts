/// <reference types="fabric" />

class PSPoint extends fabric.Point {
  type = "PSPoint";
  pressure: number;
  constructor(x: number, y: number, pressure: number) {
    super(x, y);
    this.pressure = pressure;
  }
  midPointFrom(p: PSPoint) {
    const mid = super.midPointFrom(p);
    return new PSPoint(mid.x, mid.y, (this.pressure + p.pressure) / 2);
  }
  clone() {
    return new PSPoint(this.x, this.y, this.pressure);
  }
}
PSPoint["fromObject"] = function(object: { x: number, y: number, pressure: number }, callback: (point: PSPoint) => void) {
  callback && callback(new PSPoint(object.x, object.y, object.pressure))
};

(fabric as any).PSPoint = PSPoint;
export default PSPoint;
