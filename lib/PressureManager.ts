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

const minPressure = 0.0001;
const magicPressure = 0.07999999821186066;

class PressureManager implements PressureManagerIface {
  public constructor(private brush: PSBrushIface) {}

  onMouseDown(ev: FabricPointerEvent) {
    const pressure = getPressure(ev);
    return pressure === magicPressure ? minPressure : pressure;
  }

  onMouseMove(ev: FabricPointerEvent, points: PSPoint[]) {
    const pressure = getPressure(ev),
      pressureShouldBeIgnored =
        this.brush.pressureIgnoranceOnStart >
        Date.now() - this.brush.currentStartTime,
      hasPreviousPressureValues = Array.isArray(points) && points.length > 0,
      lastPressure = hasPreviousPressureValues
        ? points[points.length - 1].pressure
        : minPressure;

    const updatedPressure = pressureShouldBeIgnored
      ? minPressure
      : pressure === magicPressure
      ? lastPressure
      : Math.max(minPressure, pressure);

    if (
      !pressureShouldBeIgnored &&
      hasPreviousPressureValues &&
      lastPressure === minPressure &&
      updatedPressure !== minPressure
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
