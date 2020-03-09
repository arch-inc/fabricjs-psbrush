/// <reference types="fabric" />

import PSSimplify from "./PSSimplify";
import {
  FabricEvent,
  FabricPointer,
  FabricPointerEvent,
  getPressure
} from "./utils";
import PSStroke, { PSStrokeIface } from "./PSStroke";
import PSPoint from "./PSPoint";

/*!
 * Copyright (c) 2020 Arch Inc. (Jun Kato, Kenta Hara)
 * 
 * fabricjs-psbrush, a lightweight pressure-sensitive brush implementation for Fabric.js
 * @license MIT
 */

const minPressure = 0.0001;
const magicPressure = 0.07999999821186066;

export interface PSBrushIface extends fabric.BaseBrush {
  pressureCoeff: number;
  simplifyTolerance: number;
  simplifyHighestQuality: boolean;
  pressureIgnoranceOnStart: number;
  opacity: number;
  onMouseDown(pointer: FabricPointer | FabricEvent, ev: FabricEvent): void;
  onMouseMove(pointer: FabricPointer | FabricEvent, ev: FabricEvent): void;
  onMouseUp(ev?: FabricEvent): void;
}

/**
 * PSBrush class
 * @class fabric.PSBrush
 * @extends fabric.BaseBrush
 */
const PSBrush: new (
  canvas: fabric.StaticCanvas,
  options?: fabric.ICanvasOptions
) => PSBrushIface = <any>fabric.util.createClass(fabric.BaseBrush, {
  simplify: null,
  pressureCoeff: 100,
  simplifyTolerance: 0,
  simplifyHighestQuality: false,
  pressureIgnoranceOnStart: -1,
  opacity: 1,
  currentStartTime: null,

  /**
   * Constructor
   * @param {fabric.Canvas} canvas
   * @return {PSBrush} Instance of a pencil brush
   */
  initialize: function(canvas) {
    this.simplify = new PSSimplify();
    this.canvas = canvas;
    this._points = [];
  },

  /**
   * Invoked inside on mouse down and mouse move
   * @param {Object} pointer
   */
  _drawSegment: function(ctx, p1, p2) {
    var midPoint = p1.midPointFrom(p2);
    ctx.lineWidth = p1.pressure * this.width;
    ctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
    return midPoint;
  },

  /**
   * Inovoked on mouse down
   * @param {Object} pointer
   * @param {Object} ev
   */
  onMouseDown: function(pointer: FabricPointer | FabricEvent, ev: FabricEvent) {
    const p = ev ? ev.pointer : pointer;
    const e = ev ? ev.e : pointer["e"] || null;

    this._prepareForDrawing(p, e);
    // capture coordinates immediately
    // this allows to draw dots (when movement never occurs)
    this._captureDrawingPath(p, e);
    this._render();
  },

  /**
   * Inovoked on mouse move
   * @param {Object} pointer
   * @param {Object} ev
   */
  onMouseMove: function(pointer: FabricPointer | FabricEvent, ev: FabricEvent) {
    const p = ev ? ev.pointer : pointer;
    const e = ev ? ev.e : pointer["e"] || null;

    if (this._captureDrawingPath(p, e) && this._points.length > 1) {
      if (this.needsFullRender) {
        // redraw curve
        // clear top canvas
        this.canvas.clearContext(this.canvas.contextTop);
        this._render();
      } else {
        const points = this._points,
          length = points.length,
          ctx = this.canvas.contextTop;

        // draw the curve update
        this._saveAndTransform(ctx);
        if (this.oldEnd) {
          ctx.beginPath();
          ctx.moveTo(this.oldEnd.x, this.oldEnd.y);
        }
        this.oldEnd = this._drawSegment(
          ctx,
          points[length - 2],
          points[length - 1],
          true
        );
        ctx.stroke();
        ctx.restore();
      }
    }
  },

  /**
   * Invoked on mouse up
   * @param {Object} ev
   */
  onMouseUp: function(ev?: FabricEvent) {
    this.oldEnd = undefined;
    this._finalizeAndAddPath();
  },

  /**
   * @private
   * @param {Object} pointer Actual mouse position related to the canvas.
   * @param {Object} ev
   */
  _prepareForDrawing: function(pointer: FabricPointer, ev: FabricPointerEvent) {
    const pressure = getPressure(ev);
    const p = new PSPoint(
      pointer.x,
      pointer.y,
      pressure === magicPressure ? minPressure : pressure
    );

    this._reset();
    this._addPoint(p);
    this.canvas.contextTop.moveTo(p.x, p.y);

    this.currentStartTime = Date.now();
  },

  /**
   * @private
   * @param {fabric.Point} point Point to be added to points array
   */
  _addPoint: function(point) {
    if (
      this._points.length > 1 &&
      point.eq(this._points[this._points.length - 1])
    ) {
      return false;
    }
    this._points.push(point);
    return true;
  },

  /**
   * Clear points array and set contextTop canvas style.
   * @private
   */
  _reset: function() {
    this._points.length = 0;
    this._setBrushStyles();
    var color = new fabric.Color(this.color);
    this.needsFullRender = color.getAlpha() < 1;
    this._setShadow();
  },

  /**
   * @private
   * @param {Object} pointer Actual mouse position related to the canvas.
   * @param {Object} ev
   */
  _captureDrawingPath: function(
    pointer: FabricPointer,
    ev: FabricPointerEvent
  ) {
    const pressure = getPressure(ev),
      pressureShouldBeIgnored =
        this.pressureIgnoranceOnStart > Date.now() - this.currentStartTime,
      hasPreviousPressureValues =
        Array.isArray(this._points) && this._points.length > 0,
      lastPressure = hasPreviousPressureValues
        ? this._points[this._points.length - 1].pressure
        : minPressure,
      pointerPoint = new PSPoint(
        pointer.x,
        pointer.y,
        pressureShouldBeIgnored
          ? minPressure
          : pressure === magicPressure
          ? lastPressure
          : Math.max(minPressure, pressure)
      );
    if (
      !this.pressureShouldBeIgnored &&
      hasPreviousPressureValues &&
      lastPressure === minPressure &&
      pointerPoint.pressure !== minPressure
    ) {
      this._points.forEach(
        (p: PSPoint) =>
          (p.pressure = Math.max(p.pressure, pointerPoint.pressure))
      );
      this._redrawSegments(this._points);
    }
    return this._addPoint(pointerPoint);
  },

  _redrawSegments: function(points) {
    const ctx = this.canvas.contextTop;
    this._saveAndTransform(ctx);
    if (this.oldEnd) {
      ctx.closePath();
    }
    let p = this._points[0];
    ctx.moveTo(p.x, p.y);
    ctx.beginPath();
    this._points.forEach(p2 => {
      this.oldEnd = this._drawSegment(ctx, p, p2, true);
      p = p2;
    });
    ctx.stroke();
    ctx.restore();
  },

  /**
   * Draw a smooth path on the topCanvas using quadraticCurveTo
   * @private
   */
  _render: function() {
    var ctx = this.canvas.contextTop,
      i,
      len,
      p1 = this._points[0],
      p2 = this._points[1],
      mid = p1;

    this._saveAndTransform(ctx);

    //if we only have 2 points in the path and they are the same
    //it means that the user only clicked the canvas without moving the mouse
    //then we should be drawing a dot. A path isn't drawn between two identical dots
    //that's why we set them apart a bit
    if (this._points.length === 2 && p1.x === p2.x && p1.y === p2.y) {
      var width = (p1.pressure * this.width) / 1000;
      p1 = new PSPoint(p1.x, p1.y, p1.pressure);
      p2 = new PSPoint(p2.x, p2.y, p2.pressure);
      p1.x -= width;
      p2.x += width;
      mid.x = p1.x;
    }

    const compositeOperation = ctx.globalCompositeOperation;
    const alpha = ctx.globalAlpha;
    ctx.globalCompositeOperation = "destination-atop";
    ctx.globalAlpha = this.opacity;
    for (i = 1, len = this._points.length; i < len; i++) {
      ctx.beginPath();
      ctx.moveTo(mid.x, mid.y);
      // we pick the point between pi + 1 & pi + 2 as the
      // end point and p1 as our control point.
      mid = this._drawSegment(ctx, p1, p2);
      ctx.closePath();
      ctx.stroke();
      p1 = this._points[i];
      p2 = this._points[i + 1];
    }
    ctx.restore();
    ctx.globalCompositeOperation = compositeOperation;
    ctx.globalAlpha = alpha;
  },

  /**
   * Converts points to SVG path
   * @param {Array} points Array of points
   * @return {String} SVG path
   */
  convertPointsToSVGPath: function(points: PSPoint[]) {
    var path = [],
      i,
      width = this.width / 1000,
      p1 = new PSPoint(points[0].x, points[0].y, points[0].pressure),
      p2 = new PSPoint(points[1].x, points[1].y, points[1].pressure),
      mid = p1,
      len = points.length,
      multSignX = 1,
      multSignY = 1,
      manyPoints = len > 2;

    if (manyPoints) {
      multSignX = points[2].x < p2.x ? -1 : points[2].x === p2.x ? 0 : 1;
      multSignY = points[2].y < p2.y ? -1 : points[2].y === p2.y ? 0 : 1;
    }
    for (i = 1; i < len; i++) {
      path.push(
        "M ",
        mid.x - multSignX * width,
        " ",
        mid.y - multSignY * width,
        " "
      );
      if (!p1.eq(p2)) {
        mid = p1.midPointFrom(p2);
        // p1 is our bezier control point
        // midpoint is our endpoint
        // start point is p(i-1) value.
        path.push("Q ", p1.x, " ", p1.y, " ", mid.x, " ", mid.y, " ");
      }
      p1 = points[i];
      if (i + 1 < points.length) {
        p2 = points[i + 1];
      }
    }
    if (manyPoints) {
      multSignX =
        p1.x > points[i - 2].x ? 1 : p1.x === points[i - 2].x ? 0 : -1;
      multSignY =
        p1.y > points[i - 2].y ? 1 : p1.y === points[i - 2].y ? 0 : -1;
    }
    path.push("L ", p1.x + multSignX * width, " ", p1.y + multSignY * width);
    return path;
  },

  /**
   * Creates PSStroke object to add on canvas
   * @param {Array<PSPoint>} points Path data
   * @return {PSStroke} Path to add on canvas
   */
  createPSStroke: function(points: PSPoint[]) {
    // debug statement:
    // console.log(`raw path data (${typeof points}):`, points);
    // console.log(`path data (${typeof pathData}):`, pathData);
    // console.log(`parsed path data (${typeof pArray}):`, pArray);

    var path = new PSStroke(points, {
      fill: null,
      stroke: this.color,
      strokeWidth: this.width,
      strokeLineCap: this.strokeLineCap,
      strokeMiterLimit: this.strokeMiterLimit,
      strokeLineJoin: this.strokeLineJoin,
      strokeDashArray: this.strokeDashArray
    });

    var position = new fabric.Point(
      path.left + path.width / 2,
      path.top + path.height / 2
    );
    position = path.translateToGivenOrigin(
      position,
      "center",
      "center",
      path.originX,
      path.originY
    );
    path.top = position.y;
    path.left = position.x;
    if (this.shadow) {
      this.shadow.affectStroke = true;
      path.setShadow(this.shadow);
    }

    return path;
  },

  /**
   * On mouseup after drawing the path on contextTop canvas
   * we use the points captured to create an new fabric path object
   * and add it to the fabric canvas.
   */
  _finalizeAndAddPath: function() {
    var ctx = this.canvas.contextTop;
    ctx.closePath();

    // debug statement:
    // console.log("raw path data:", this._points, simplify);

    // simplify the path
    if (this.simplifyTolerance > 0) {
      this.simplify.pressureCoeff = this.pressureCoeff;
      this.simplify.tolerance = this.simplifyTolerance;
      this._points = (<PSSimplify>this.simplify).do(
        this._points,
        this.simplifyHighestQuality
      );
    }

    var pathData = this.convertPointsToSVGPath(this._points).join("");
    if (pathData === "M 0 0 Q 0 0 0 0 L 0 0") {
      // do not create 0 width/height paths, as they are
      // rendered inconsistently across browsers
      // Firefox 4, for example, renders a dot,
      // whereas Chrome 10 renders nothing
      this.canvas.requestRenderAll();
      return;
    }

    const path = this.createPSStroke(this._points) as PSStrokeIface;
    path.opacity = this.opacity;
    path["startTime"] = this.currentStartTime;
    path["endTime"] = Date.now();
    this.canvas.clearContext(this.canvas.contextTop);
    this.canvas.add(path);
    // this.canvas.renderAll();
    path.setCoords();
    this._resetShadow();
    // this.canvas.clearContext(this.canvas.contextTop);

    // fire event 'path' created
    this.canvas.fire("path:created", { path });
  }
});

export default PSBrush;
