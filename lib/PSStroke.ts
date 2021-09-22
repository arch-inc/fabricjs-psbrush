/// <reference types="fabric" />
const fabricjs: typeof fabric =
  typeof fabric === "undefined" ? require("fabric").fabric : fabric;

import PSPoint from "./PSPoint";

export interface PSStrokeIface extends fabric.Object {
  type: "PSStroke";
  startTime?: number;
  endTime?: number;
  strokePoints: PSPoint[];
}

const min = fabricjs.util.array.min as (
    arr: any[],
    byProperty?: string
  ) => number,
  max = fabricjs.util.array.max as (arr: any[], byProperty?: string) => number,
  extend = fabricjs.util.object.extend;

const PSStrokeImpl = <any>fabricjs.util.createClass(
  fabricjs.Object,
  /** @lends PSStroke.prototype */ {
    /**
     * Type of an object
     * @type String
     * @default
     */
    type: "PSStroke",

    /**
     * Array of stroke points
     * @type Array
     * @default
     */
    strokePoints: null,

    /**
     * Time when this stroke started to be drawn
     * @type number
     */
    startTime: null,

    /**
     * Time when this stroke finished to be drawn
     * @type number
     */
    endTime: null,

    cacheProperties: fabricjs.Object.prototype.cacheProperties.concat(
      "strokePoints",
      "startTime",
      "endTime",
      "fillRule"
    ),

    stateProperties: fabricjs.Object.prototype.stateProperties.concat(
      "strokePoints",
      "startTime",
      "endTime"
    ),

    /**
     * Constructor
     * @param {Array<PSPoint>} stroke Stroke data (sequence of coordinates and corresponding "command" tokens)
     * @param {Object} [options] Options object
     * @return {Stroke} thisArg
     */
    initialize: function(strokePoints: PSPoint[], options: any): void {
      options = options || {};
      this.callSuper("initialize", options);

      this.startTime = options.startTime;
      this.endTime = options.endTime;
      this.strokePoints = (strokePoints || []).concat();
      this._setPositionDimensions(options);
    },

    /**
     * @private
     * @param {Object} options Options object
     */
    _setPositionDimensions: function(options: any): void {
      var calcDim = this._parseDimensions();
      this.width = calcDim.width;
      this.height = calcDim.height;

      // respect positon in `options` for grouped stroke
      if (
        typeof options.left == "undefined" &&
        typeof options.top == "undefined"
      ) {
        this.left = calcDim.left;
        this.top = calcDim.top;
      }
      this.strokeOffset = this.strokeOffset || {
        x: calcDim.left + this.width / 2,
        y: calcDim.top + this.height / 2
      };
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx context to render stroke on
     */
    _renderStroke: function(ctx: CanvasRenderingContext2D): void {
      let i: number,
        strokeWidth = this.strokeWidth / 1000,
        p1 = this.strokePoints[0],
        p2 = this.strokePoints[1],
        mid = p1,
        len = this.strokePoints.length,
        multSignX = 1,
        multSignY = 1,
        manyPoints = len > 2,
        l: number = -this.strokeOffset.x,
        t: number = -this.strokeOffset.y;

      if (manyPoints) {
        multSignX =
          this.strokePoints[2].x < p2.x
            ? -1
            : this.strokePoints[2].x === p2.x
            ? 0
            : 1;
        multSignY =
          this.strokePoints[2].y < p2.y
            ? -1
            : this.strokePoints[2].y === p2.y
            ? 0
            : 1;
      }

      // const v = this.canvas.viewportTransform;
      // ctx.save();
      // ctx.transform(v[0], v[1], v[2], v[3], v[4], v[5]);

      //if we only have 2 points in the stroke and they are the same
      //it means that the user only clicked the canvas without moving the mouse
      //then we should be drawing a dot. A stroke isn't drawn between two identical dots
      //that's why we set them apart a bit
      if (this.strokePoints.length === 2 && p1.x === p2.x && p1.y === p2.y) {
        p1 = new PSPoint(p1.x, p1.y, p1.pressure);
        p2 = new PSPoint(p2.x, p2.y, p2.pressure);
        p1.x -= strokeWidth;
        p2.x += strokeWidth;
        mid.x = p1.x;
      }

      ctx.strokeStyle = this.stroke;
      ctx.lineCap = this.strokeLineCap;
      ctx.lineJoin = this.strokeLineJoin;

      for (i = 1, len = this.strokePoints.length; i < len; i++) {
        ctx.beginPath();
        ctx.moveTo(
          mid.x - multSignX * strokeWidth + l,
          mid.y - multSignY * strokeWidth + t
        );
        ctx.lineWidth = p1.pressure * this.strokeWidth;
        // we pick the point between pi + 1 & pi + 2 as the
        // end point and p1 as our control point.
        mid = p1.midPointFrom(p2);
        ctx.quadraticCurveTo(
          p1.x - multSignX * strokeWidth + l,
          p1.y - multSignY * strokeWidth + t,
          mid.x - multSignX * strokeWidth + l,
          mid.y - multSignY * strokeWidth + t
        );
        p1 = this.strokePoints[i];
        p2 = this.strokePoints[i + 1];

        ctx.stroke();
      }

      // ctx.restore();
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx context to render stroke on
     */
    _render: function(ctx: CanvasRenderingContext2D): void {
      this._renderStroke(ctx);
      this._renderPaintInOrder(ctx);
    },

    /**
     * Returns string representation of an instance
     * @return {String} string representation of an instance
     */
    toString: function(): string {
      return (
        "#<Stroke (" +
        this.complexity() +
        '): { "top": ' +
        this.top +
        ', "left": ' +
        this.left +
        " }>"
      );
    },

    /**
     * Returns object representation of an instance
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} object representation of an instance
     */
    toObject: function(propertiesToInclude: string[]): object {
      var o = extend(this.callSuper("toObject", propertiesToInclude), {
        strokePoints: (this.strokePoints as PSPoint[]).map(i => i.clone()),
        startTime: this.startTime,
        endTime: this.endTime,
        top: this.top,
        left: this.left
      });
      return o;
    },

    /* _TO_SVG_START_ */
    /**
     * Returns svg representation of an instance
     * @return {Array} an array of strings with the specific svg representation
     * of the instance
     */
    _toSVG: function(): string[] {
      const svgString: string[] = [
        '<g transform="translate(',
        String(-this.strokeOffset.x),
        ",",
        String(-this.strokeOffset.y),
        ')" ',
        "COMMON_PARTS",
        ">\n"
      ];
      let p1: PSPoint = null;
      for (let i = 0; i < this.strokePoints.length; i++) {
        let p2: PSPoint = this.strokePoints[i];
        if (p1) {
          // const xMult = p1.x <= p2.x ? -1 : 1,
          //   yMult = p1.y <= p2.y ? -1 : 1,
          //   w = Math.abs(p1.x - p2.x),
          //   h = Math.abs(p1.y - p2.y),
          //   x1 = (xMult * w * 0.5),
          //   y1 = (yMult * h * 0.5),
          //   x2 = (xMult * w * -0.5),
          //   y2 = (yMult * h * -0.5);
          const x1 = p1.x,
            y1 = p1.y,
            x2 = p2.x,
            y2 = p2.y;
          svgString.push(
            "<line ",
            'x1="',
            String(x1),
            '" y1="',
            String(y1),
            '" x2="',
            String(x2),
            '" y2="',
            String(y2),
            '" ',
            'stroke-width="',
            String(p1.pressure * this.strokeWidth),
            '" ',
            'stroke-linecap="round" />\n'
          );
        }
        p1 = p2;
      }
      svgString.push("</g>\n");
      return svgString;
    },

    /**
     * Returns svg clipPath representation of an instance
     * @param {Function} [reviver] Method for further parsing of svg representation.
     * @return {String} svg representation of an instance
     */
    toClipPathSVG: function(reviver: Function): string {
      return (
        "\t" +
        this._createBaseClipPathSVGMarkup(this._toSVG(), {
          reviver: reviver
        })
      );
    },

    /**
     * Returns svg representation of an instance
     * @param {Function} [reviver] Method for further parsing of svg representation.
     * @return {String} svg representation of an instance
     */
    toSVG: function(reviver: Function): string {
      return this._createBaseSVGMarkup(this._toSVG(), {
        reviver: reviver
      });
    },
    /* _TO_SVG_END_ */

    /**
     * Returns number representation of an instance complexity
     * @return {Number} complexity of this instance
     */
    complexity: function(): number {
      return this.strokePoints.length;
    },

    /**
     * Calculate 'bounding box' of storke.
     * @private
     */
    _parseDimensions: function() {
      function DummyCtx() {
        this.bounds = [];
        this.aX = [];
        this.aY = [];
        this.x = 0;
        this.y = 0;
      }
      DummyCtx.prototype._done = function() {
        this.bounds.forEach(point => {
          this.aX.push(point.x);
          this.aY.push(point.y);
        });
        this.aX.push(this.x);
        this.aY.push(this.y);
      };
      DummyCtx.prototype.moveTo = function(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.bounds = [];
        this._done();
      };
      DummyCtx.prototype.quadraticCurveTo = function(
        ctlX: number,
        ctlY: number,
        x: number,
        y: number
      ) {
        this.bounds = fabricjs.util.getBoundsOfCurve(
          this.x,
          this.y,
          ctlX,
          ctlY,
          ctlX,
          ctlY,
          x,
          y
        );
        this.x = x;
        this.y = y;
        this._done();
      };
      DummyCtx.prototype.calcBounds = function(): {
        left: Number;
        top: Number;
        width: Number;
        height: Number;
      } {
        var minX = min(this.aX) || 0,
          minY = min(this.aY) || 0,
          maxX = max(this.aX) || 0,
          maxY = max(this.aY) || 0,
          deltaX = maxX - minX,
          deltaY = maxY - minY;

        return {
          left: minX,
          top: minY,
          width: deltaX,
          height: deltaY
        };
      };

      // belows are almost same function with _renderStorke, but some calling functions are ignored, and DummyCtx is used instead of normal Canvas context
      var ctx = new DummyCtx(),
        i,
        len,
        p1 = this.strokePoints[0],
        p2 = this.strokePoints[1],
        mid = p1;

      //if we only have 2 points in the stroke and they are the same
      //it means that the user only clicked the canvas without moving the mouse
      //then we should be drawing a dot. A stroke isn't drawn between two identical dots
      //that's why we set them apart a bit
      if (this.strokePoints.length === 2 && p1.x === p2.x && p1.y === p2.y) {
        var strokeWidth = this.strokeWidth / 1000;
        p1 = new PSPoint(p1.x, p1.y, p1.pressure);
        p2 = new PSPoint(p2.x, p2.y, p2.pressure);
        p1.x -= strokeWidth;
        p2.x += strokeWidth;
        mid.x = p1.x;
      }

      for (i = 1, len = this.strokePoints.length; i < len; i++) {
        // ctx.beginPath();
        ctx.moveTo(mid.x, mid.y);
        ctx.lineWidth = p1.pressure * this.strokeWidth;
        // we pick the point between pi + 1 & pi + 2 as the
        // end point and p1 as our control point.
        mid = p1.midPointFrom(p2);
        ctx.quadraticCurveTo(p1.x, p1.y, mid.x, mid.y);

        // ctx.closePath();
        // ctx.stroke();
        p1 = this.strokePoints[i];
        p2 = this.strokePoints[i + 1];
      }

      return ctx.calcBounds();
    }
  }
);

/**
 * Pressure-sensitive stroke class
 * @class PSStroke
 * @extends fabricjs.Object
 */
const PSStroke: {
  new (path: PSPoint[], options: any): PSStrokeIface;
  fromObject: (object: any, callback: Function) => void;
} = PSStrokeImpl;

/**
 * Creates an instance of PSStroke from an object
 * @static
 * @memberOf PSStroke
 * @param {Object} object
 * @param {Function} [callback] Callback to invoke when an Stroke instance is created
 */
PSStroke.fromObject = function(object: any, callback: Function): void {
  // code from https://github.com/fabricjs/fabricjs.js/blob/f3317569ffbe9e34477bd7579213fac8376bdc12/src/shapes/object.class.js#L1925-L1941
  // cloning object inside fabricjs.Object._fromObject loses method of PSPoint, it causes errors at initializing PSStroke.
  (<any>fabricjs.util).enlivenPatterns([object.fill, object.stroke], function(
    patterns: any
  ) {
    if (typeof patterns[0] !== "undefined") {
      object.fill = patterns[0];
    }
    if (typeof patterns[1] !== "undefined") {
      object.stroke = patterns[1];
    }
    fabricjs.util.enlivenObjects(
      [object.clipPath],
      function(enlivedProps: any) {
        object.clipPath = enlivedProps[0];
        fabricjs.util.enlivenObjects(
          object["strokePoints"],
          function(enlivendStrokePoints: PSPoint[]) {
            var instance = new PSStroke(enlivendStrokePoints, object);
            callback && callback(instance);
          },
          null,
          null
        );
      },
      null,
      null
    );
  });
};

(fabricjs as any).PSStroke = PSStroke;
export default PSStroke;
