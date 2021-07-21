!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports,require("fabric")):"function"==typeof define&&define.amd?define(["exports","fabric"],e):e((t="undefined"!=typeof globalThis?globalThis:t||self).psbrush={},t.fabric)}(this,(function(t,e){"use strict";var i=function(t,e){return(i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i])})(t,e)};function s(t,e){function s(){this.constructor=t}i(t,e),t.prototype=null===e?Object.create(e):(s.prototype=e.prototype,new s)}
/*!
     * Copyright (c) 2017 Vladimir Agafonkin (rewrite by Jun Kato in TypeScript for PSBrush implementation)
     *
     * Simplify.js, a high-performance JS polyline simplification library
     * https://mourner.github.io/simplify-js/
     * @license BSD-2-Clause
     */var r=function(){function t(){this._tolerance=1,this.sqTolerance=1}return Object.defineProperty(t.prototype,"tolerance",{get:function(){return this._tolerance},set:function(t){"number"!=typeof t&&(t=1),this._tolerance=t,this.sqTolerance=t*t},enumerable:!1,configurable:!0}),t.prototype.getSquareDistance=function(t,e){var i=t.x-e.x,s=t.y-e.y;return i*i+s*s},t.prototype.getSquareSegmentDistance=function(t,e,i){var s=e.x,r=e.y,n=i.x-s,o=i.y-r;if(0!==n||0!==o){var h=((t.x-s)*n+(t.y-r)*o)/(n*n+o*o);h>1?(s=i.x,r=i.y):h>0&&(s+=n*h,r+=o*h)}return(n=t.x-s)*n+(o=t.y-r)*o},t.prototype.simplifyRadialDistance=function(t){for(var e,i=t[0],s=[i],r=1,n=t.length;r<n;r++)e=t[r],this.getSquareDistance(e,i)>this.sqTolerance&&(s.push(e),i=e);return i!==e&&s.push(e),s},t.prototype.simplifyDouglasPeucker=function(t){var e,i,s,r,n=t.length,o=new("undefined"!=typeof Uint8Array?Uint8Array:Array)(n),h=0,a=n-1,u=[],p=[];for(o[h]=o[a]=1;a;){for(i=0,e=h+1;e<a;e++)(s=this.getSquareSegmentDistance(t[e],t[h],t[a]))>i&&(r=e,i=s);i>this.sqTolerance&&(o[r]=1,u.push(h,r,r,a)),a=u.pop(),h=u.pop()}for(e=0;e<n;e++)o[e]&&p.push(t[e]);return p},t.prototype.do=function(t,e){return t=e?t:this.simplifyRadialDistance(t),t=this.simplifyDouglasPeucker(t)},t}(),n=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e.pressureCoeff=100,e}return s(e,t),e.prototype.getSquareDistance=function(t,e){var i=t.x-e.x,s=t.y-e.y,r=t.pressure-e.pressure;return i*i+s*s+r*r*this.pressureCoeff},e.prototype.getSquareSegmentDistance=function(t,e,i){var s=e.x,r=e.y,n=e.pressure,o=i.x-s,h=i.y-r,a=i.pressure-n;if(0!==o||0!==h||0!==a){var u=((t.x-s)*o+(t.y-r)*h+(t.pressure-n)*a*this.pressureCoeff)/(o*o+h*h+a*a*this.pressureCoeff);u>1?(s=i.x,r=i.y,n=i.pressure):u>0&&(s+=o*u,r+=h*u,n+=a*u)}return(o=t.x-s)*o+(h=t.y-r)*h+(a=t.pressure-n)*a*this.pressureCoeff},e}(r);function o(t){return t.touches&&t.touches.length>0?t.touches[0].force:"mouse"===t.pointerType||"number"!=typeof t.pressure?.5:t.pressure}var h=void 0===e.fabric?require("fabric").fabric:e.fabric,a=function(t){function e(e,i,s){var r=t.call(this,e,i)||this;return r.type="PSPoint",r.pressure=s,r}return s(e,t),e.prototype.midPointFrom=function(i){var s=t.prototype.midPointFrom.call(this,i);return new e(s.x,s.y,(this.pressure+i.pressure)/2)},e.prototype.clone=function(){return new e(this.x,this.y,this.pressure)},e}(h.Point);a.fromObject=function(t,e){e&&e(new a(t.x,t.y,t.pressure))},h.PSPoint=a;var u="undefined"==typeof fabric?require("fabric").fabric:fabric,p=u.util.array.min,c=u.util.array.max,l=u.util.object.extend,f=u.util.createClass(u.Object,{type:"PSStroke",strokePoints:null,startTime:null,endTime:null,cacheProperties:u.Object.prototype.cacheProperties.concat("strokePoints","startTime","endTime","fillRule"),stateProperties:u.Object.prototype.stateProperties.concat("strokePoints","startTime","endTime"),initialize:function(t,e){e=e||{},this.callSuper("initialize",e),this.startTime=e.startTime,this.endTime=e.endTime,this.strokePoints=(t||[]).concat(),this._setPositionDimensions(e)},_setPositionDimensions:function(t){var e=this._parseDimensions();this.width=e.width,this.height=e.height,void 0===t.left&&void 0===t.top&&(this.left=e.left,this.top=e.top),this.strokeOffset=this.strokeOffset||{x:e.left+this.width/2,y:e.top+this.height/2}},_renderStroke:function(t){var e,i=this.strokeWidth/1e3,s=this.strokePoints[0],r=this.strokePoints[1],n=s,o=this.strokePoints.length,h=1,u=1,p=o>2,c=-this.strokeOffset.x,l=-this.strokeOffset.y;for(p&&(h=this.strokePoints[2].x<r.x?-1:this.strokePoints[2].x===r.x?0:1,u=this.strokePoints[2].y<r.y?-1:this.strokePoints[2].y===r.y?0:1),2===this.strokePoints.length&&s.x===r.x&&s.y===r.y&&(s=new a(s.x,s.y,s.pressure),r=new a(r.x,r.y,r.pressure),s.x-=i,r.x+=i,n.x=s.x),t.strokeStyle=this.stroke,t.lineCap=this.strokeLineCap,t.lineJoin=this.strokeLineJoin,e=1,o=this.strokePoints.length;e<o;e++)t.beginPath(),t.moveTo(n.x-h*i+c,n.y-u*i+l),t.lineWidth=s.pressure*this.strokeWidth,n=s.midPointFrom(r),t.quadraticCurveTo(s.x-h*i+c,s.y-u*i+l,n.x-h*i+c,n.y-u*i+l),s=this.strokePoints[e],r=this.strokePoints[e+1],t.stroke()},_render:function(t){this._renderStroke(t),this._renderPaintInOrder(t)},toString:function(){return"#<Stroke ("+this.complexity()+'): { "top": '+this.top+', "left": '+this.left+" }>"},toObject:function(t){return l(this.callSuper("toObject",t),{strokePoints:this.strokePoints.map((function(t){return t.clone()})),startTime:this.startTime,endTime:this.endTime,top:this.top,left:this.left})},_toSVG:function(){for(var t=['<g transform="translate(',String(-this.strokeOffset.x),",",String(-this.strokeOffset.y),')" ',"COMMON_PARTS",">\n"],e=null,i=0;i<this.strokePoints.length;i++){var s=this.strokePoints[i];if(e){var r=e.x,n=e.y,o=s.x,h=s.y;t.push("<line ",'x1="',String(r),'" y1="',String(n),'" x2="',String(o),'" y2="',String(h),'" ','stroke-width="',String(e.pressure*this.strokeWidth),'" ','stroke-linecap="round" />\n')}e=s}return t.push("</g>\n"),t},toClipPathSVG:function(t){return"\t"+this._createBaseClipPathSVGMarkup(this._toSVG(),{reviver:t})},toSVG:function(t){return this._createBaseSVGMarkup(this._toSVG(),{reviver:t})},complexity:function(){return this.strokePoints.length},_parseDimensions:function(){function t(){this.bounds=[],this.aX=[],this.aY=[],this.x=0,this.y=0}t.prototype._done=function(){var t=this;this.bounds.forEach((function(e){t.aX.push(e.x),t.aY.push(e.y)})),this.aX.push(this.x),this.aY.push(this.y)},t.prototype.moveTo=function(t,e){this.x=t,this.y=e,this.bounds=[],this._done()},t.prototype.quadraticCurveTo=function(t,e,i,s){this.bounds=u.util.getBoundsOfCurve(this.x,this.y,t,e,t,e,i,s),this.x=i,this.y=s,this._done()},t.prototype.calcBounds=function(){var t=p(this.aX)||0,e=p(this.aY)||0;return{left:t,top:e,width:(c(this.aX)||0)-t,height:(c(this.aY)||0)-e}};var e,i,s=new t,r=this.strokePoints[0],n=this.strokePoints[1],o=r;if(2===this.strokePoints.length&&r.x===n.x&&r.y===n.y){var h=this.strokeWidth/1e3;r=new a(r.x,r.y,r.pressure),n=new a(n.x,n.y,n.pressure),r.x-=h,n.x+=h,o.x=r.x}for(e=1,i=this.strokePoints.length;e<i;e++)s.moveTo(o.x,o.y),s.lineWidth=r.pressure*this.strokeWidth,o=r.midPointFrom(n),s.quadraticCurveTo(r.x,r.y,o.x,o.y),r=this.strokePoints[e],n=this.strokePoints[e+1];return s.calcBounds()}});f.fromObject=function(t,e){u.util.enlivenPatterns([t.fill,t.stroke],(function(i){void 0!==i[0]&&(t.fill=i[0]),void 0!==i[1]&&(t.stroke=i[1]),u.util.enlivenObjects([t.clipPath],(function(i){t.clipPath=i[0],u.util.enlivenObjects(t.strokePoints,(function(i){var s=new f(i,t);e&&e(s)}),null,null)}),null,null)}))},u.PSStroke=f;
/*!
     * Copyright (c) 2020 Arch Inc. (Jun Kato, Kenta Hara)
     *
     * fabricjs-psbrush, a lightweight pressure-sensitive brush implementation for Fabric.js
     * @license MIT
     */
var y="undefined"==typeof fabric?require("fabric").fabric:fabric,d=1e-4,x=.07999999821186066,P=y.util.createClass(y.BaseBrush,{simplify:null,pressureCoeff:100,simplifyTolerance:0,simplifyHighestQuality:!1,pressureIgnoranceOnStart:-1,opacity:1,currentStartTime:null,initialize:function(t){this.simplify=new n,this.canvas=t,this._points=[]},_drawSegment:function(t,e,i){var s=e.midPointFrom(i);return t.lineWidth=e.pressure*this.width,t.quadraticCurveTo(e.x,e.y,s.x,s.y),s},onMouseDown:function(t,e){var i=e?e.pointer:t,s=e?e.e:t.e||null;this._prepareForDrawing(i,s),this._captureDrawingPath(i,s),this._render()},onMouseMove:function(t,e){var i=e?e.pointer:t,s=e?e.e:t.e||null;if(this._captureDrawingPath(i,s)&&this._points.length>1)if(this.needsFullRender)this.canvas.clearContext(this.canvas.contextTop),this._render();else{var r=this._points,n=r.length,o=this.canvas.contextTop;this._saveAndTransform(o),this.oldEnd&&(o.beginPath(),o.moveTo(this.oldEnd.x,this.oldEnd.y)),this.oldEnd=this._drawSegment(o,r[n-2],r[n-1],!0),o.stroke(),o.restore()}},onMouseUp:function(t){this.oldEnd=void 0,this._finalizeAndAddPath()},_prepareForDrawing:function(t,e){var i=o(e),s=new a(t.x,t.y,i===x?d:i);this._reset(),this._addPoint(s),this.canvas.contextTop.moveTo(s.x,s.y),this.currentStartTime=Date.now()},_addPoint:function(t){return!(this._points.length>1&&t.eq(this._points[this._points.length-1]))&&(this._points.push(t),!0)},_reset:function(){this._points.length=0,this._setBrushStyles();var t=new y.Color(this.color);this.needsFullRender=t.getAlpha()<1},_captureDrawingPath:function(t,e){var i=o(e),s=this.pressureIgnoranceOnStart>Date.now()-this.currentStartTime,r=Array.isArray(this._points)&&this._points.length>0,n=r?this._points[this._points.length-1].pressure:d,h=new a(t.x,t.y,s?d:i===x?n:Math.max(d,i));return!this.pressureShouldBeIgnored&&r&&n===d&&h.pressure!==d&&(this._points.forEach((function(t){return t.pressure=Math.max(t.pressure,h.pressure)})),this._redrawSegments(this._points)),this._addPoint(h)},_redrawSegments:function(t){var e=this,i=this.canvas.contextTop;this._saveAndTransform(i),this.oldEnd&&i.closePath();var s=this._points[0];i.moveTo(s.x,s.y),i.beginPath(),this._points.forEach((function(t){e.oldEnd=e._drawSegment(i,s,t,!0),s=t})),i.stroke(),i.restore()},_render:function(){var t,e,i=this.canvas.contextTop,s=this._points[0],r=this._points[1],n=s;if(this._saveAndTransform(i),2===this._points.length&&s.x===r.x&&s.y===r.y){var o=s.pressure*this.width/1e3;s=new a(s.x,s.y,s.pressure),r=new a(r.x,r.y,r.pressure),s.x-=o,r.x+=o,n.x=s.x}var h=i.globalCompositeOperation,u=i.globalAlpha;for(i.globalCompositeOperation="destination-atop",i.globalAlpha=this.opacity,t=1,e=this._points.length;t<e;t++)i.beginPath(),i.moveTo(n.x,n.y),n=this._drawSegment(i,s,r),i.closePath(),i.stroke(),s=this._points[t],r=this._points[t+1];i.restore(),i.globalCompositeOperation=h,i.globalAlpha=u},convertPointsToSVGPath:function(t){var e,i=[],s=this.width/1e3,r=new a(t[0].x,t[0].y,t[0].pressure),n=new a(t[1].x,t[1].y,t[1].pressure),o=r,h=t.length,u=1,p=1,c=h>2;for(c&&(u=t[2].x<n.x?-1:t[2].x===n.x?0:1,p=t[2].y<n.y?-1:t[2].y===n.y?0:1),e=1;e<h;e++)i.push("M ",o.x-u*s," ",o.y-p*s," "),r.eq(n)||(o=r.midPointFrom(n),i.push("Q ",r.x," ",r.y," ",o.x," ",o.y," ")),r=t[e],e+1<t.length&&(n=t[e+1]);return c&&(u=r.x>t[e-2].x?1:r.x===t[e-2].x?0:-1,p=r.y>t[e-2].y?1:r.y===t[e-2].y?0:-1),i.push("L ",r.x+u*s," ",r.y+p*s),i},createPSStroke:function(t){var e=new f(t,{fill:null,stroke:this.color,strokeWidth:this.width,strokeLineCap:this.strokeLineCap,strokeMiterLimit:this.strokeMiterLimit,strokeLineJoin:this.strokeLineJoin,strokeDashArray:this.strokeDashArray}),i=new y.Point(e.left+e.width/2,e.top+e.height/2);return i=e.translateToGivenOrigin(i,"center","center",e.originX,e.originY),e.top=i.y,e.left=i.x,this.shadow&&(this.shadow.affectStroke=!0),e},_finalizeAndAddPath:function(){if(this.canvas.contextTop.closePath(),this.simplifyTolerance>0&&(this.simplify.pressureCoeff=this.pressureCoeff,this.simplify.tolerance=this.simplifyTolerance,this._points=this.simplify.do(this._points,this.simplifyHighestQuality)),"M 0 0 Q 0 0 0 0 L 0 0"!==this.convertPointsToSVGPath(this._points).join("")){var t=this.createPSStroke(this._points);t.opacity=this.opacity,t.startTime=this.currentStartTime,t.endTime=Date.now(),this.canvas.clearContext(this.canvas.contextTop),this.canvas.add(t),t.setCoords(),this.canvas.fire("path:created",{path:t})}else this.canvas.requestRenderAll()}});y.PSBrush=P,t.PSBrush=P,t.PSPoint=a,t.PSStroke=f,t.Simplify=r,t.getPressure=o,t.isPSPoint=function(t){return t&&"PSPoint"===t.type},t.isPSStroke=function(t){return t&&"PSStroke"===t.type},Object.defineProperty(t,"__esModule",{value:!0})}));
