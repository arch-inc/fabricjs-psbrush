const fabricjs: typeof fabric =
  typeof fabric === "undefined" ? require("fabric").fabric : fabric;

import { PSBrushIface } from "./PSBrush";
import PSPoint from "./PSPoint";
import { getPressure, FabricPointerEvent } from "./utils";

export interface PressureManagerIface {
  onMouseDown(ev: FabricPointerEvent): number;
  onMouseMove(ev: FabricPointerEvent, points: PSPoint[]): number;
  onMouseUp(): void;
}

class PressureManager implements PressureManagerIface {
  public min = 0.0001;
  public magic = 0.07999999821186066;
  public fallback = 0.5;
  public constructor(private brush: PSBrushIface) {}

  onMouseDown(ev: FabricPointerEvent) {
    const pressure = getPressure(ev, this.fallback);
    return pressure === this.magic ? this.min : pressure;
  }

  onMouseMove(ev: FabricPointerEvent, points: PSPoint[]) {
    const pressure = getPressure(ev, this.fallback),
      pressureShouldBeIgnored =
        this.brush.pressureIgnoranceOnStart >
        Date.now() - this.brush.currentStartTime,
      hasPreviousPressureValues = Array.isArray(points) && points.length > 0,
      lastPressure = hasPreviousPressureValues
        ? points[points.length - 1].pressure
        : this.min;

    const updatedPressure = pressureShouldBeIgnored
      ? this.min
      : pressure === this.magic
      ? lastPressure
      : Math.max(this.min, pressure);

    if (
      !pressureShouldBeIgnored &&
      hasPreviousPressureValues &&
      lastPressure === this.min &&
      updatedPressure !== this.min
    ) {
      points.forEach(
        (p: PSPoint) => (p.pressure = Math.max(p.pressure, updatedPressure))
      );
      this.brush["_redrawSegments"](points);
    }
    return updatedPressure;
  }
  onMouseUp() {
    // do nothing
  }
}

(fabricjs as any).PressureManager = PressureManager;
export default PressureManager;
