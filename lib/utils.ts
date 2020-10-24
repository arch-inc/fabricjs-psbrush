import PSPoint from "./PSPoint";
import { PSStrokeIface } from "./PSStroke";

export type FabricPointerEvent = TouchEvent | MouseEvent | PointerEvent;

export interface FabricEvent {
  e: FabricPointerEvent;
  pointer: FabricPointer;
}

export interface FabricPointer {
  x: number;
  y: number;
}

export function isPSStroke(
  object: fabric.Object | fabric.ICollection<any>
): object is PSStrokeIface {
  return object["type"] === "PSStroke";
}

export function isPSPoint(
  object: any
): object is PSPoint {
  return object["type"] === "PSPoint";
}

export function getPressure(ev: FabricPointerEvent) {
  // TouchEvent
  if (ev["touches"] && ev["touches"].length > 0) {
    return (<TouchEvent>ev).touches[0].force;
  }
  // MouseEvent, PointerEvent (ev.pointerType: "mouse")
  if (ev["pointerType"] === "mouse" || typeof ev["pressure"] !== "number") {
    return 0.5;
  }
  // PointerEvent (ev.pointerType: "pen" | "touch")
  return (<PointerEvent>ev).pressure;
}
