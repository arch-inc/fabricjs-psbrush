/// <reference types="fabric" />
const fabricjs: typeof fabric =
  typeof fabric === "undefined" ? require("fabric").fabric : fabric;

class PSPoint extends fabricjs.Point {
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
PSPoint["fromObject"] = function(
  object: { x: number; y: number; pressure: number },
  callback: (point: PSPoint) => void
) {
  callback && callback(new PSPoint(object.x, object.y, object.pressure));
};

fabricjs["PSPoint"] = PSPoint;
export default PSPoint;
