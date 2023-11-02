/*!
  * wia core v1.0.10
  * (c) 2015-2023 Sibyl Yu and contributors
  * Released under the MIT License.
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["@wiajs/core"] = {}));
})(this, (function (exports) { 'use strict';

  var Ajax = function () {
    function Ajax() {}
    var _proto = Ajax.prototype;
    _proto.post = function post(url, data) {
      var pm = new Promise(function (res, rej) {
        var xhr = $.getXhr();
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) res(xhr.responseText);else rej(new Error(xhr.statusText), xhr.responseText);
          }
        };
        xhr.open('POST', url, true);
        var param = data;
        if (typeof data === 'object') param = objToParam(data);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(param);
      });
      return pm;
    };
    _proto.postForm = function postForm(url, data) {
      var pm = new Promise(function (res, rej) {
        var xhr = $.getXhr();
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) res(null, xhr.responseText);else rej(new Error(xhr.status), xhr.responseText);
          }
        };
        xhr.open('POST', url, true);
        xhr.send(data);
      });
      return pm;
    };
    _proto.get = function get(url, param) {
      return $.get(url, param);
    };
    return Ajax;
  }();
  function objToParam(obj) {
    var rs = '';
    var arr = [];
    for (var k in obj) {
      if (obj.hasOwnProperty(k)) {
        arr.push(k + "=" + obj[k]);
      }
    }
    rs = arr.sort().join('&');
    return rs;
  }

  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }

  function _toPrimitive(input, hint) {
    if (_typeof(input) !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
      var res = prim.call(input, hint || "default");
      if (_typeof(res) !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }

  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return _typeof(key) === "symbol" ? key : String(key);
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };
    return _setPrototypeOf(o, p);
  }

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    _setPrototypeOf(subClass, superClass);
  }

  function _extends() {
    _extends = Object.assign ? Object.assign.bind() : function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
    return _extends.apply(this, arguments);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
    return arr2;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _createForOfIteratorHelperLoose(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
    if (it) return (it = it.call(o)).next.bind(it);
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;
      return function () {
        if (i >= o.length) return {
          done: true
        };
        return {
          done: false,
          value: o[i++]
        };
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function signum(num) {
    return num < 0 ? -1 : 0 === num ? 0 : 1;
  }
  function lerp(start, stop, amount) {
    return (1 - amount) * start + amount * stop;
  }
  function clampInt(min, max, input) {
    return input < min ? min : input > max ? max : input;
  }
  function sanitizeDegreesDouble(degrees) {
    return (degrees %= 360) < 0 && (degrees += 360), degrees;
  }
  function rotationDirection(from, to) {
    return sanitizeDegreesDouble(to - from) <= 180 ? 1 : -1;
  }
  function differenceDegrees(a, b) {
    return 180 - Math.abs(Math.abs(a - b) - 180);
  }
  function matrixMultiply(row, matrix) {
    return [row[0] * matrix[0][0] + row[1] * matrix[0][1] + row[2] * matrix[0][2], row[0] * matrix[1][0] + row[1] * matrix[1][1] + row[2] * matrix[1][2], row[0] * matrix[2][0] + row[1] * matrix[2][1] + row[2] * matrix[2][2]];
  }
  var SRGB_TO_XYZ = [[.41233895, .35762064, .18051042], [.2126, .7152, .0722], [.01932141, .11916382, .95034478]],
    XYZ_TO_SRGB = [[3.2413774792388685, -1.5376652402851851, -.49885366846268053], [-.9691452513005321, 1.8758853451067872, .04156585616912061], [.05562093689691305, -.20395524564742123, 1.0571799111220335]],
    WHITE_POINT_D65 = [95.047, 100, 108.883];
  function argbFromRgb(red, green, blue) {
    return (255 << 24 | (255 & red) << 16 | (255 & green) << 8 | 255 & blue) >>> 0;
  }
  function argbFromLinrgb(linrgb) {
    return argbFromRgb(delinearized(linrgb[0]), delinearized(linrgb[1]), delinearized(linrgb[2]));
  }
  function redFromArgb(argb) {
    return argb >> 16 & 255;
  }
  function greenFromArgb(argb) {
    return argb >> 8 & 255;
  }
  function blueFromArgb(argb) {
    return 255 & argb;
  }
  function argbFromXyz(x, y, z) {
    var matrix = XYZ_TO_SRGB,
      linearR = matrix[0][0] * x + matrix[0][1] * y + matrix[0][2] * z,
      linearG = matrix[1][0] * x + matrix[1][1] * y + matrix[1][2] * z,
      linearB = matrix[2][0] * x + matrix[2][1] * y + matrix[2][2] * z;
    return argbFromRgb(delinearized(linearR), delinearized(linearG), delinearized(linearB));
  }
  function xyzFromArgb(argb) {
    return matrixMultiply([linearized(redFromArgb(argb)), linearized(greenFromArgb(argb)), linearized(blueFromArgb(argb))], SRGB_TO_XYZ);
  }
  function argbFromLstar(lstar) {
    var component = delinearized(yFromLstar(lstar));
    return argbFromRgb(component, component, component);
  }
  function lstarFromArgb(argb) {
    return 116 * labF(xyzFromArgb(argb)[1] / 100) - 16;
  }
  function yFromLstar(lstar) {
    return 100 * labInvf((lstar + 16) / 116);
  }
  function linearized(rgbComponent) {
    var normalized = rgbComponent / 255;
    return normalized <= .040449936 ? normalized / 12.92 * 100 : 100 * Math.pow((normalized + .055) / 1.055, 2.4);
  }
  function delinearized(rgbComponent) {
    var normalized = rgbComponent / 100;
    var delinearized = 0;
    return delinearized = normalized <= .0031308 ? 12.92 * normalized : 1.055 * Math.pow(normalized, 1 / 2.4) - .055, clampInt(0, 255, Math.round(255 * delinearized));
  }
  function whitePointD65() {
    return WHITE_POINT_D65;
  }
  function labF(t) {
    return t > 216 / 24389 ? Math.pow(t, 1 / 3) : (903.2962962962963 * t + 16) / 116;
  }
  function labInvf(ft) {
    var ft3 = ft * ft * ft;
    return ft3 > 216 / 24389 ? ft3 : (116 * ft - 16) / 903.2962962962963;
  }
  var ViewingConditions = function () {
    ViewingConditions.make = function make(whitePoint, adaptingLuminance, backgroundLstar, surround, discountingIlluminant) {
      if (whitePoint === void 0) {
        whitePoint = whitePointD65();
      }
      if (adaptingLuminance === void 0) {
        adaptingLuminance = 200 / Math.PI * yFromLstar(50) / 100;
      }
      if (backgroundLstar === void 0) {
        backgroundLstar = 50;
      }
      if (surround === void 0) {
        surround = 2;
      }
      if (discountingIlluminant === void 0) {
        discountingIlluminant = !1;
      }
      var xyz = whitePoint,
        rW = .401288 * xyz[0] + .650173 * xyz[1] + -.051461 * xyz[2],
        gW = -.250268 * xyz[0] + 1.204414 * xyz[1] + .045854 * xyz[2],
        bW = -.002079 * xyz[0] + .048952 * xyz[1] + .953127 * xyz[2],
        f = .8 + surround / 10,
        c = f >= .9 ? lerp(.59, .69, 10 * (f - .9)) : lerp(.525, .59, 10 * (f - .8));
      var d = discountingIlluminant ? 1 : f * (1 - 1 / 3.6 * Math.exp((-adaptingLuminance - 42) / 92));
      d = d > 1 ? 1 : d < 0 ? 0 : d;
      var nc = f,
        rgbD = [d * (100 / rW) + 1 - d, d * (100 / gW) + 1 - d, d * (100 / bW) + 1 - d],
        k = 1 / (5 * adaptingLuminance + 1),
        k4 = k * k * k * k,
        k4F = 1 - k4,
        fl = k4 * adaptingLuminance + .1 * k4F * k4F * Math.cbrt(5 * adaptingLuminance),
        n = yFromLstar(backgroundLstar) / whitePoint[1],
        z = 1.48 + Math.sqrt(n),
        nbb = .725 / Math.pow(n, .2),
        ncb = nbb,
        rgbAFactors = [Math.pow(fl * rgbD[0] * rW / 100, .42), Math.pow(fl * rgbD[1] * gW / 100, .42), Math.pow(fl * rgbD[2] * bW / 100, .42)],
        rgbA = [400 * rgbAFactors[0] / (rgbAFactors[0] + 27.13), 400 * rgbAFactors[1] / (rgbAFactors[1] + 27.13), 400 * rgbAFactors[2] / (rgbAFactors[2] + 27.13)];
      return new ViewingConditions(n, (2 * rgbA[0] + rgbA[1] + .05 * rgbA[2]) * nbb, nbb, ncb, c, nc, rgbD, fl, Math.pow(fl, .25), z);
    };
    function ViewingConditions(n, aw, nbb, ncb, c, nc, rgbD, fl, fLRoot, z) {
      this.n = n, this.aw = aw, this.nbb = nbb, this.ncb = ncb, this.c = c, this.nc = nc, this.rgbD = rgbD, this.fl = fl, this.fLRoot = fLRoot, this.z = z;
    }
    return ViewingConditions;
  }();
  ViewingConditions.DEFAULT = ViewingConditions.make();
  var Cam16 = function () {
    function Cam16(hue, chroma, j, q, m, s, jstar, astar, bstar) {
      this.hue = hue, this.chroma = chroma, this.j = j, this.q = q, this.m = m, this.s = s, this.jstar = jstar, this.astar = astar, this.bstar = bstar;
    }
    var _proto = Cam16.prototype;
    _proto.distance = function distance(other) {
      var dJ = this.jstar - other.jstar,
        dA = this.astar - other.astar,
        dB = this.bstar - other.bstar,
        dEPrime = Math.sqrt(dJ * dJ + dA * dA + dB * dB);
      return 1.41 * Math.pow(dEPrime, .63);
    };
    Cam16.fromInt = function fromInt(argb) {
      return Cam16.fromIntInViewingConditions(argb, ViewingConditions.DEFAULT);
    };
    Cam16.fromIntInViewingConditions = function fromIntInViewingConditions(argb, viewingConditions) {
      var green = (65280 & argb) >> 8,
        blue = 255 & argb,
        redL = linearized((16711680 & argb) >> 16),
        greenL = linearized(green),
        blueL = linearized(blue),
        x = .41233895 * redL + .35762064 * greenL + .18051042 * blueL,
        y = .2126 * redL + .7152 * greenL + .0722 * blueL,
        z = .01932141 * redL + .11916382 * greenL + .95034478 * blueL,
        rC = .401288 * x + .650173 * y - .051461 * z,
        gC = -.250268 * x + 1.204414 * y + .045854 * z,
        bC = -.002079 * x + .048952 * y + .953127 * z,
        rD = viewingConditions.rgbD[0] * rC,
        gD = viewingConditions.rgbD[1] * gC,
        bD = viewingConditions.rgbD[2] * bC,
        rAF = Math.pow(viewingConditions.fl * Math.abs(rD) / 100, .42),
        gAF = Math.pow(viewingConditions.fl * Math.abs(gD) / 100, .42),
        bAF = Math.pow(viewingConditions.fl * Math.abs(bD) / 100, .42),
        rA = 400 * signum(rD) * rAF / (rAF + 27.13),
        gA = 400 * signum(gD) * gAF / (gAF + 27.13),
        bA = 400 * signum(bD) * bAF / (bAF + 27.13),
        a = (11 * rA + -12 * gA + bA) / 11,
        b = (rA + gA - 2 * bA) / 9,
        u = (20 * rA + 20 * gA + 21 * bA) / 20,
        p2 = (40 * rA + 20 * gA + bA) / 20,
        atanDegrees = 180 * Math.atan2(b, a) / Math.PI,
        hue = atanDegrees < 0 ? atanDegrees + 360 : atanDegrees >= 360 ? atanDegrees - 360 : atanDegrees,
        hueRadians = hue * Math.PI / 180,
        ac = p2 * viewingConditions.nbb,
        j = 100 * Math.pow(ac / viewingConditions.aw, viewingConditions.c * viewingConditions.z),
        q = 4 / viewingConditions.c * Math.sqrt(j / 100) * (viewingConditions.aw + 4) * viewingConditions.fLRoot,
        huePrime = hue < 20.14 ? hue + 360 : hue,
        t = 5e4 / 13 * (.25 * (Math.cos(huePrime * Math.PI / 180 + 2) + 3.8)) * viewingConditions.nc * viewingConditions.ncb * Math.sqrt(a * a + b * b) / (u + .305),
        alpha = Math.pow(t, .9) * Math.pow(1.64 - Math.pow(.29, viewingConditions.n), .73),
        c = alpha * Math.sqrt(j / 100),
        m = c * viewingConditions.fLRoot,
        s = 50 * Math.sqrt(alpha * viewingConditions.c / (viewingConditions.aw + 4)),
        jstar = (1 + 100 * .007) * j / (1 + .007 * j),
        mstar = 1 / .0228 * Math.log(1 + .0228 * m),
        astar = mstar * Math.cos(hueRadians),
        bstar = mstar * Math.sin(hueRadians);
      return new Cam16(hue, c, j, q, m, s, jstar, astar, bstar);
    };
    Cam16.fromJch = function fromJch(j, c, h) {
      return Cam16.fromJchInViewingConditions(j, c, h, ViewingConditions.DEFAULT);
    };
    Cam16.fromJchInViewingConditions = function fromJchInViewingConditions(j, c, h, viewingConditions) {
      var q = 4 / viewingConditions.c * Math.sqrt(j / 100) * (viewingConditions.aw + 4) * viewingConditions.fLRoot,
        m = c * viewingConditions.fLRoot,
        alpha = c / Math.sqrt(j / 100),
        s = 50 * Math.sqrt(alpha * viewingConditions.c / (viewingConditions.aw + 4)),
        hueRadians = h * Math.PI / 180,
        jstar = (1 + 100 * .007) * j / (1 + .007 * j),
        mstar = 1 / .0228 * Math.log(1 + .0228 * m),
        astar = mstar * Math.cos(hueRadians),
        bstar = mstar * Math.sin(hueRadians);
      return new Cam16(h, c, j, q, m, s, jstar, astar, bstar);
    };
    Cam16.fromUcs = function fromUcs(jstar, astar, bstar) {
      return Cam16.fromUcsInViewingConditions(jstar, astar, bstar, ViewingConditions.DEFAULT);
    };
    Cam16.fromUcsInViewingConditions = function fromUcsInViewingConditions(jstar, astar, bstar, viewingConditions) {
      var a = astar,
        b = bstar,
        m = Math.sqrt(a * a + b * b),
        c = (Math.exp(.0228 * m) - 1) / .0228 / viewingConditions.fLRoot;
      var h = Math.atan2(b, a) * (180 / Math.PI);
      h < 0 && (h += 360);
      var j = jstar / (1 - .007 * (jstar - 100));
      return Cam16.fromJchInViewingConditions(j, c, h, viewingConditions);
    };
    _proto.toInt = function toInt() {
      return this.viewed(ViewingConditions.DEFAULT);
    };
    _proto.viewed = function viewed(viewingConditions) {
      var alpha = 0 === this.chroma || 0 === this.j ? 0 : this.chroma / Math.sqrt(this.j / 100),
        t = Math.pow(alpha / Math.pow(1.64 - Math.pow(.29, viewingConditions.n), .73), 1 / .9),
        hRad = this.hue * Math.PI / 180,
        eHue = .25 * (Math.cos(hRad + 2) + 3.8),
        ac = viewingConditions.aw * Math.pow(this.j / 100, 1 / viewingConditions.c / viewingConditions.z),
        p1 = eHue * (5e4 / 13) * viewingConditions.nc * viewingConditions.ncb,
        p2 = ac / viewingConditions.nbb,
        hSin = Math.sin(hRad),
        hCos = Math.cos(hRad),
        gamma = 23 * (p2 + .305) * t / (23 * p1 + 11 * t * hCos + 108 * t * hSin),
        a = gamma * hCos,
        b = gamma * hSin,
        rA = (460 * p2 + 451 * a + 288 * b) / 1403,
        gA = (460 * p2 - 891 * a - 261 * b) / 1403,
        bA = (460 * p2 - 220 * a - 6300 * b) / 1403,
        rCBase = Math.max(0, 27.13 * Math.abs(rA) / (400 - Math.abs(rA))),
        rC = signum(rA) * (100 / viewingConditions.fl) * Math.pow(rCBase, 1 / .42),
        gCBase = Math.max(0, 27.13 * Math.abs(gA) / (400 - Math.abs(gA))),
        gC = signum(gA) * (100 / viewingConditions.fl) * Math.pow(gCBase, 1 / .42),
        bCBase = Math.max(0, 27.13 * Math.abs(bA) / (400 - Math.abs(bA))),
        bC = signum(bA) * (100 / viewingConditions.fl) * Math.pow(bCBase, 1 / .42),
        rF = rC / viewingConditions.rgbD[0],
        gF = gC / viewingConditions.rgbD[1],
        bF = bC / viewingConditions.rgbD[2];
      return argbFromXyz(1.86206786 * rF - 1.01125463 * gF + .14918677 * bF, .38752654 * rF + .62144744 * gF - .00897398 * bF, -.0158415 * rF - .03412294 * gF + 1.04996444 * bF);
    };
    return Cam16;
  }();
  var HctSolver = function () {
    function HctSolver() {}
    HctSolver.sanitizeRadians = function sanitizeRadians(angle) {
      return (angle + 8 * Math.PI) % (2 * Math.PI);
    };
    HctSolver.trueDelinearized = function trueDelinearized(rgbComponent) {
      var normalized = rgbComponent / 100;
      var delinearized = 0;
      return delinearized = normalized <= .0031308 ? 12.92 * normalized : 1.055 * Math.pow(normalized, 1 / 2.4) - .055, 255 * delinearized;
    };
    HctSolver.chromaticAdaptation = function chromaticAdaptation(component) {
      var af = Math.pow(Math.abs(component), .42);
      return 400 * signum(component) * af / (af + 27.13);
    };
    HctSolver.hueOf = function hueOf(linrgb) {
      var scaledDiscount = matrixMultiply(linrgb, HctSolver.SCALED_DISCOUNT_FROM_LINRGB),
        rA = HctSolver.chromaticAdaptation(scaledDiscount[0]),
        gA = HctSolver.chromaticAdaptation(scaledDiscount[1]),
        bA = HctSolver.chromaticAdaptation(scaledDiscount[2]),
        a = (11 * rA + -12 * gA + bA) / 11,
        b = (rA + gA - 2 * bA) / 9;
      return Math.atan2(b, a);
    };
    HctSolver.areInCyclicOrder = function areInCyclicOrder(a, b, c) {
      return HctSolver.sanitizeRadians(b - a) < HctSolver.sanitizeRadians(c - a);
    };
    HctSolver.intercept = function intercept(source, mid, target) {
      return (mid - source) / (target - source);
    };
    HctSolver.lerpPoint = function lerpPoint(source, t, target) {
      return [source[0] + (target[0] - source[0]) * t, source[1] + (target[1] - source[1]) * t, source[2] + (target[2] - source[2]) * t];
    };
    HctSolver.setCoordinate = function setCoordinate(source, coordinate, target, axis) {
      var t = HctSolver.intercept(source[axis], coordinate, target[axis]);
      return HctSolver.lerpPoint(source, t, target);
    };
    HctSolver.isBounded = function isBounded(x) {
      return 0 <= x && x <= 100;
    };
    HctSolver.nthVertex = function nthVertex(y, n) {
      var kR = HctSolver.Y_FROM_LINRGB[0],
        kG = HctSolver.Y_FROM_LINRGB[1],
        kB = HctSolver.Y_FROM_LINRGB[2],
        coordA = n % 4 <= 1 ? 0 : 100,
        coordB = n % 2 == 0 ? 0 : 100;
      if (n < 4) {
        var g = coordA,
          b = coordB,
          r = (y - g * kG - b * kB) / kR;
        return HctSolver.isBounded(r) ? [r, g, b] : [-1, -1, -1];
      }
      if (n < 8) {
        var _b = coordA,
          _r = coordB,
          _g = (y - _r * kR - _b * kB) / kG;
        return HctSolver.isBounded(_g) ? [_r, _g, _b] : [-1, -1, -1];
      }
      {
        var _r2 = coordA,
          _g2 = coordB,
          _b2 = (y - _r2 * kR - _g2 * kG) / kB;
        return HctSolver.isBounded(_b2) ? [_r2, _g2, _b2] : [-1, -1, -1];
      }
    };
    HctSolver.bisectToSegment = function bisectToSegment(y, targetHue) {
      var left = [-1, -1, -1],
        right = left,
        leftHue = 0,
        rightHue = 0,
        initialized = !1,
        uncut = !0;
      for (var n = 0; n < 12; n++) {
        var mid = HctSolver.nthVertex(y, n);
        if (mid[0] < 0) continue;
        var midHue = HctSolver.hueOf(mid);
        initialized ? (uncut || HctSolver.areInCyclicOrder(leftHue, midHue, rightHue)) && (uncut = !1, HctSolver.areInCyclicOrder(leftHue, targetHue, midHue) ? (right = mid, rightHue = midHue) : (left = mid, leftHue = midHue)) : (left = mid, right = mid, leftHue = midHue, rightHue = midHue, initialized = !0);
      }
      return [left, right];
    };
    HctSolver.midpoint = function midpoint(a, b) {
      return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
    };
    HctSolver.criticalPlaneBelow = function criticalPlaneBelow(x) {
      return Math.floor(x - .5);
    };
    HctSolver.criticalPlaneAbove = function criticalPlaneAbove(x) {
      return Math.ceil(x - .5);
    };
    HctSolver.bisectToLimit = function bisectToLimit(y, targetHue) {
      var segment = HctSolver.bisectToSegment(y, targetHue);
      var left = segment[0],
        leftHue = HctSolver.hueOf(left),
        right = segment[1];
      for (var axis = 0; axis < 3; axis++) if (left[axis] !== right[axis]) {
        var lPlane = -1,
          rPlane = 255;
        left[axis] < right[axis] ? (lPlane = HctSolver.criticalPlaneBelow(HctSolver.trueDelinearized(left[axis])), rPlane = HctSolver.criticalPlaneAbove(HctSolver.trueDelinearized(right[axis]))) : (lPlane = HctSolver.criticalPlaneAbove(HctSolver.trueDelinearized(left[axis])), rPlane = HctSolver.criticalPlaneBelow(HctSolver.trueDelinearized(right[axis])));
        for (var i = 0; i < 8 && !(Math.abs(rPlane - lPlane) <= 1); i++) {
          var mPlane = Math.floor((lPlane + rPlane) / 2),
            midPlaneCoordinate = HctSolver.CRITICAL_PLANES[mPlane],
            mid = HctSolver.setCoordinate(left, midPlaneCoordinate, right, axis),
            midHue = HctSolver.hueOf(mid);
          HctSolver.areInCyclicOrder(leftHue, targetHue, midHue) ? (right = mid, rPlane = mPlane) : (left = mid, leftHue = midHue, lPlane = mPlane);
        }
      }
      return HctSolver.midpoint(left, right);
    };
    HctSolver.inverseChromaticAdaptation = function inverseChromaticAdaptation(adapted) {
      var adaptedAbs = Math.abs(adapted),
        base = Math.max(0, 27.13 * adaptedAbs / (400 - adaptedAbs));
      return signum(adapted) * Math.pow(base, 1 / .42);
    };
    HctSolver.findResultByJ = function findResultByJ(hueRadians, chroma, y) {
      var j = 11 * Math.sqrt(y);
      var viewingConditions = ViewingConditions.DEFAULT,
        tInnerCoeff = 1 / Math.pow(1.64 - Math.pow(.29, viewingConditions.n), .73),
        p1 = .25 * (Math.cos(hueRadians + 2) + 3.8) * (5e4 / 13) * viewingConditions.nc * viewingConditions.ncb,
        hSin = Math.sin(hueRadians),
        hCos = Math.cos(hueRadians);
      for (var iterationRound = 0; iterationRound < 5; iterationRound++) {
        var jNormalized = j / 100,
          alpha = 0 === chroma || 0 === j ? 0 : chroma / Math.sqrt(jNormalized),
          t = Math.pow(alpha * tInnerCoeff, 1 / .9),
          p2 = viewingConditions.aw * Math.pow(jNormalized, 1 / viewingConditions.c / viewingConditions.z) / viewingConditions.nbb,
          gamma = 23 * (p2 + .305) * t / (23 * p1 + 11 * t * hCos + 108 * t * hSin),
          a = gamma * hCos,
          b = gamma * hSin,
          rA = (460 * p2 + 451 * a + 288 * b) / 1403,
          gA = (460 * p2 - 891 * a - 261 * b) / 1403,
          bA = (460 * p2 - 220 * a - 6300 * b) / 1403,
          linrgb = matrixMultiply([HctSolver.inverseChromaticAdaptation(rA), HctSolver.inverseChromaticAdaptation(gA), HctSolver.inverseChromaticAdaptation(bA)], HctSolver.LINRGB_FROM_SCALED_DISCOUNT);
        if (linrgb[0] < 0 || linrgb[1] < 0 || linrgb[2] < 0) return 0;
        var kR = HctSolver.Y_FROM_LINRGB[0],
          kG = HctSolver.Y_FROM_LINRGB[1],
          kB = HctSolver.Y_FROM_LINRGB[2],
          fnj = kR * linrgb[0] + kG * linrgb[1] + kB * linrgb[2];
        if (fnj <= 0) return 0;
        if (4 === iterationRound || Math.abs(fnj - y) < .002) return linrgb[0] > 100.01 || linrgb[1] > 100.01 || linrgb[2] > 100.01 ? 0 : argbFromLinrgb(linrgb);
        j -= (fnj - y) * j / (2 * fnj);
      }
      return 0;
    };
    HctSolver.solveToInt = function solveToInt(hueDegrees, chroma, lstar) {
      if (chroma < 1e-4 || lstar < 1e-4 || lstar > 99.9999) return argbFromLstar(lstar);
      var hueRadians = (hueDegrees = sanitizeDegreesDouble(hueDegrees)) / 180 * Math.PI,
        y = yFromLstar(lstar),
        exactAnswer = HctSolver.findResultByJ(hueRadians, chroma, y);
      if (0 !== exactAnswer) return exactAnswer;
      return argbFromLinrgb(HctSolver.bisectToLimit(y, hueRadians));
    };
    HctSolver.solveToCam = function solveToCam(hueDegrees, chroma, lstar) {
      return Cam16.fromInt(HctSolver.solveToInt(hueDegrees, chroma, lstar));
    };
    return HctSolver;
  }();
  HctSolver.SCALED_DISCOUNT_FROM_LINRGB = [[.001200833568784504, .002389694492170889, .0002795742885861124], [.0005891086651375999, .0029785502573438758, .0003270666104008398], [.00010146692491640572, .0005364214359186694, .0032979401770712076]], HctSolver.LINRGB_FROM_SCALED_DISCOUNT = [[1373.2198709594231, -1100.4251190754821, -7.278681089101213], [-271.815969077903, 559.6580465940733, -32.46047482791194], [1.9622899599665666, -57.173814538844006, 308.7233197812385]], HctSolver.Y_FROM_LINRGB = [.2126, .7152, .0722], HctSolver.CRITICAL_PLANES = [.015176349177441876, .045529047532325624, .07588174588720938, .10623444424209313, .13658714259697685, .16693984095186062, .19729253930674434, .2276452376616281, .2579979360165119, .28835063437139563, .3188300904430532, .350925934958123, .3848314933096426, .42057480301049466, .458183274052838, .4976837250274023, .5391024159806381, .5824650784040898, .6277969426914107, .6751227633498623, .7244668422128921, .775853049866786, .829304845476233, .8848452951698498, .942497089126609, 1.0022825574869039, 1.0642236851973577, 1.1283421258858297, 1.1946592148522128, 1.2631959812511864, 1.3339731595349034, 1.407011200216447, 1.4823302800086415, 1.5599503113873272, 1.6398909516233677, 1.7221716113234105, 1.8068114625156377, 1.8938294463134073, 1.9832442801866852, 2.075074464868551, 2.1693382909216234, 2.2660538449872063, 2.36523901573795, 2.4669114995532007, 2.5710888059345764, 2.6777882626779785, 2.7870270208169257, 2.898822059350997, 3.0131901897720907, 3.1301480604002863, 3.2497121605402226, 3.3718988244681087, 3.4967242352587946, 3.624204428461639, 3.754355295633311, 3.887192587735158, 4.022731918402185, 4.160988767090289, 4.301978482107941, 4.445716283538092, 4.592217266055746, 4.741496401646282, 4.893568542229298, 5.048448422192488, 5.20615066083972, 5.3666897647573375, 5.5300801301023865, 5.696336044816294, 5.865471690767354, 6.037501145825082, 6.212438385869475, 6.390297286737924, 6.571091626112461, 6.7548350853498045, 6.941541251256611, 7.131223617812143, 7.323895587840543, 7.5195704746346665, 7.7182615035334345, 7.919981813454504, 8.124744458384042, 8.332562408825165, 8.543448553206703, 8.757415699253682, 8.974476575321063, 9.194643831691977, 9.417930041841839, 9.644347703669503, 9.873909240696694, 10.106627003236781, 10.342513269534024, 10.58158024687427, 10.8238400726681, 11.069304815507364, 11.317986476196008, 11.569896988756009, 11.825048221409341, 12.083451977536606, 12.345119996613247, 12.610063955123938, 12.878295467455942, 13.149826086772048, 13.42466730586372, 13.702830557985108, 13.984327217668513, 14.269168601521828, 14.55736596900856, 14.848930523210871, 15.143873411576273, 15.44220572664832, 15.743938506781891, 16.04908273684337, 16.35764934889634, 16.66964922287304, 16.985093187232053, 17.30399201960269, 17.62635644741625, 17.95219714852476, 18.281524751807332, 18.614349837764564, 18.95068293910138, 19.290534541298456, 19.633915083172692, 19.98083495742689, 20.331304511189067, 20.685334046541502, 21.042933821039977, 21.404114048223256, 21.76888489811322, 22.137256497705877, 22.50923893145328, 22.884842241736916, 23.264076429332462, 23.6469514538663, 24.033477234264016, 24.42366364919083, 24.817520537484558, 25.21505769858089, 25.61628489293138, 26.021211842414342, 26.429848230738664, 26.842203703840827, 27.258287870275353, 27.678110301598522, 28.10168053274597, 28.529008062403893, 28.96010235337422, 29.39497283293396, 29.83362889318845, 30.276079891419332, 30.722335150426627, 31.172403958865512, 31.62629557157785, 32.08401920991837, 32.54558406207592, 33.010999283389665, 33.4802739966603, 33.953417292456834, 34.430438229418264, 34.911345834551085, 35.39614910352207, 35.88485700094671, 36.37747846067349, 36.87402238606382, 37.37449765026789, 37.87891309649659, 38.38727753828926, 38.89959975977785, 39.41588851594697, 39.93615253289054, 40.460400508064545, 40.98864111053629, 41.520882981230194, 42.05713473317016, 42.597404951718396, 43.141702194811224, 43.6900349931913, 44.24241185063697, 44.798841244188324, 45.35933162437017, 45.92389141541209, 46.49252901546552, 47.065252796817916, 47.64207110610409, 48.22299226451468, 48.808024568002054, 49.3971762874833, 49.9904556690408, 50.587870934119984, 51.189430279724725, 51.79514187861014, 52.40501387947288, 53.0190544071392, 53.637271562750364, 54.259673423945976, 54.88626804504493, 55.517063457223934, 56.15206766869424, 56.79128866487574, 57.43473440856916, 58.08241284012621, 58.734331877617365, 59.39049941699807, 60.05092333227251, 60.715611475655585, 61.38457167773311, 62.057811747619894, 62.7353394731159, 63.417162620860914, 64.10328893648692, 64.79372614476921, 65.48848194977529, 66.18756403501224, 66.89098006357258, 67.59873767827808, 68.31084450182222, 69.02730813691093, 69.74813616640164, 70.47333615344107, 71.20291564160104, 71.93688215501312, 72.67524319850172, 73.41800625771542, 74.16517879925733, 74.9167682708136, 75.67278210128072, 76.43322770089146, 77.1981124613393, 77.96744375590167, 78.74122893956174, 79.51947534912904, 80.30219030335869, 81.08938110306934, 81.88105503125999, 82.67721935322541, 83.4778813166706, 84.28304815182372, 85.09272707154808, 85.90692527145302, 86.72564993000343, 87.54890820862819, 88.3767072518277, 89.2090541872801, 90.04595612594655, 90.88742016217518, 91.73345337380438, 92.58406282226491, 93.43925555268066, 94.29903859396902, 95.16341895893969, 96.03240364439274, 96.9059996312159, 97.78421388448044, 98.6670533535366, 99.55452497210776];
  var Hct = function () {
    Hct.from = function from(hue, chroma, tone) {
      return new Hct(HctSolver.solveToInt(hue, chroma, tone));
    };
    Hct.fromInt = function fromInt(argb) {
      return new Hct(argb);
    };
    var _proto2 = Hct.prototype;
    _proto2.toInt = function toInt() {
      return this.argb;
    };
    function Hct(argb) {
      this.argb = argb;
      var cam = Cam16.fromInt(argb);
      this.internalHue = cam.hue, this.internalChroma = cam.chroma, this.internalTone = lstarFromArgb(argb), this.argb = argb;
    }
    _proto2.setInternalState = function setInternalState(argb) {
      var cam = Cam16.fromInt(argb);
      this.internalHue = cam.hue, this.internalChroma = cam.chroma, this.internalTone = lstarFromArgb(argb), this.argb = argb;
    };
    _createClass(Hct, [{
      key: "hue",
      get: function get() {
        return this.internalHue;
      },
      set: function set(newHue) {
        this.setInternalState(HctSolver.solveToInt(newHue, this.internalChroma, this.internalTone));
      }
    }, {
      key: "chroma",
      get: function get() {
        return this.internalChroma;
      },
      set: function set(newChroma) {
        this.setInternalState(HctSolver.solveToInt(this.internalHue, newChroma, this.internalTone));
      }
    }, {
      key: "tone",
      get: function get() {
        return this.internalTone;
      },
      set: function set(newTone) {
        this.setInternalState(HctSolver.solveToInt(this.internalHue, this.internalChroma, newTone));
      }
    }]);
    return Hct;
  }();
  var Blend = function () {
    function Blend() {}
    Blend.harmonize = function harmonize(designColor, sourceColor) {
      var fromHct = Hct.fromInt(designColor),
        toHct = Hct.fromInt(sourceColor),
        differenceDegrees$1 = differenceDegrees(fromHct.hue, toHct.hue),
        rotationDegrees = Math.min(.5 * differenceDegrees$1, 15),
        outputHue = sanitizeDegreesDouble(fromHct.hue + rotationDegrees * rotationDirection(fromHct.hue, toHct.hue));
      return Hct.from(outputHue, fromHct.chroma, fromHct.tone).toInt();
    };
    Blend.hctHue = function hctHue(from, to, amount) {
      var ucs = Blend.cam16Ucs(from, to, amount),
        ucsCam = Cam16.fromInt(ucs),
        fromCam = Cam16.fromInt(from);
      return Hct.from(ucsCam.hue, fromCam.chroma, lstarFromArgb(from)).toInt();
    };
    Blend.cam16Ucs = function cam16Ucs(from, to, amount) {
      var fromCam = Cam16.fromInt(from),
        toCam = Cam16.fromInt(to),
        fromJ = fromCam.jstar,
        fromA = fromCam.astar,
        fromB = fromCam.bstar,
        jstar = fromJ + (toCam.jstar - fromJ) * amount,
        astar = fromA + (toCam.astar - fromA) * amount,
        bstar = fromB + (toCam.bstar - fromB) * amount;
      return Cam16.fromUcs(jstar, astar, bstar).toInt();
    };
    return Blend;
  }();
  var TonalPalette = function () {
    TonalPalette.fromInt = function fromInt(argb) {
      var hct = Hct.fromInt(argb);
      return TonalPalette.fromHueAndChroma(hct.hue, hct.chroma);
    };
    TonalPalette.fromHueAndChroma = function fromHueAndChroma(hue, chroma) {
      return new TonalPalette(hue, chroma);
    };
    function TonalPalette(hue, chroma) {
      this.hue = hue, this.chroma = chroma, this.cache = new Map();
    }
    var _proto3 = TonalPalette.prototype;
    _proto3.tone = function tone(_tone) {
      var argb = this.cache.get(_tone);
      return void 0 === argb && (argb = Hct.from(this.hue, this.chroma, _tone).toInt(), this.cache.set(_tone, argb)), argb;
    };
    return TonalPalette;
  }();
  var CorePalette = function () {
    CorePalette.of = function of(argb) {
      return new CorePalette(argb, !1);
    };
    CorePalette.contentOf = function contentOf(argb) {
      return new CorePalette(argb, !0);
    };
    CorePalette.fromColors = function fromColors(colors) {
      return CorePalette.createPaletteFromColors(!1, colors);
    };
    CorePalette.contentFromColors = function contentFromColors(colors) {
      return CorePalette.createPaletteFromColors(!0, colors);
    };
    CorePalette.createPaletteFromColors = function createPaletteFromColors(content, colors) {
      var palette = new CorePalette(colors.primary, content);
      if (colors.secondary) {
        var p = new CorePalette(colors.secondary, content);
        palette.a2 = p.a1;
      }
      if (colors.tertiary) {
        var _p = new CorePalette(colors.tertiary, content);
        palette.a3 = _p.a1;
      }
      if (colors.error) {
        var _p2 = new CorePalette(colors.error, content);
        palette.error = _p2.a1;
      }
      if (colors.neutral) {
        var _p3 = new CorePalette(colors.neutral, content);
        palette.n1 = _p3.n1;
      }
      if (colors.neutralVariant) {
        var _p4 = new CorePalette(colors.neutralVariant, content);
        palette.n2 = _p4.n2;
      }
      return palette;
    };
    function CorePalette(argb, isContent) {
      var hct = Hct.fromInt(argb),
        hue = hct.hue,
        chroma = hct.chroma;
      isContent ? (this.a1 = TonalPalette.fromHueAndChroma(hue, chroma), this.a2 = TonalPalette.fromHueAndChroma(hue, chroma / 3), this.a3 = TonalPalette.fromHueAndChroma(hue + 60, chroma / 2), this.n1 = TonalPalette.fromHueAndChroma(hue, Math.min(chroma / 12, 4)), this.n2 = TonalPalette.fromHueAndChroma(hue, Math.min(chroma / 6, 8))) : (this.a1 = TonalPalette.fromHueAndChroma(hue, Math.max(48, chroma)), this.a2 = TonalPalette.fromHueAndChroma(hue, 16), this.a3 = TonalPalette.fromHueAndChroma(hue + 60, 24), this.n1 = TonalPalette.fromHueAndChroma(hue, 4), this.n2 = TonalPalette.fromHueAndChroma(hue, 8)), this.error = TonalPalette.fromHueAndChroma(25, 84);
    }
    return CorePalette;
  }();
  var Scheme = function () {
    Scheme.light = function light(argb) {
      return Scheme.lightFromCorePalette(CorePalette.of(argb));
    };
    Scheme.dark = function dark(argb) {
      return Scheme.darkFromCorePalette(CorePalette.of(argb));
    };
    Scheme.lightContent = function lightContent(argb) {
      return Scheme.lightFromCorePalette(CorePalette.contentOf(argb));
    };
    Scheme.darkContent = function darkContent(argb) {
      return Scheme.darkFromCorePalette(CorePalette.contentOf(argb));
    };
    Scheme.lightFromCorePalette = function lightFromCorePalette(core) {
      return new Scheme({
        primary: core.a1.tone(40),
        onPrimary: core.a1.tone(100),
        primaryContainer: core.a1.tone(90),
        onPrimaryContainer: core.a1.tone(10),
        secondary: core.a2.tone(40),
        onSecondary: core.a2.tone(100),
        secondaryContainer: core.a2.tone(90),
        onSecondaryContainer: core.a2.tone(10),
        tertiary: core.a3.tone(40),
        onTertiary: core.a3.tone(100),
        tertiaryContainer: core.a3.tone(90),
        onTertiaryContainer: core.a3.tone(10),
        error: core.error.tone(40),
        onError: core.error.tone(100),
        errorContainer: core.error.tone(90),
        onErrorContainer: core.error.tone(10),
        background: core.n1.tone(99),
        onBackground: core.n1.tone(10),
        surface: core.n1.tone(99),
        onSurface: core.n1.tone(10),
        surfaceVariant: core.n2.tone(90),
        onSurfaceVariant: core.n2.tone(30),
        outline: core.n2.tone(50),
        outlineVariant: core.n2.tone(80),
        shadow: core.n1.tone(0),
        scrim: core.n1.tone(0),
        inverseSurface: core.n1.tone(20),
        inverseOnSurface: core.n1.tone(95),
        inversePrimary: core.a1.tone(80)
      });
    };
    Scheme.darkFromCorePalette = function darkFromCorePalette(core) {
      return new Scheme({
        primary: core.a1.tone(80),
        onPrimary: core.a1.tone(20),
        primaryContainer: core.a1.tone(30),
        onPrimaryContainer: core.a1.tone(90),
        secondary: core.a2.tone(80),
        onSecondary: core.a2.tone(20),
        secondaryContainer: core.a2.tone(30),
        onSecondaryContainer: core.a2.tone(90),
        tertiary: core.a3.tone(80),
        onTertiary: core.a3.tone(20),
        tertiaryContainer: core.a3.tone(30),
        onTertiaryContainer: core.a3.tone(90),
        error: core.error.tone(80),
        onError: core.error.tone(20),
        errorContainer: core.error.tone(30),
        onErrorContainer: core.error.tone(80),
        background: core.n1.tone(10),
        onBackground: core.n1.tone(90),
        surface: core.n1.tone(10),
        onSurface: core.n1.tone(90),
        surfaceVariant: core.n2.tone(30),
        onSurfaceVariant: core.n2.tone(80),
        outline: core.n2.tone(60),
        outlineVariant: core.n2.tone(30),
        shadow: core.n1.tone(0),
        scrim: core.n1.tone(0),
        inverseSurface: core.n1.tone(90),
        inverseOnSurface: core.n1.tone(20),
        inversePrimary: core.a1.tone(40)
      });
    };
    function Scheme(props) {
      this.props = props;
    }
    var _proto4 = Scheme.prototype;
    _proto4.toJSON = function toJSON() {
      return _extends({}, this.props);
    };
    _createClass(Scheme, [{
      key: "primary",
      get: function get() {
        return this.props.primary;
      }
    }, {
      key: "onPrimary",
      get: function get() {
        return this.props.onPrimary;
      }
    }, {
      key: "primaryContainer",
      get: function get() {
        return this.props.primaryContainer;
      }
    }, {
      key: "onPrimaryContainer",
      get: function get() {
        return this.props.onPrimaryContainer;
      }
    }, {
      key: "secondary",
      get: function get() {
        return this.props.secondary;
      }
    }, {
      key: "onSecondary",
      get: function get() {
        return this.props.onSecondary;
      }
    }, {
      key: "secondaryContainer",
      get: function get() {
        return this.props.secondaryContainer;
      }
    }, {
      key: "onSecondaryContainer",
      get: function get() {
        return this.props.onSecondaryContainer;
      }
    }, {
      key: "tertiary",
      get: function get() {
        return this.props.tertiary;
      }
    }, {
      key: "onTertiary",
      get: function get() {
        return this.props.onTertiary;
      }
    }, {
      key: "tertiaryContainer",
      get: function get() {
        return this.props.tertiaryContainer;
      }
    }, {
      key: "onTertiaryContainer",
      get: function get() {
        return this.props.onTertiaryContainer;
      }
    }, {
      key: "error",
      get: function get() {
        return this.props.error;
      }
    }, {
      key: "onError",
      get: function get() {
        return this.props.onError;
      }
    }, {
      key: "errorContainer",
      get: function get() {
        return this.props.errorContainer;
      }
    }, {
      key: "onErrorContainer",
      get: function get() {
        return this.props.onErrorContainer;
      }
    }, {
      key: "background",
      get: function get() {
        return this.props.background;
      }
    }, {
      key: "onBackground",
      get: function get() {
        return this.props.onBackground;
      }
    }, {
      key: "surface",
      get: function get() {
        return this.props.surface;
      }
    }, {
      key: "onSurface",
      get: function get() {
        return this.props.onSurface;
      }
    }, {
      key: "surfaceVariant",
      get: function get() {
        return this.props.surfaceVariant;
      }
    }, {
      key: "onSurfaceVariant",
      get: function get() {
        return this.props.onSurfaceVariant;
      }
    }, {
      key: "outline",
      get: function get() {
        return this.props.outline;
      }
    }, {
      key: "outlineVariant",
      get: function get() {
        return this.props.outlineVariant;
      }
    }, {
      key: "shadow",
      get: function get() {
        return this.props.shadow;
      }
    }, {
      key: "scrim",
      get: function get() {
        return this.props.scrim;
      }
    }, {
      key: "inverseSurface",
      get: function get() {
        return this.props.inverseSurface;
      }
    }, {
      key: "inverseOnSurface",
      get: function get() {
        return this.props.inverseOnSurface;
      }
    }, {
      key: "inversePrimary",
      get: function get() {
        return this.props.inversePrimary;
      }
    }]);
    return Scheme;
  }();
  function hexFromArgb(argb) {
    var r = redFromArgb(argb),
      g = greenFromArgb(argb),
      b = blueFromArgb(argb),
      outParts = [r.toString(16), g.toString(16), b.toString(16)];
    for (var _iterator = _createForOfIteratorHelperLoose(outParts.entries()), _step; !(_step = _iterator()).done;) {
      var _step$value = _step.value,
        i = _step$value[0],
        part = _step$value[1];
      1 === part.length && (outParts[i] = "0" + part);
    }
    return "#" + outParts.join("");
  }
  function argbFromHex(hex) {
    var isThree = 3 === (hex = hex.replace("#", "")).length,
      isSix = 6 === hex.length,
      isEight = 8 === hex.length;
    if (!isThree && !isSix && !isEight) throw new Error("unexpected hex " + hex);
    var r = 0,
      g = 0,
      b = 0;
    return isThree ? (r = parseIntHex(hex.slice(0, 1).repeat(2)), g = parseIntHex(hex.slice(1, 2).repeat(2)), b = parseIntHex(hex.slice(2, 3).repeat(2))) : isSix ? (r = parseIntHex(hex.slice(0, 2)), g = parseIntHex(hex.slice(2, 4)), b = parseIntHex(hex.slice(4, 6))) : isEight && (r = parseIntHex(hex.slice(2, 4)), g = parseIntHex(hex.slice(4, 6)), b = parseIntHex(hex.slice(6, 8))), (255 << 24 | (255 & r) << 16 | (255 & g) << 8 | 255 & b) >>> 0;
  }
  function parseIntHex(value) {
    return parseInt(value, 16);
  }
  function themeFromSourceColor(source, customColors) {
    if (customColors === void 0) {
      customColors = [];
    }
    var palette = CorePalette.of(source);
    return {
      source: source,
      schemes: {
        light: Scheme.light(source),
        dark: Scheme.dark(source)
      },
      palettes: {
        primary: palette.a1,
        secondary: palette.a2,
        tertiary: palette.a3,
        neutral: palette.n1,
        neutralVariant: palette.n2,
        error: palette.error
      },
      customColors: customColors.map(function (c) {
        return customColor(source, c);
      })
    };
  }
  function customColor(source, color) {
    var value = color.value;
    var from = value,
      to = source;
    color.blend && (value = Blend.harmonize(from, to));
    var tones = CorePalette.of(value).a1;
    return {
      color: color,
      value: value,
      light: {
        color: tones.tone(40),
        onColor: tones.tone(100),
        colorContainer: tones.tone(90),
        onColorContainer: tones.tone(10)
      },
      dark: {
        color: tones.tone(80),
        onColor: tones.tone(20),
        colorContainer: tones.tone(30),
        onColorContainer: tones.tone(90)
      }
    };
  }

  function toRGBA(d) {
    var r = Math.round;
    var l = d.length;
    var rgba = {};
    if (d.slice(0, 3).toLowerCase() === 'rgb') {
      d = d.replace(' ', '').split(',');
      rgba[0] = parseInt(d[0].slice(d[3].toLowerCase() === 'a' ? 5 : 4), 10);
      rgba[1] = parseInt(d[1], 10);
      rgba[2] = parseInt(d[2], 10);
      rgba[3] = d[3] ? parseFloat(d[3]) : -1;
    } else {
      if (l < 6) d = parseInt(String(d[1]) + d[1] + d[2] + d[2] + d[3] + d[3] + (l > 4 ? String(d[4]) + d[4] : ''), 16);else d = parseInt(d.slice(1), 16);
      rgba[0] = d >> 16 & 255;
      rgba[1] = d >> 8 & 255;
      rgba[2] = d & 255;
      rgba[3] = l === 9 || l === 5 ? r((d >> 24 & 255) / 255 * 10000) / 10000 : -1;
    }
    return rgba;
  }
  function blend(from, to, p) {
    if (p === void 0) {
      p = 0.5;
    }
    var r = Math.round;
    from = from.trim();
    to = to.trim();
    var b = p < 0;
    p = b ? p * -1 : p;
    var f = toRGBA(from);
    var t = toRGBA(to);
    if (to[0] === 'r') {
      return 'rgb' + (to[3] === 'a' ? 'a(' : '(') + r((t[0] - f[0]) * p + f[0]) + ',' + r((t[1] - f[1]) * p + f[1]) + ',' + r((t[2] - f[2]) * p + f[2]) + (f[3] < 0 && t[3] < 0 ? '' : ',' + (f[3] > -1 && t[3] > -1 ? r(((t[3] - f[3]) * p + f[3]) * 10000) / 10000 : t[3] < 0 ? f[3] : t[3])) + ')';
    }
    return '#' + (0x100000000 + (f[3] > -1 && t[3] > -1 ? r(((t[3] - f[3]) * p + f[3]) * 255) : t[3] > -1 ? r(t[3] * 255) : f[3] > -1 ? r(f[3] * 255) : 255) * 0x1000000 + r((t[0] - f[0]) * p + f[0]) * 0x10000 + r((t[1] - f[1]) * p + f[1]) * 0x100 + r((t[2] - f[2]) * p + f[2])).toString(16).slice(f[3] > -1 || t[3] > -1 ? 1 : 3);
  }
  var materialColors = function materialColors(hexColor) {
    if (hexColor === void 0) {
      hexColor = '';
    }
    var theme = themeFromSourceColor(argbFromHex("#" + hexColor.replace('#', '')));
    [0.05, 0.08, 0.11, 0.12, 0.14].forEach(function (amount, index) {
      theme.schemes.light.props["surface" + (index + 1)] = argbFromHex(blend(hexFromArgb(theme.schemes.light.props.surface), hexFromArgb(theme.schemes.light.props.primary), amount));
      theme.schemes.dark.props["surface" + (index + 1)] = argbFromHex(blend(hexFromArgb(theme.schemes.dark.props.surface), hexFromArgb(theme.schemes.dark.props.primary), amount));
    });
    var name = function name(n) {
      return n.split('').map(function (_char) {
        return _char.toUpperCase() === _char && _char !== '-' && _char !== '7' ? "-" + _char.toLowerCase() : _char;
      }).join('');
    };
    var shouldSkip = function shouldSkip(prop) {
      var skip = ['tertiary', 'shadow', 'scrim', 'error', 'background'];
      return skip.filter(function (v) {
        return prop.toLowerCase().includes(v);
      }).length > 0;
    };
    var light = {};
    var dark = {};
    Object.keys(theme.schemes.light.props).forEach(function (prop) {
      if (shouldSkip(prop)) return;
      light[name("--f7-md-" + prop)] = hexFromArgb(theme.schemes.light.props[prop]);
    });
    Object.keys(theme.schemes.dark.props).forEach(function (prop) {
      if (shouldSkip(prop)) return;
      dark[name("--f7-md-" + prop)] = hexFromArgb(theme.schemes.dark.props[prop]);
    });
    return {
      light: light,
      dark: dark
    };
  };

  var _uniqueNumber = 1;
  var Utils = {
    uniqueNumber: function uniqueNumber() {
      _uniqueNumber += 1;
      return _uniqueNumber;
    },
    id: function id(mask, map) {
      if (mask === void 0) {
        mask = 'xxxxxxxxxx';
      }
      if (map === void 0) {
        map = '0123456789abcdef';
      }
      return $.uid(mask, map);
    },
    mdPreloaderContent: "\n\t\t<span class=\"preloader-inner\">\n\t\t\t<svg viewBox=\"0 0 36 36\">\n\t\t\t\t<circle cx=\"18\" cy=\"18\" r=\"16\"></circle>\n\t\t\t</svg>\n    </span>\n  ".trim(),
    iosPreloaderContent: ("\n\t\t<span class=\"preloader-inner\">\n\t\t\t" + [0, 1, 2, 3, 4, 5, 6, 7].map(function () {
      return '<span class="preloader-inner-line"></span>';
    }).join('') + "\n\t\t</span>\n  ").trim(),
    pcPreloaderContent: "\n  <span class=\"preloader-inner\">\n    <span class=\"preloader-inner-circle\"></span>\n  </span>\n",
    eventNameToColonCase: function eventNameToColonCase(eventName) {
      var hasColon;
      return eventName.split('').map(function (_char, index) {
        if (_char.match(/[A-Z]/) && index !== 0 && !hasColon) {
          hasColon = true;
          return ":" + _char.toLowerCase();
        }
        return _char.toLowerCase();
      }).join('');
    },
    deleteProps: function deleteProps(obj) {
      $.deleteProps(obj);
    },
    requestAnimationFrame: function requestAnimationFrame(cb) {
      return $.requestAnimationFrame(cb);
    },
    cancelAnimationFrame: function cancelAnimationFrame(id) {
      return $.cancelAnimationFrame(id);
    },
    nextTick: function nextTick(cb, delay) {
      if (delay === void 0) {
        delay = 0;
      }
      return $.nextTick(cb, delay);
    },
    nextFrame: function nextFrame(cb) {
      return $.nextFrame(cb);
    },
    now: function now() {
      return Date.now();
    },
    parseUrlQuery: function parseUrlQuery(url) {
      return $.urlParam(url);
    },
    getTranslate: function getTranslate(el, axis) {
      if (axis === void 0) {
        axis = 'x';
      }
      return $.getTranslate(el, axis);
    },
    serializeObject: function serializeObject(obj, parents) {
      if (parents === void 0) {
        parents = [];
      }
      if (typeof obj === 'string') return obj;
      var resultArray = [];
      var separator = '&';
      var newParents;
      function varName(name) {
        if (parents.length > 0) {
          var parentParts = '';
          for (var j = 0; j < parents.length; j += 1) {
            if (j === 0) parentParts += parents[j];else parentParts += "[" + encodeURIComponent(parents[j]) + "]";
          }
          return parentParts + "[" + encodeURIComponent(name) + "]";
        }
        return encodeURIComponent(name);
      }
      function varValue(value) {
        return encodeURIComponent(value);
      }
      Object.keys(obj).forEach(function (prop) {
        var toPush;
        if (Array.isArray(obj[prop])) {
          toPush = [];
          for (var i = 0; i < obj[prop].length; i += 1) {
            if (!Array.isArray(obj[prop][i]) && typeof obj[prop][i] === 'object') {
              newParents = parents.slice();
              newParents.push(prop);
              newParents.push(String(i));
              toPush.push(Utils.serializeObject(obj[prop][i], newParents));
            } else {
              toPush.push(varName(prop) + "[]=" + varValue(obj[prop][i]));
            }
          }
          if (toPush.length > 0) resultArray.push(toPush.join(separator));
        } else if (obj[prop] === null || obj[prop] === '') {
          resultArray.push(varName(prop) + "=");
        } else if (typeof obj[prop] === 'object') {
          newParents = parents.slice();
          newParents.push(prop);
          toPush = Utils.serializeObject(obj[prop], newParents);
          if (toPush !== '') resultArray.push(toPush);
        } else if (typeof obj[prop] !== 'undefined' && obj[prop] !== '') {
          resultArray.push(varName(prop) + "=" + varValue(obj[prop]));
        } else if (obj[prop] === '') resultArray.push(varName(prop));
      });
      return resultArray.join(separator);
    },
    isObject: function isObject(o) {
      return typeof o === 'object' && o !== null && o.constructor && o.constructor === Object;
    },
    merge: function merge() {
      var _$;
      return (_$ = $).merge.apply(_$, arguments);
    },
    extend: function extend() {
      var _$2;
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      var to = args[0];
      args.splice(0, 1);
      return (_$2 = $).assign.apply(_$2, [to].concat(args));
    },
    bindMethods: function bindMethods(instance, obj) {
      Object.keys(obj).forEach(function (key) {
        if (Utils.isObject(obj[key])) {
          Object.keys(obj[key]).forEach(function (subKey) {
            if (typeof obj[key][subKey] === 'function') {
              obj[key][subKey] = obj[key][subKey].bind(instance);
            }
          });
        }
        instance[key] = obj[key];
      });
    },
    flattenArray: function (_flattenArray) {
      function flattenArray() {
        return _flattenArray.apply(this, arguments);
      }
      flattenArray.toString = function () {
        return _flattenArray.toString();
      };
      return flattenArray;
    }(function () {
      var arr = [];
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }
      args.forEach(function (arg) {
        if (Array.isArray(arg)) arr.push.apply(arr, flattenArray.apply(void 0, arg));else arr.push(arg);
      });
      return arr;
    }),
    colorHexToRgb: function colorHexToRgb(hex) {
      var h = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, function (m, r, g, b) {
        return r + r + g + g + b + b;
      });
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h);
      return result ? result.slice(1).map(function (n) {
        return parseInt(n, 16);
      }) : null;
    },
    colorRgbToHex: function colorRgbToHex(r, g, b) {
      var result = [r, g, b].map(function (n) {
        var hex = n.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      }).join('');
      return "#" + result;
    },
    colorRgbToHsl: function colorRgbToHsl(r, g, b) {
      r /= 255;
      g /= 255;
      b /= 255;
      var max = Math.max(r, g, b);
      var min = Math.min(r, g, b);
      var d = max - min;
      var h;
      if (d === 0) h = 0;else if (max === r) h = (g - b) / d % 6;else if (max === g) h = (b - r) / d + 2;else if (max === b) h = (r - g) / d + 4;
      var l = (min + max) / 2;
      var s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
      if (h < 0) h = 360 / 60 + h;
      return [h * 60, s, l];
    },
    colorHslToRgb: function colorHslToRgb(h, s, l) {
      var c = (1 - Math.abs(2 * l - 1)) * s;
      var hp = h / 60;
      var x = c * (1 - Math.abs(hp % 2 - 1));
      var rgb1;
      if (Number.isNaN(h) || typeof h === 'undefined') {
        rgb1 = [0, 0, 0];
      } else if (hp <= 1) rgb1 = [c, x, 0];else if (hp <= 2) rgb1 = [x, c, 0];else if (hp <= 3) rgb1 = [0, c, x];else if (hp <= 4) rgb1 = [0, x, c];else if (hp <= 5) rgb1 = [x, 0, c];else if (hp <= 6) rgb1 = [c, 0, x];
      var m = l - c / 2;
      return rgb1.map(function (n) {
        return Math.max(0, Math.min(255, Math.round(255 * (n + m))));
      });
    },
    colorHsbToHsl: function colorHsbToHsl(h, s, b) {
      var HSL = {
        h: h,
        s: 0,
        l: 0
      };
      var HSB = {
        h: h,
        s: s,
        b: b
      };
      HSL.l = (2 - HSB.s) * HSB.b / 2;
      HSL.s = HSL.l && HSL.l < 1 ? HSB.s * HSB.b / (HSL.l < 0.5 ? HSL.l * 2 : 2 - HSL.l * 2) : HSL.s;
      return [HSL.h, HSL.s, HSL.l];
    },
    colorHslToHsb: function colorHslToHsb(h, s, l) {
      var HSB = {
        h: h,
        s: 0,
        b: 0
      };
      var HSL = {
        h: h,
        s: s,
        l: l
      };
      var t = HSL.s * (HSL.l < 0.5 ? HSL.l : 1 - HSL.l);
      HSB.b = HSL.l + t;
      HSB.s = HSL.l > 0 ? 2 * t / HSB.b : HSB.s;
      return [HSB.h, HSB.s, HSB.b];
    },
    getShadeTintColors: function getShadeTintColors(rgb) {
      var hsl = Utils.colorRgbToHsl.apply(Utils, rgb);
      var hslShade = [hsl[0], hsl[1], Math.max(0, hsl[2] - 0.08)];
      var hslTint = [hsl[0], hsl[1], Math.max(0, hsl[2] + 0.08)];
      var shade = Utils.colorRgbToHex.apply(Utils, Utils.colorHslToRgb.apply(Utils, hslShade));
      var tint = Utils.colorRgbToHex.apply(Utils, Utils.colorHslToRgb.apply(Utils, hslTint));
      return {
        shade: shade,
        tint: tint
      };
    },
    colorThemeCSSProperties: function colorThemeCSSProperties() {
      var hex;
      var rgb;
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }
      if (args.length === 1) {
        hex = args[0];
        rgb = Utils.colorHexToRgb(hex);
      } else if (args.length === 3) {
        rgb = args;
        hex = Utils.colorRgbToHex.apply(Utils, rgb);
      }
      if (!rgb) return {};
      var _materialColors = materialColors(hex),
        light = _materialColors.light,
        dark = _materialColors.dark;
      var shadeTintIos = Utils.getShadeTintColors(rgb);
      var shadeTintMdLight = Utils.getShadeTintColors(Utils.colorHexToRgb(light['--f7-md-primary']));
      var shadeTintMdDark = Utils.getShadeTintColors(Utils.colorHexToRgb(dark['--f7-md-primary']));
      Object.keys(light).forEach(function (key) {
        if (key.includes('surface-')) {
          light[key + "-rgb"] = Utils.colorHexToRgb(light[key]);
        }
      });
      Object.keys(dark).forEach(function (key) {
        if (key.includes('surface-')) {
          dark[key + "-rgb"] = Utils.colorHexToRgb(dark[key]);
        }
      });
      return {
        ios: {
          '--f7-theme-color': 'var(--f7-ios-primary)',
          '--f7-theme-color-rgb': 'var(--f7-ios-primary-rgb)',
          '--f7-theme-color-shade': 'var(--f7-ios-primary-shade)',
          '--f7-theme-color-tint': 'var(--f7-ios-primary-tint)'
        },
        md: {
          '--f7-theme-color': 'var(--f7-md-primary)',
          '--f7-theme-color-rgb': 'var(--f7-md-primary-rgb)',
          '--f7-theme-color-shade': 'var(--f7-md-primary-shade)',
          '--f7-theme-color-tint': 'var(--f7-md-primary-tint)'
        },
        light: _extends({
          '--f7-ios-primary': hex,
          '--f7-ios-primary-shade': shadeTintIos.shade,
          '--f7-ios-primary-tint': shadeTintIos.tint,
          '--f7-ios-primary-rgb': rgb.join(', '),
          '--f7-md-primary-shade': shadeTintMdLight.shade,
          '--f7-md-primary-tint': shadeTintMdLight.tint,
          '--f7-md-primary-rgb': Utils.colorHexToRgb(light['--f7-md-primary']).join(', ')
        }, light),
        dark: _extends({
          '--f7-md-primary-shade': shadeTintMdDark.shade,
          '--f7-md-primary-tint': shadeTintMdDark.tint,
          '--f7-md-primary-rgb': Utils.colorHexToRgb(dark['--f7-md-primary']).join(', ')
        }, dark)
      };
    },
    colorThemeCSSStyles: function colorThemeCSSStyles(colors) {
      if (colors === void 0) {
        colors = {};
      }
      var stringifyObject = function stringifyObject(obj) {
        var res = '';
        Object.keys(obj).forEach(function (key) {
          res += key + ":" + obj[key] + ";";
        });
        return res;
      };
      var colorVars = Utils.colorThemeCSSProperties(colors.primary);
      var primary = [":root{", stringifyObject(colorVars.light), "--swiper-theme-color:var(--f7-theme-color);"].concat(Object.keys(colors).map(function (colorName) {
        return "--f7-color-" + colorName + ": " + colors[colorName] + ";";
      }), ["}", ".dark{", stringifyObject(colorVars.dark), "}", ".ios, .ios .dark{", stringifyObject(colorVars.ios), '}', ".md, .md .dark{", stringifyObject(colorVars.md), '}']).join('');
      var restVars = {};
      Object.keys(colors).forEach(function (colorName) {
        var colorValue = colors[colorName];
        restVars[colorName] = Utils.colorThemeCSSProperties(colorValue);
      });
      var rest = '';
      Object.keys(colors).forEach(function (colorName) {
        var _restVars$colorName = restVars[colorName],
          light = _restVars$colorName.light,
          dark = _restVars$colorName.dark,
          ios = _restVars$colorName.ios,
          md = _restVars$colorName.md;
        var whiteColorVars = "\n\t\t\t--f7-ios-primary: #ffffff;\n\t\t\t--f7-ios-primary-shade: #ebebeb;\n\t\t\t--f7-ios-primary-tint: #ffffff;\n\t\t\t--f7-ios-primary-rgb: 255, 255, 255;\n\t\t\t--f7-md-primary-shade: #eee;\n\t\t\t--f7-md-primary-tint: #fff;\n\t\t\t--f7-md-primary-rgb: 255, 255, 255;\n\t\t\t--f7-md-primary: #fff;\n\t\t\t--f7-md-on-primary: #000;\n\t\t\t--f7-md-primary-container: #fff;\n\t\t\t--f7-md-on-primary-container: #000;\n\t\t\t--f7-md-secondary: #fff;\n\t\t\t--f7-md-on-secondary: #000;\n\t\t\t--f7-md-secondary-container: #555;\n\t\t\t--f7-md-on-secondary-container: #fff;\n\t\t\t--f7-md-surface: #fff;\n\t\t\t--f7-md-on-surface: #000;\n\t\t\t--f7-md-surface-variant: #333;\n\t\t\t--f7-md-on-surface-variant: #fff;\n\t\t\t--f7-md-outline: #fff;\n\t\t\t--f7-md-outline-variant: #fff;\n\t\t\t--f7-md-inverse-surface: #000;\n\t\t\t--f7-md-inverse-on-surface: #fff;\n\t\t\t--f7-md-inverse-primary: #000;\n\t\t\t--f7-md-surface-1: #f8f8f8;\n\t\t\t--f7-md-surface-2: #f1f1f1;\n\t\t\t--f7-md-surface-3: #e7e7e7;\n\t\t\t--f7-md-surface-4: #e1e1e1;\n\t\t\t--f7-md-surface-5: #d7d7d7;\n\t\t\t--f7-md-surface-variant-rgb: 51, 51, 51;\n\t\t\t--f7-md-on-surface-variant-rgb: 255, 255, 255;\n\t\t\t--f7-md-surface-1-rgb: 248, 248, 248;\n\t\t\t--f7-md-surface-2-rgb: 241, 241, 241;\n\t\t\t--f7-md-surface-3-rgb: 231, 231, 231;\n\t\t\t--f7-md-surface-4-rgb: 225, 225, 225;\n\t\t\t--f7-md-surface-5-rgb: 215, 215, 215;\n\t\t\t";
        var blackColorVars = "\n\t\t\t--f7-ios-primary: #000;\n\t\t\t--f7-ios-primary-shade: #000;\n\t\t\t--f7-ios-primary-tint: #232323;\n\t\t\t--f7-ios-primary-rgb: 0, 0, 0;\n\t\t\t--f7-md-primary-shade: #000;\n\t\t\t--f7-md-primary-tint: #232323;\n\t\t\t--f7-md-primary-rgb: 0, 0, 0;\n\t\t\t--f7-md-primary: #000;\n\t\t\t--f7-md-on-primary: #fff;\n\t\t\t--f7-md-primary-container: #000;\n\t\t\t--f7-md-on-primary-container: #fff;\n\t\t\t--f7-md-secondary: #000;\n\t\t\t--f7-md-on-secondary: #fff;\n\t\t\t--f7-md-secondary-container: #aaa;\n\t\t\t--f7-md-on-secondary-container: #000;\n\t\t\t--f7-md-surface: #000;\n\t\t\t--f7-md-on-surface: #fff;\n\t\t\t--f7-md-surface-variant: #ccc;\n\t\t\t--f7-md-on-surface-variant: #000;\n\t\t\t--f7-md-outline: #000;\n\t\t\t--f7-md-outline-variant: #000;\n\t\t\t--f7-md-inverse-surface: #fff;\n\t\t\t--f7-md-inverse-on-surface: #000;\n\t\t\t--f7-md-inverse-primary: #fff;\n\t\t\t--f7-md-surface-1: #070707;\n\t\t\t--f7-md-surface-2: #161616;\n\t\t\t--f7-md-surface-3: #232323;\n\t\t\t--f7-md-surface-4: #303030;\n\t\t\t--f7-md-surface-5: #373737;\n\t\t\t--f7-md-surface-variant-rgb: 204, 204, 204;\n\t\t\t--f7-md-on-surface-variant-rgb: 0, 0, 0;\n\t\t\t--f7-md-surface-1-rgb: 7, 7, 7;\n\t\t\t--f7-md-surface-2-rgb: 22, 22, 22;\n\t\t\t--f7-md-surface-3-rgb: 35, 35, 35;\n\t\t\t--f7-md-surface-4-rgb: 48, 48, 48;\n\t\t\t--f7-md-surface-5-rgb: 55, 55, 55;\n\t\t\t";
        var lightString = colorName === 'white' ? whiteColorVars : colorName === 'black' ? blackColorVars : stringifyObject(light);
        var darkString = colorName === 'white' ? whiteColorVars : colorName === 'black' ? blackColorVars : stringifyObject(dark);
        rest += [".color-" + colorName + " {", lightString, "--swiper-theme-color: var(--f7-theme-color);", "}", ".color-" + colorName + ".dark, .color-" + colorName + " .dark, .dark .color-" + colorName + " {", darkString, "--swiper-theme-color: var(--f7-theme-color);", "}", ".ios .color-" + colorName + ", .ios.color-" + colorName + ", .ios .dark .color-" + colorName + ", .ios .dark.color-" + colorName + " {", stringifyObject(ios), "}", ".md .color-" + colorName + ", .md.color-" + colorName + ", .md .dark .color-" + colorName + ", .md .dark.color-" + colorName + " {", stringifyObject(md), "}", ".text-color-" + colorName + " {", "--f7-theme-color-text-color: " + colors[colorName] + ";", "}", ".bg-color-" + colorName + " {", "--f7-theme-color-bg-color: " + colors[colorName] + ";", "}", ".border-color-" + colorName + " {", "--f7-theme-color-border-color: " + colors[colorName] + ";", "}", ".ripple-color-" + colorName + " {", "--f7-theme-color-ripple-color: rgba(" + light['--f7-ios-primary-rgb'] + ", 0.3);", "}"].join('');
      });
      return "" + primary + rest;
    }
  };

  var Event = function () {
    function Event(params, parents, pre) {
      if (params === void 0) {
        params = {};
      }
      if (parents === void 0) {
        parents = [];
      }
      if (pre === void 0) {
        pre = '';
      }
      var m = this;
      m.params = params;
      if (parents) {
        if (!Array.isArray(parents)) m.eventsParents = [parents];else m.eventsParents = parents.filter(function (p) {
          return p;
        });
      } else m.eventsParents = [];
      m.eventsListeners = {};
      m.pre = pre;
      if (m.params && m.params.on) {
        Object.keys(m.params.on).forEach(function (eventName) {
          m.on(eventName, m.params.on[eventName]);
        });
      }
    }
    var _proto = Event.prototype;
    _proto.on = function on(events, handler, priority) {
      if (priority === void 0) {
        priority = false;
      }
      var m = this;
      if (typeof handler !== 'function') return m;
      var method = priority ? 'unshift' : 'push';
      events.split(' ').forEach(function (event) {
        var lis = {
          owner: '',
          appName: '',
          handler: handler
        };
        if (event.includes('app::')) {
          var page = null;
          if ($.isPage(m)) page = m;else if ($.isPage(m == null ? void 0 : m.page)) page = m.page;else if ($.isPage(m == null ? void 0 : m.parent)) page = m.parent;
          if (page && page.app && $.isApp(page.app)) {
            lis.owner = page.owner;
            lis.appName = page.appName;
            var _page = page,
              app = _page.app;
            var ev = event.replace('app::', '');
            if (!app.eventsListeners[ev]) app.eventsListeners[ev] = [];
            app.eventsListeners[ev][method](lis);
          }
        } else {
          if (!m.eventsListeners[event]) m.eventsListeners[event] = [];
          m.eventsListeners[event][method](lis);
        }
      });
      return m;
    };
    _proto.once = function once(events, handler, priority) {
      if (priority === void 0) {
        priority = false;
      }
      var m = this;
      if (typeof handler !== 'function') return m;
      function onceHandler() {
        m.off(events, onceHandler);
        if (onceHandler.proxy) {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          onceHandler.proxy.apply(m, args);
          delete onceHandler.proxy;
        }
      }
      onceHandler.proxy = handler;
      return m.on(events, onceHandler, priority);
    };
    _proto.off = function off(events, handler) {
      var m = this;
      if (!m.eventsListeners) return m;
      if (events) {
        events.split(' ').forEach(function (event) {
          if (typeof handler === 'undefined') m.eventsListeners[event] = [];else if (m.eventsListeners[event]) {
            var arr = m.eventsListeners[event];
            for (var i = arr.length - 1; i >= 0; i--) {
              var _lis$handler;
              var lis = arr[i];
              if (lis.handler === handler || ((_lis$handler = lis.handler) == null ? void 0 : _lis$handler.proxy) === handler) arr.splice(i, 1);
            }
          }
        });
      } else m.eventsListeners = {};
      return m;
    };
    _proto.emit = function emit() {
      var _eventsParents;
      var m = this;
      if (!m.eventsListeners) return m;
      var events;
      var data;
      var context;
      var eventsParents;
      var pop = false;
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }
      var event = args[0];
      if (!event) return m;
      if (typeof event === 'string' || Array.isArray(event)) {
        event = event.split(' ');
        if (m.pre) {
          events = [];
          event.forEach(function (ev) {
            events.push("." + ev);
            events.push("" + m.pre + ev[0].toUpperCase() + ev.substr(1));
          });
        } else events = event;
        data = args.slice(1, args.length);
        context = m;
        eventsParents = m.eventsParents;
      } else {
        pop = event.pop;
        events = event.events;
        data = event.data;
        context = event.context || m;
        eventsParents = event.local ? [] : event.parents || m.eventsParents;
      }
      var eventsArray = Array.isArray(events) ? events : events.split(' ');
      var selfEvents = eventsArray.map(function (ev) {
        return ev.replace(/local::|^[.]/, '');
      });
      var parentEvents = null;
      if (pop) parentEvents = event;else {
        var popEvents = eventsArray.filter(function (ev) {
          return !ev.match(/^local::|^[.]/);
        });
        if (popEvents != null && popEvents.length) {
          parentEvents = {
            pop: true,
            events: popEvents,
            context: m,
            data: data,
            owner: '',
            appName: ''
          };
        }
      }
      if (parentEvents && $.isPage(m)) {
        parentEvents.owner = m == null ? void 0 : m.owner;
        parentEvents.appName = m == null ? void 0 : m.appName;
      }
      selfEvents.forEach(function (ev) {
        if (m.eventsListeners && m.eventsListeners[ev]) {
          var handlers = [];
          m.eventsListeners[ev].forEach(function (lis) {
            if (lis.owner && lis.appName) {
              if (pop && lis.owner === ev.owner && lis.appName === ev.appName) handlers.push(lis.handler);
            } else handlers.push(lis.handler);
          });
          handlers.forEach(function (fn) {
            fn.apply(context, data);
          });
        }
      });
      if (parentEvents && ((_eventsParents = eventsParents) == null ? void 0 : _eventsParents.length) > 0) {
        eventsParents.forEach(function (eventsParent) {
          return eventsParent.emit(parentEvents);
        });
      }
      return m;
    };
    return Event;
  }();

  var Page = function (_Event) {
    _inheritsLoose(Page, _Event);
    function Page(app, name, title, style) {
      var _this;
      _this = _Event.call(this, null, [app]) || this;
      _this.app = app;
      _this.cfg = app.cfg;
      _this.name = name;
      _this.title = title;
      _this.style = style || "./page/" + name + ".css";
      _this.owner = '';
      _this.appName = '';
      _this.path = '';
      _this.view = null;
      _this.dom = null;
      _this.$el = null;
      _this.el = null;
      _this.html = '';
      _this.css = '';
      _this.js = '';
      _this.data = {};
      _this.param = {};
      return _this;
    }
    var _proto = Page.prototype;
    _proto.load = function load(param) {
      this.emit('local::load pageLoad', param);
      this.emit('pageLoad', this);
    };
    _proto.ready = function ready(view, param, back) {
      this.init();
      this.emit('local::ready', view, param, back);
      this.emit('pageReady', this);
    };
    _proto.init = function init(v) {
      var view = this.view;
      v = v ? $(v) : view;
    };
    _proto.show = function show(view, param) {
      view.qus('[name$=-tp]').hide();
      view.qus('a[href=""]').attr('href', 'javascript:;');
      if (this.reset) this.reset();
      this.emit('local::show', view, param);
      this.emit('pageShow', this);
    };
    _proto.back = function back(view, param) {
      view.qus('[name$=-tp]').hide();
      view.qus('a[href=""]').attr('href', 'javascript:;');
      this.emit('local::back', view, param);
      this.emit('pageBack', this);
    };
    _proto.hide = function hide(view) {
      this.emit('local::hide', view);
      this.emit('pageHide', this);
    };
    _proto.unload = function unload(view) {
      this.emit('local::unload', view);
      this.emit('pageUnload', this);
    };
    return Page;
  }(Event);

  var Module = function (_Event) {
    _inheritsLoose(Module, _Event);
    function Module(params, parents) {
      var _this;
      if (params === void 0) {
        params = {};
      }
      if (parents === void 0) {
        parents = [];
      }
      _this = _Event.call(this, params, parents) || this;
      var self = _assertThisInitialized(_this);
      self.params = params;
      return _this;
    }
    var _proto = Module.prototype;
    _proto.useModuleParams = function useModuleParams(module, instanceParams) {
      if (module.params) {
        var originalParams = {};
        Object.keys(module.params).forEach(function (paramKey) {
          if (typeof instanceParams[paramKey] === 'undefined') return;
          originalParams[paramKey] = $.extend({}, instanceParams[paramKey]);
        });
        $.extend(instanceParams, module.params);
        Object.keys(originalParams).forEach(function (paramKey) {
          $.extend(instanceParams[paramKey], originalParams[paramKey]);
        });
      }
    };
    _proto.useModulesParams = function useModulesParams(instanceParams) {
      var instance = this;
      if (!instance.modules) return;
      Object.keys(instance.modules).forEach(function (moduleName) {
        var module = instance.modules[moduleName];
        if (module.params) {
          $.extend(instanceParams, module.params);
        }
      });
    };
    _proto.useModule = function useModule(moduleName, moduleParams) {
      if (moduleName === void 0) {
        moduleName = '';
      }
      if (moduleParams === void 0) {
        moduleParams = {};
      }
      var instance = this;
      if (!instance.modules) return;
      var module = typeof moduleName === 'string' ? instance.modules[moduleName] : moduleName;
      if (!module) return;
      if (module.instance) {
        Object.keys(module.instance).forEach(function (modulePropName) {
          var moduleProp = module.instance[modulePropName];
          if (typeof moduleProp === 'function') {
            instance[modulePropName] = moduleProp.bind(instance);
          } else {
            instance[modulePropName] = moduleProp;
          }
        });
      }
      if (module.on && instance.on) {
        Object.keys(module.on).forEach(function (moduleEventName) {
          instance.on(moduleEventName, module.on[moduleEventName]);
        });
      }
      if (module.vnode) {
        if (!instance.vnodeHooks) instance.vnodeHooks = {};
        Object.keys(module.vnode).forEach(function (vnodeId) {
          Object.keys(module.vnode[vnodeId]).forEach(function (hookName) {
            var handler = module.vnode[vnodeId][hookName];
            if (!instance.vnodeHooks[hookName]) instance.vnodeHooks[hookName] = {};
            if (!instance.vnodeHooks[hookName][vnodeId]) instance.vnodeHooks[hookName][vnodeId] = [];
            instance.vnodeHooks[hookName][vnodeId].push(handler.bind(instance));
          });
        });
      }
      if (module.create) {
        module.create.bind(instance)(moduleParams);
      }
    };
    _proto.useModules = function useModules(modulesParams) {
      if (modulesParams === void 0) {
        modulesParams = {};
      }
      var instance = this;
      if (!instance.modules) return;
      Object.keys(instance.modules).forEach(function (moduleName) {
        var moduleParams = modulesParams[moduleName] || {};
        instance.useModule(moduleName, moduleParams);
      });
    };
    Module.installModule = function installModule(module) {
      var Class = this;
      if (!Class.prototype.modules) Class.prototype.modules = {};
      var name = module.name || Object.keys(Class.prototype.modules).length + "_" + $.now();
      Class.prototype.modules[name] = module;
      if (module.proto) {
        Object.keys(module.proto).forEach(function (key) {
          Class.prototype[key] = module.proto[key];
        });
      }
      if (module["static"]) {
        Object.keys(module["static"]).forEach(function (key) {
          Class[key] = module["static"][key];
        });
      }
      if (module.install) {
        for (var _len = arguments.length, params = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          params[_key - 1] = arguments[_key];
        }
        module.install.apply(Class, params);
      }
      return Class;
    };
    Module.use = function use(module) {
      var Class = this;
      if (Array.isArray(module)) {
        module.forEach(function (m) {
          return Class.installModule(m);
        });
        return Class;
      }
      for (var _len2 = arguments.length, params = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        params[_key2 - 1] = arguments[_key2];
      }
      return Class.installModule.apply(Class, [module].concat(params));
    };
    _createClass(Module, null, [{
      key: "components",
      set: function set(components) {
        var Class = this;
        if (!Class.use) return;
        Class.use(components);
      }
    }]);
    return Module;
  }(Event);

  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
      Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _construct(Parent, args, Class) {
    if (_isNativeReflectConstruct()) {
      _construct = Reflect.construct.bind();
    } else {
      _construct = function _construct(Parent, args, Class) {
        var a = [null];
        a.push.apply(a, args);
        var Constructor = Function.bind.apply(Parent, a);
        var instance = new Constructor();
        if (Class) _setPrototypeOf(instance, Class.prototype);
        return instance;
      };
    }
    return _construct.apply(null, arguments);
  }

  function Constructors(parameters) {
    if (parameters === void 0) {
      parameters = {};
    }
    var _parameters = parameters,
      defaultSelector = _parameters.defaultSelector,
      Constructor = _parameters.constructor,
      domProp = _parameters.domProp,
      app = _parameters.app,
      addMethods = _parameters.addMethods;
    var methods = {
      create: function create() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        if (app) return _construct(Constructor, [app].concat(args));
        return _construct(Constructor, args);
      },
      get: function get(el) {
        if (el === void 0) {
          el = defaultSelector;
        }
        if (el instanceof Constructor) return el;
        var $el = $(el);
        if ($el.length === 0) return undefined;
        return $el[0][domProp];
      },
      destroy: function destroy(el) {
        var instance = methods.get(el);
        if (instance && instance.destroy) return instance.destroy();
        return undefined;
      }
    };
    if (addMethods && Array.isArray(addMethods)) {
      addMethods.forEach(function (methodName) {
        methods[methodName] = function (el) {
          if (el === void 0) {
            el = defaultSelector;
          }
          var instance = methods.get(el);
          for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            args[_key2 - 1] = arguments[_key2];
          }
          if (instance && instance[methodName]) return instance[methodName].apply(instance, args);
          return undefined;
        };
      });
    }
    return methods;
  }

  function Modals(parameters) {
    if (parameters === void 0) {
      parameters = {};
    }
    var _parameters = parameters,
      defaultSelector = _parameters.defaultSelector,
      Constructor = _parameters.constructor,
      app = _parameters.app;
    var methods = $.extend(Constructors({
      defaultSelector: defaultSelector,
      constructor: Constructor,
      app: app,
      domProp: 'f7Modal'
    }), {
      open: function open(el, animate, targetEl) {
        var $el = $(el);
        if ($el.length > 1 && targetEl) {
          var $targetPage = $(targetEl).parents('.page');
          if ($targetPage.length) {
            $el.each(function (modalEl) {
              var $modalEl = $(modalEl);
              if ($modalEl.parents($targetPage)[0] === $targetPage[0]) {
                $el = $modalEl;
              }
            });
          }
        }
        if ($el.length > 1) {
          $el = $el.eq($el.length - 1);
        }
        if (!$el.length) return undefined;
        var instance = $el[0].f7Modal;
        if (!instance) {
          var params = $el.dataset();
          instance = new Constructor(app, _extends({
            el: $el
          }, params));
        }
        return instance.open(animate);
      },
      close: function close(el, animate, targetEl) {
        if (el === void 0) {
          el = defaultSelector;
        }
        var $el = $(el);
        if (!$el.length) return undefined;
        if ($el.length > 1) {
          var $parentEl;
          if (targetEl) {
            var $targetEl = $(targetEl);
            if ($targetEl.length) {
              $parentEl = $targetEl.parents($el);
            }
          }
          if ($parentEl && $parentEl.length > 0) {
            $el = $parentEl;
          } else {
            $el = $el.eq($el.length - 1);
          }
        }
        var instance = $el[0].f7Modal;
        if (!instance) {
          var params = $el.dataset();
          instance = new Constructor(app, _extends({
            el: $el
          }, params));
        }
        return instance.close(animate);
      }
    });
    return methods;
  }

  var fetchedModules = [];
  function loadModule(moduleToLoad) {
    var App = this;
    return new Promise(function (resolve, reject) {
      var app = App.instance;
      var modulePath;
      var moduleObj;
      var moduleFunc;
      if (!moduleToLoad) {
        reject(new Error('Wia: Lazy module must be specified'));
        return;
      }
      function install(module) {
        App.use(module);
        if (app) {
          app.useModuleParams(module, app.params);
          app.useModule(module);
        }
      }
      if (typeof moduleToLoad === 'string') {
        var matchNamePattern = moduleToLoad.match(/([a-z0-9-]*)/i);
        if (moduleToLoad.indexOf('.') < 0 && matchNamePattern && matchNamePattern[0].length === moduleToLoad.length) {
          if (!app || app && !app.params.lazyModulesPath) {
            reject(new Error('Wia: "lazyModulesPath" app parameter must be specified to fetch module by name'));
            return;
          }
          modulePath = app.params.lazyModulesPath + "/" + moduleToLoad + ".js";
        } else {
          modulePath = moduleToLoad;
        }
      } else if (typeof moduleToLoad === 'function') {
        moduleFunc = moduleToLoad;
      } else {
        moduleObj = moduleToLoad;
      }
      if (moduleFunc) {
        var module = moduleFunc(App, false);
        if (!module) {
          reject(new Error("Wia: Can't find Wia component in specified component function"));
          return;
        }
        if (App.prototype.modules && App.prototype.modules[module.name]) {
          resolve();
          return;
        }
        install(module);
        resolve();
      }
      if (moduleObj) {
        var _module = moduleObj;
        if (!_module) {
          reject(new Error("Wia: Can't find Wia component in specified component"));
          return;
        }
        if (App.prototype.modules && App.prototype.modules[_module.name]) {
          resolve();
          return;
        }
        install(_module);
        resolve();
      }
      if (modulePath) {
        if (fetchedModules.indexOf(modulePath) >= 0) {
          resolve();
          return;
        }
        fetchedModules.push(modulePath);
        var scriptLoad = new Promise(function (resolveScript, rejectScript) {
          App.request.get(modulePath, function (scriptContent) {
            var id = $.id();
            var callbackLoadName = "wia_component_loader_callback_" + id;
            var scriptEl = document.createElement('script');
            scriptEl.innerHTML = "window." + callbackLoadName + " = function (Wia, WiaAutoInstallComponent) {return " + scriptContent.trim() + "}";
            $('head').append(scriptEl);
            var componentLoader = window[callbackLoadName];
            delete window[callbackLoadName];
            $(scriptEl).remove();
            var module = componentLoader(App, false);
            if (!module) {
              rejectScript(new Error("Wia: Can't find Wia component in " + modulePath + " file"));
              return;
            }
            if (App.prototype.modules && App.prototype.modules[module.name]) {
              resolveScript();
              return;
            }
            install(module);
            resolveScript();
          }, function (xhr, status) {
            rejectScript(xhr, status);
          });
        });
        var styleLoad = new Promise(function (resolveStyle) {
          App.request.get(modulePath.replace('.js', app.rtl ? '.rtl.css' : '.css'), function (styleContent) {
            var styleEl = document.createElement('style');
            styleEl.innerHTML = styleContent;
            $('head').append(styleEl);
            resolveStyle();
          }, function () {
            resolveStyle();
          });
        });
        Promise.all([scriptLoad, styleLoad]).then(function () {
          resolve();
        })["catch"](function (err) {
          reject(err);
        });
      }
    });
  }

  function jsx(tag, props) {
    var attrs = props || {};
    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }
    var children = args || [];
    var attrsString = Object.keys(attrs).map(function (attr) {
      if (attr[0] === '_') {
        if (attrs[attr]) return attr.replace('_', '');
        return '';
      }
      return attr + "=\"" + attrs[attr] + "\"";
    }).filter(function (attr) {
      return !!attr;
    }).join(' ');
    if (['path', 'img', 'circle', 'polygon', 'line', 'input'].indexOf(tag) >= 0) {
      return ("<" + tag + " " + attrsString + " />").trim();
    }
    var childrenContent = children.filter(function (c) {
      return !!c;
    }).map(function (c) {
      return Array.isArray(c) ? c.join('') : c;
    }).join('');
    return ("<" + tag + " " + attrsString + ">" + childrenContent + "</" + tag + ">").trim();
  }

  var Resize = {
    name: 'resize',
    instance: {
      getSize: function getSize() {
        var app = this;
        if (!app.root[0]) return {
          width: 0,
          height: 0,
          left: 0,
          top: 0
        };
        var offset = app.root.offset();
        var _ref = [app.root[0].offsetWidth, app.root[0].offsetHeight, offset.left, offset.top],
          width = _ref[0],
          height = _ref[1],
          left = _ref[2],
          top = _ref[3];
        app.width = width;
        app.height = height;
        app.left = left;
        app.top = top;
        return {
          width: width,
          height: height,
          left: left,
          top: top
        };
      }
    },
    on: {
      init: function init() {
        var app = this;
        app.getSize();
        window.addEventListener('resize', function () {
          app.emit('resize');
        }, false);
        window.addEventListener('orientationchange', function () {
          app.emit('orientationchange');
        });
      },
      orientationchange: function orientationchange() {
        var app = this;
        if (app.device.ipad) {
          document.body.scrollLeft = 0;
          setTimeout(function () {
            document.body.scrollLeft = 0;
          }, 0);
        }
      },
      resize: function resize() {
        var app = this;
        app.getSize();
      }
    }
  };

  function bindClick(cb) {
    var touchStartX;
    var touchStartY;
    function touchStart(ev) {
      touchStartX = ev.changedTouches[0].clientX;
      touchStartY = ev.changedTouches[0].clientY;
    }
    function touchEnd(ev) {
      var x = Math.abs(ev.changedTouches[0].clientX - touchStartX);
      var y = Math.abs(ev.changedTouches[0].clientY - touchStartY);
      if (x <= 5 && y <= 5) {
        cb.call(this, ev);
      }
    }
    if ($.support.touch) {
      document.addEventListener('touchstart', touchStart, true);
      document.addEventListener('touchend', touchEnd, true);
    } else {
      document.addEventListener('click', cb, true);
    }
  }
  function initClicks(app) {
    function appClick(ev) {
      app.emit({
        events: 'click',
        data: [ev]
      });
    }
    function handleClicks(e) {
      var $clickedEl = $(e.target);
      var $clickedLinkEl = $clickedEl.closest('a');
      var isLink = $clickedLinkEl.length > 0;
      isLink && $clickedLinkEl.attr('href');
      Object.keys(app.modules).forEach(function (moduleName) {
        var moduleClicks = app.modules[moduleName].clicks;
        if (!moduleClicks) return;
        if (e.preventF7Router) return;
        Object.keys(moduleClicks).forEach(function (clickSelector) {
          var matchingClickedElement = $clickedEl.closest(clickSelector).eq(0);
          if (matchingClickedElement.length > 0) {
            moduleClicks[clickSelector].call(app, matchingClickedElement, matchingClickedElement.dataset(), e);
          }
        });
      });
    }
    bindClick(appClick);
    app.on('click', handleClicks);
  }
  var Click = {
    name: 'clicks',
    params: {
      clicks: {
        externalLinks: '.ext'
      }
    },
    on: {
      init: function init() {
        var app = this;
        initClicks(app);
      }
    }
  };

  var extend$1 = Utils.extend;
  var _$$1 = $,
    device$1 = _$$1.device,
    support$1 = _$$1.support;
  function initTouch() {
    var app = this;
    var params = app.params.touch;
    var useRipple = params[app.theme + "TouchRipple"];
    if (device$1.ios && device$1.webView) {
      window.addEventListener('touchstart', function () {});
    }
    var touchStartX;
    var touchStartY;
    var targetElement;
    var isMoved;
    var tapHoldFired;
    var tapHoldTimeout;
    var preventClick;
    var activableElement;
    var activeTimeout;
    var rippleWave;
    var rippleTarget;
    var rippleTimeout;
    function findActivableElement(el) {
      var target = $(el);
      var parents = target.parents(params.activeStateElements);
      if (target.closest('.no-active-state').length) {
        return null;
      }
      var activable;
      if (target.is(params.activeStateElements)) {
        activable = target;
      }
      if (parents.length > 0) {
        activable = activable ? activable.add(parents) : parents;
      }
      if (activable && activable.length > 1) {
        var newActivable = [];
        var preventPropagation;
        for (var i = 0; i < activable.length; i += 1) {
          if (!preventPropagation) {
            newActivable.push(activable[i]);
            if (activable.eq(i).hasClass('prevent-active-state-propagation') || activable.eq(i).hasClass('no-active-state-propagation')) {
              preventPropagation = true;
            }
          }
        }
        activable = $(newActivable);
      }
      return activable || target;
    }
    function isInsideScrollableView(el) {
      var pageContent = el.parents('.page-content');
      return pageContent.length > 0;
    }
    function addActive() {
      if (!activableElement) return;
      activableElement.addClass('active-state');
    }
    function removeActive() {
      if (!activableElement) return;
      activableElement.removeClass('active-state');
      activableElement = null;
    }
    function findRippleElement(el) {
      var rippleElements = params.touchRippleElements;
      var $el = $(el);
      if ($el.is(rippleElements)) {
        if ($el.hasClass('no-ripple')) {
          return false;
        }
        return $el;
      }
      if ($el.parents(rippleElements).length > 0) {
        var rippleParent = $el.parents(rippleElements).eq(0);
        if (rippleParent.hasClass('no-ripple')) {
          return false;
        }
        return rippleParent;
      }
      return false;
    }
    function createRipple($el, x, y) {
      if (!$el) return;
      rippleWave = app.touchRipple.create(app, $el, x, y);
    }
    function removeRipple() {
      if (!rippleWave) return;
      rippleWave.remove();
      rippleWave = undefined;
      rippleTarget = undefined;
    }
    function rippleTouchStart(el) {
      rippleTarget = findRippleElement(el);
      if (!rippleTarget || rippleTarget.length === 0) {
        rippleTarget = undefined;
        return;
      }
      var inScrollable = isInsideScrollableView(rippleTarget);
      if (!inScrollable) {
        removeRipple();
        createRipple(rippleTarget, touchStartX, touchStartY);
      } else {
        clearTimeout(rippleTimeout);
        rippleTimeout = setTimeout(function () {
          removeRipple();
          createRipple(rippleTarget, touchStartX, touchStartY);
        }, 80);
      }
    }
    function rippleTouchMove() {
      clearTimeout(rippleTimeout);
      removeRipple();
    }
    function rippleTouchEnd() {
      if (!rippleWave && rippleTarget && !isMoved) {
        clearTimeout(rippleTimeout);
        createRipple(rippleTarget, touchStartX, touchStartY);
        setTimeout(removeRipple, 0);
      } else {
        removeRipple();
      }
    }
    function handleMouseDown(e) {
      var $activableEl = findActivableElement(e.target);
      if ($activableEl) {
        $activableEl.addClass('active-state');
        if ('which' in e && e.which === 3) {
          setTimeout(function () {
            $('.active-state').removeClass('active-state');
          }, 0);
        }
      }
      if (useRipple) {
        touchStartX = e.pageX;
        touchStartY = e.pageY;
        rippleTouchStart(e.target, e.pageX, e.pageY);
      }
    }
    function handleMouseMove() {
      if (!params.activeStateOnMouseMove) {
        $('.active-state').removeClass('active-state');
      }
      if (useRipple) {
        rippleTouchMove();
      }
    }
    function handleMouseUp() {
      $('.active-state').removeClass('active-state');
      if (useRipple) {
        rippleTouchEnd();
      }
    }
    function handleTouchCancel() {
      targetElement = null;
      clearTimeout(activeTimeout);
      clearTimeout(tapHoldTimeout);
      if (params.activeState) {
        removeActive();
      }
      if (useRipple) {
        rippleTouchEnd();
      }
    }
    var isScrolling;
    var isSegmentedStrong = false;
    var segmentedStrongEl = null;
    var touchMoveActivableIos = '.dialog-button, .actions-button';
    var isTouchMoveActivable = false;
    var touchmoveActivableEl = null;
    function handleTouchStart(e) {
      if (!e.isTrusted) return true;
      isMoved = false;
      tapHoldFired = false;
      preventClick = false;
      isScrolling = undefined;
      if (e.targetTouches.length > 1) {
        if (activableElement) removeActive();
        return true;
      }
      if (e.touches.length > 1 && activableElement) {
        removeActive();
      }
      if (params.tapHold) {
        if (tapHoldTimeout) clearTimeout(tapHoldTimeout);
        tapHoldTimeout = setTimeout(function () {
          if (e && e.touches && e.touches.length > 1) return;
          tapHoldFired = true;
          e.preventDefault();
          preventClick = true;
          $(e.target).trigger('taphold', e);
          app.emit('taphold', e);
        }, params.tapHoldDelay);
      }
      targetElement = e.target;
      touchStartX = e.targetTouches[0].pageX;
      touchStartY = e.targetTouches[0].pageY;
      isSegmentedStrong = e.target.closest('.segmented-strong .button-active, .segmented-strong .tab-link-active');
      isTouchMoveActivable = app.theme === 'ios' && e.target.closest(touchMoveActivableIos);
      if (isSegmentedStrong) {
        segmentedStrongEl = isSegmentedStrong.closest('.segmented-strong');
      }
      if (params.activeState) {
        activableElement = findActivableElement(targetElement);
        if (activableElement && !isInsideScrollableView(activableElement)) {
          addActive();
        } else if (activableElement) {
          activeTimeout = setTimeout(addActive, 80);
        }
      }
      if (useRipple) {
        rippleTouchStart(targetElement);
      }
      return true;
    }
    function handleTouchMove(e) {
      if (!e.isTrusted) return;
      var touch;
      var distance;
      var shouldRemoveActive = true;
      if (e.type === 'touchmove') {
        touch = e.targetTouches[0];
        distance = params.touchClicksDistanceThreshold;
      }
      var touchCurrentX = e.targetTouches[0].pageX;
      var touchCurrentY = e.targetTouches[0].pageY;
      if (typeof isScrolling === 'undefined') {
        isScrolling = !!(isScrolling || Math.abs(touchCurrentY - touchStartY) > Math.abs(touchCurrentX - touchStartX));
      }
      if (isTouchMoveActivable || !isScrolling && isSegmentedStrong && segmentedStrongEl) {
        if (e.cancelable) e.preventDefault();
      }
      if (!isScrolling && isSegmentedStrong && segmentedStrongEl) {
        var elementFromPoint = document.elementFromPoint(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
        var buttonEl = elementFromPoint.closest('.segmented-strong .button:not(.button-active):not(.tab-link-active)');
        if (buttonEl && segmentedStrongEl.contains(buttonEl)) {
          $(buttonEl).trigger('click', 'f7Segmented');
          targetElement = buttonEl;
        }
      }
      if (distance && touch) {
        var _touch = touch,
          pageX = _touch.pageX,
          pageY = _touch.pageY;
        if (Math.abs(pageX - touchStartX) > distance || Math.abs(pageY - touchStartY) > distance) {
          isMoved = true;
        }
      } else {
        isMoved = true;
      }
      if (isMoved) {
        preventClick = true;
        if (isTouchMoveActivable) {
          var _elementFromPoint = document.elementFromPoint(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
          touchmoveActivableEl = _elementFromPoint.closest(touchMoveActivableIos);
          if (touchmoveActivableEl && activableElement && activableElement[0] === touchmoveActivableEl) {
            shouldRemoveActive = false;
          } else if (touchmoveActivableEl) {
            setTimeout(function () {
              activableElement = findActivableElement(touchmoveActivableEl);
              addActive();
            });
          }
        }
        if (params.tapHold) {
          clearTimeout(tapHoldTimeout);
        }
        if (params.activeState && shouldRemoveActive) {
          clearTimeout(activeTimeout);
          removeActive();
        }
        if (useRipple) {
          rippleTouchMove();
        }
      }
    }
    function handleTouchEnd(e) {
      if (!e.isTrusted) return true;
      isScrolling = undefined;
      isSegmentedStrong = false;
      segmentedStrongEl = null;
      isTouchMoveActivable = false;
      clearTimeout(activeTimeout);
      clearTimeout(tapHoldTimeout);
      if (touchmoveActivableEl) {
        $(touchmoveActivableEl).trigger('click', 'f7TouchMoveActivable');
        touchmoveActivableEl = null;
      }
      if (document.activeElement === e.target) {
        if (params.activeState) removeActive();
        if (useRipple) {
          rippleTouchEnd();
        }
        return true;
      }
      if (params.activeState) {
        addActive();
        setTimeout(removeActive, 0);
      }
      if (useRipple) {
        rippleTouchEnd();
      }
      if (params.tapHoldPreventClicks && tapHoldFired || preventClick) {
        if (e.cancelable) e.preventDefault();
        preventClick = true;
        return false;
      }
      return true;
    }
    function handleClick(e) {
      var isOverswipe = e && e.detail && e.detail === 'f7Overswipe';
      var isSegmented = e && e.detail && e.detail === 'f7Segmented';
      var isTouchMoveActivable = e && e.detail && e.detail === 'f7TouchMoveActivable';
      var localPreventClick = preventClick;
      if (targetElement && e.target !== targetElement) {
        if (isOverswipe || isSegmented || isTouchMoveActivable) {
          localPreventClick = false;
        } else {
          localPreventClick = true;
        }
      } else if (isTouchMoveActivable) {
        localPreventClick = false;
      }
      if (params.tapHold && params.tapHoldPreventClicks && tapHoldFired) {
        localPreventClick = true;
      }
      if (localPreventClick) {
        e.stopImmediatePropagation();
        e.stopPropagation();
        e.preventDefault();
      }
      if (params.tapHold) {
        tapHoldTimeout = setTimeout(function () {
          tapHoldFired = false;
        }, device$1.ios || device$1.androidChrome ? 100 : 400);
      }
      preventClick = false;
      targetElement = null;
      return !localPreventClick;
    }
    function emitAppTouchEvent(name, e) {
      app.emit({
        events: name,
        data: [e]
      });
    }
    function appTouchStartActive(e) {
      emitAppTouchEvent('touchstart touchstart:active', e);
    }
    function appTouchMoveActive(e) {
      emitAppTouchEvent('touchmove touchmove:active', e);
    }
    function appTouchEndActive(e) {
      emitAppTouchEvent('touchend touchend:active', e);
    }
    function appTouchStartPassive(e) {
      emitAppTouchEvent('touchstart:passive', e);
    }
    function appTouchMovePassive(e) {
      emitAppTouchEvent('touchmove:passive', e);
    }
    function appTouchEndPassive(e) {
      emitAppTouchEvent('touchend:passive', e);
    }
    var passiveListener = support$1.passiveListener ? {
      passive: true
    } : false;
    var passiveListenerCapture = support$1.passiveListener ? {
      passive: true,
      capture: true
    } : true;
    var activeListener = support$1.passiveListener ? {
      passive: false
    } : false;
    var activeListenerCapture = support$1.passiveListener ? {
      passive: false,
      capture: true
    } : true;
    if (support$1.passiveListener) {
      document.addEventListener(app.touchEvents.start, appTouchStartActive, activeListenerCapture);
      document.addEventListener(app.touchEvents.move, appTouchMoveActive, activeListener);
      document.addEventListener(app.touchEvents.end, appTouchEndActive, activeListener);
      document.addEventListener(app.touchEvents.start, appTouchStartPassive, passiveListenerCapture);
      document.addEventListener(app.touchEvents.move, appTouchMovePassive, passiveListener);
      document.addEventListener(app.touchEvents.end, appTouchEndPassive, passiveListener);
    } else {
      document.addEventListener(app.touchEvents.start, function (e) {
        appTouchStartActive(e);
        appTouchStartPassive(e);
      }, true);
      document.addEventListener(app.touchEvents.move, function (e) {
        appTouchMoveActive(e);
        appTouchMovePassive(e);
      }, false);
      document.addEventListener(app.touchEvents.end, function (e) {
        appTouchEndActive(e);
        appTouchEndPassive(e);
      }, false);
    }
    if (support$1.touch) {
      app.on('click', handleClick);
      app.on('touchstart', handleTouchStart);
      app.on('touchmove', handleTouchMove);
      app.on('touchend', handleTouchEnd);
      document.addEventListener('touchcancel', handleTouchCancel, {
        passive: true
      });
    } else if (params.activeState) {
      app.on('touchstart', handleMouseDown);
      app.on('touchmove', handleMouseMove);
      app.on('touchend', handleMouseUp);
      document.addEventListener('pointercancel', handleMouseUp, {
        passive: true
      });
    }
    document.addEventListener('contextmenu', function (e) {
      if (params.disableContextMenu && (device$1.ios || device$1.android || device$1.cordova || window.Capacitor && window.Capacitor.isNative)) {
        e.preventDefault();
      }
      if (useRipple) {
        if (activableElement) removeActive();
        rippleTouchEnd();
      }
    });
  }
  var Touch = {
    name: 'touch',
    params: {
      touch: {
        touchClicksDistanceThreshold: 5,
        disableContextMenu: false,
        tapHold: false,
        tapHoldDelay: 750,
        tapHoldPreventClicks: true,
        activeState: true,
        activeStateElements: 'a, button, label, span, .actions-button, .stepper-button, .stepper-button-plus, .stepper-button-minus, .card-expandable, .link, .item-link, .accordion-item-toggle',
        activeStateOnMouseMove: false,
        mdTouchRipple: true,
        iosTouchRipple: false,
        touchRippleElements: '.ripple, .link, .item-link, .list label.item-content, .list-button, .links-list a, .button, button, .input-clear-button, .dialog-button, .tab-link, .item-radio, .item-checkbox, .actions-button, .searchbar-disable-button, .fab a, .checkbox, .radio, .data-table .sortable-cell:not(.input-cell), .notification-close-button, .stepper-button, .stepper-button-minus, .stepper-button-plus, .list.accordion-list .accordion-item-toggle',
        touchRippleInsetElements: '.ripple-inset, .icon-only, .searchbar-disable-button, .input-clear-button, .notification-close-button, .md .navbar .link.back'
      }
    },
    create: function create() {
      var app = this;
      extend$1(app, {
        touchEvents: {
          start: support$1.touch ? 'touchstart' : support$1.pointerEvents ? 'pointerdown' : 'mousedown',
          move: support$1.touch ? 'touchmove' : support$1.pointerEvents ? 'pointermove' : 'mousemove',
          end: support$1.touch ? 'touchend' : support$1.pointerEvents ? 'pointerup' : 'mouseup'
        }
      });
    },
    on: {
      init: initTouch
    }
  };

  var SW = {
    registrations: [],
    register: function register(path, scope) {
      var app = this;
      if (!('serviceWorker' in window.navigator) || !app.serviceWorker.container) {
        return new Promise(function (resolve, reject) {
          reject(new Error('Service worker is not supported'));
        });
      }
      return new Promise(function (resolve, reject) {
        app.serviceWorker.container.register(path, scope ? {
          scope: scope
        } : {}).then(function (reg) {
          SW.registrations.push(reg);
          app.emit('serviceWorkerRegisterSuccess', reg);
          resolve(reg);
        })["catch"](function (error) {
          app.emit('serviceWorkerRegisterError', error);
          reject(error);
        });
      });
    },
    unregister: function unregister(registration) {
      var app = this;
      if (!('serviceWorker' in window.navigator) || !app.serviceWorker.container) {
        return new Promise(function (resolve, reject) {
          reject(new Error('Service worker is not supported'));
        });
      }
      var registrations;
      if (!registration) registrations = SW.registrations;else if (Array.isArray(registration)) registrations = registration;else registrations = [registration];
      return Promise.all(registrations.map(function (reg) {
        return new Promise(function (resolve, reject) {
          reg.unregister().then(function () {
            if (SW.registrations.indexOf(reg) >= 0) {
              SW.registrations.splice(SW.registrations.indexOf(reg), 1);
            }
            app.emit('serviceWorkerUnregisterSuccess', reg);
            resolve();
          })["catch"](function (error) {
            app.emit('serviceWorkerUnregisterError', reg, error);
            reject(error);
          });
        });
      }));
    }
  };
  var SW$1 = {
    name: 'sw',
    params: {
      serviceWorker: {
        path: undefined,
        scope: undefined
      }
    },
    create: function create() {
      var app = this;
      $.extend(app, {
        serviceWorker: {
          container: 'serviceWorker' in window.navigator ? window.navigator.serviceWorker : undefined,
          registrations: SW.registrations,
          register: SW.register.bind(app),
          unregister: SW.unregister.bind(app)
        }
      });
    },
    on: {
      init: function init() {
        if (!('serviceWorker' in window.navigator)) return;
        var app = this;
        if (app.device.cordova || window.Capacitor && window.Capacitor.isNative) return;
        if (!app.serviceWorker.container) return;
        var paths = app.params.serviceWorker.path;
        var scope = app.params.serviceWorker.scope;
        if (!paths || Array.isArray(paths) && !paths.length) return;
        var toRegister = Array.isArray(paths) ? paths : [paths];
        toRegister.forEach(function (path) {
          app.serviceWorker.register(path, scope);
        });
      }
    }
  };

  var extend = Utils.extend,
    nextFrame = Utils.nextFrame,
    colorThemeCSSStyles = Utils.colorThemeCSSStyles;
  var _$ = $,
    support = _$.support,
    device = _$.device;
  var def = {
    version: '1.0.1',
    el: 'body',
    root: 'body',
    theme: 'auto',
    language: window.navigator.language,
    routes: [],
    name: 'App',
    lazyModulesPath: null,
    initOnDeviceReady: true,
    darkMode: undefined,
    iosTranslucentBars: true,
    iosTranslucentModals: true,
    component: undefined,
    componentUrl: undefined,
    userAgent: null,
    url: null,
    colors: {
      primary: '#007aff',
      red: '#ff3b30',
      green: '#4cd964',
      blue: '#2196f3',
      pink: '#ff2d55',
      yellow: '#ffcc00',
      orange: '#ff9500',
      purple: '#9c27b0',
      deeppurple: '#673ab7',
      lightblue: '#5ac8fa',
      teal: '#009688',
      lime: '#cddc39',
      deeporange: '#ff6b22',
      white: '#ffffff',
      black: '#000000'
    }
  };
  var App = function (_Module) {
    _inheritsLoose(App, _Module);
    function App(opts) {
      var _this;
      if (opts === void 0) {
        opts = {};
      }
      _this = _Module.call(this, opts) || this;
      if (App.instance && typeof window !== 'undefined') {
        throw new Error("App is already initialized and can't be initialized more than once");
      }
      var passedParams = extend({}, opts);
      var app = _assertThisInitialized(_this);
      $.App = App;
      App.instance = app;
      app.device = device;
      app.support = support;
      console.log('App constructor', {
        Device: device,
        Support: support
      });
      app.useModulesParams(def);
      app.params = extend(def, opts);
      if (opts.root && !opts.el) {
        app.params.el = opts.root;
      }
      $.isPage = function (p) {
        return p instanceof Page;
      };
      $.isApp = function (p) {
        return p instanceof App;
      };
      extend(app, {
        owner: app.params.owner,
        name: app.params.name,
        id: app.params.owner + "." + app.params.name,
        version: app.params.version,
        routes: app.params.routes,
        language: app.params.language,
        cfg: app.params.cfg,
        api: app.params.api,
        theme: function () {
          if (app.params.theme === 'auto') {
            if (device.ios) return 'ios';
            if (device.desktop) return 'pc';
            return 'md';
          }
          return app.params.theme;
        }(),
        passedParams: passedParams,
        online: window.navigator.onLine,
        colors: app.params.colors,
        darkMode: app.params.darkMode
      });
      if (opts.store) app.params.store = params.store;
      app.touchEvents = {
        start: support.touch ? 'touchstart' : support.pointerEvents ? 'pointerdown' : 'mousedown',
        move: support.touch ? 'touchmove' : support.pointerEvents ? 'pointermove' : 'mousemove',
        end: support.touch ? 'touchend' : support.pointerEvents ? 'pointerup' : 'mouseup'
      };
      app.useModules();
      app.initData();
      if (app.params.init) {
        if (device.cordova && app.params.initOnDeviceReady) {
          $(document).on('deviceready', function () {
            app.init();
          });
        } else {
          app.init();
        }
      }
      return app || _assertThisInitialized(_this);
    }
    var _proto = App.prototype;
    _proto.load = function load(param) {
      this.emit('local::load appLoad', param);
    };
    _proto.show = function show(url, data) {
      this.emit('local::show appShow', url, data);
    };
    _proto.hide = function hide() {
      this.emit('local::hide appHide');
    };
    _proto.unload = function unload() {
      this.emit('local::unload appUnload');
    };
    _proto.setColorTheme = function setColorTheme(color) {
      if (!color) return;
      var app = this;
      app.colors.primary = color;
      app.setColors();
    };
    _proto.setColors = function setColors() {
      var app = this;
      if (!app.colorsStyleEl) {
        app.colorsStyleEl = document.createElement('style');
        document.head.appendChild(app.colorsStyleEl);
      }
      app.colorsStyleEl.textContent = colorThemeCSSStyles(app.colors);
    };
    _proto.mount = function mount(rootEl) {
      var app = this;
      var $rootEl = $(rootEl || app.params.el).eq(0);
      extend(app, {
        root: $rootEl,
        $el: $rootEl,
        el: $rootEl == null ? void 0 : $rootEl[0],
        rtl: $rootEl.css('direction') === 'rtl'
      });
      if (app.root && app.root[0]) {
        app.root[0].wia = app;
      }
      if (app.$el && app.$el[0]) {
        app.$el[0].wia = app;
      }
      app.el.f7 = app;
      var DARK = '(prefers-color-scheme: dark)';
      var LIGHT = '(prefers-color-scheme: light)';
      app.mq = {};
      if (window.matchMedia) {
        app.mq.dark = window.matchMedia(DARK);
        app.mq.light = window.matchMedia(LIGHT);
      }
      app.colorSchemeListener = function (_ref) {
        var matches = _ref.matches,
          media = _ref.media;
        if (!matches) {
          return;
        }
        var html = document.querySelector('html');
        if (media === DARK) {
          html.classList.add('dark');
          app.darkMode = true;
          app.emit('darkModeChange', true);
        } else if (media === LIGHT) {
          html.classList.remove('dark');
          app.darkMode = false;
          app.emit('darkModeChange', false);
        }
      };
      app.emit('mount');
    };
    _proto.initData = function initData() {
      var app = this;
      app.data = {};
      if (app.params.data && typeof app.params.data === 'function') {
        $.extend(app.data, app.params.data.bind(app)());
      } else if (app.params.data) {
        $.extend(app.data, app.params.data);
      }
      app.methods = {};
      if (app.params.methods) {
        Object.keys(app.params.methods).forEach(function (methodName) {
          if (typeof app.params.methods[methodName] === 'function') {
            app.methods[methodName] = app.params.methods[methodName].bind(app);
          } else {
            app.methods[methodName] = app.params.methods[methodName];
          }
        });
      }
    };
    _proto.enableAutoDarkTheme = function enableAutoDarkTheme() {
      if (!window.matchMedia) return;
      var app = this;
      var html = document.querySelector('html');
      if (app.mq.dark && app.mq.light) {
        app.mq.dark.addListener(app.colorSchemeListener);
        app.mq.light.addListener(app.colorSchemeListener);
      }
      if (app.mq.dark && app.mq.dark.matches) {
        html.classList.add('dark');
        app.darkMode = true;
        app.emit('darkModeChange', true);
      } else if (app.mq.light && app.mq.light.matches) {
        html.classList.remove('dark');
        app.darkMode = false;
        app.emit('darkModeChange', false);
      }
    };
    _proto.disableAutoDarkTheme = function disableAutoDarkTheme() {
      if (!window.matchMedia) return;
      var app = this;
      if (app.mq.dark) app.mq.dark.removeListener(app.colorSchemeListener);
      if (app.mq.light) app.mq.light.removeListener(app.colorSchemeListener);
    };
    _proto.setDarkMode = function setDarkMode(mode) {
      var app = this;
      if (mode === 'auto') {
        app.enableAutoDarkMode();
      } else {
        app.disableAutoDarkMode();
        $('html')[mode ? 'addClass' : 'removeClass']('dark');
        app.darkMode = mode;
      }
    };
    _proto.initAppComponent = function initAppComponent(callback) {
      var app = this;
      app.router.componentLoader(app.params.component, app.params.componentUrl, {
        componentOptions: {
          el: app.$el[0]
        }
      }, function (el) {
        app.$el = $(el);
        app.$el[0].wia = app;
        app.$elComponent = el.f7Component;
        app.el = app.$el[0];
        if (callback) callback();
      }, function () {});
    };
    _proto.init = function init(rootEl) {
      var app = this;
      app.setColors();
      app.mount(rootEl);
      var init = function init() {
        if (app.initialized) return app;
        app.$el.addClass('framework7-initializing');
        if (app.rtl) {
          $('html').attr('dir', 'rtl');
        }
        if (typeof app.params.darkMode === 'undefined') {
          app.darkMode = $('html').hasClass('dark');
        } else {
          app.setDarkMode(app.params.darkMode);
        }
        window.addEventListener('offline', function () {
          app.online = false;
          app.emit('offline');
          app.emit('connection', false);
        });
        window.addEventListener('online', function () {
          app.online = true;
          app.emit('online');
          app.emit('connection', true);
        });
        app.$el.addClass('framework7-root');
        $('html').removeClass('ios md pc').addClass(app.theme);
        if (app.params.iosTranslucentBars && app.theme === 'ios') {
          $('html').addClass('ios-translucent-bars');
        }
        if (app.params.iosTranslucentModals && app.theme === 'ios') {
          $('html').addClass('ios-translucent-modals');
        }
        nextFrame(function () {
          app.$el.removeClass('framework7-initializing');
        });
        initStyle();
        app.initialized = true;
        app.emit('init');
      };
      if (app.params.component || app.params.componentUrl) {
        app.initAppComponent(function () {
          init();
        });
      } else {
        init();
      }
      return app;
    };
    _proto.loadModule = function loadModule(m) {
      App.loadModule(m);
      if (this[m.name].init) this[m.name].init();
    };
    _proto.loadModules = function loadModules() {
      return App.loadModules.apply(App, arguments);
    };
    _proto.getVnodeHooks = function getVnodeHooks(hook, id) {
      var app = this;
      if (!app.vnodeHooks || !app.vnodeHooks[hook]) return [];
      return app.vnodeHooks[hook][id] || [];
    };
    _createClass(App, [{
      key: "$",
      get: function get() {
        return $;
      }
    }], [{
      key: "Dom",
      get: function get() {
        return $;
      }
    }, {
      key: "$",
      get: function get() {
        return $;
      }
    }, {
      key: "Module",
      get: function get() {
        return Module;
      }
    }, {
      key: "Event",
      get: function get() {
        return Event;
      }
    }, {
      key: "Class",
      get: function get() {
        return Module;
      }
    }, {
      key: "Events",
      get: function get() {
        return Event;
      }
    }]);
    return App;
  }(Module);
  App.apps = {};
  function initStyle() {
    var classNames = [];
    var html = document.querySelector('html');
    var metaStatusbar = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if (!html) return;
    if (device.standalone && device.ios && metaStatusbar && metaStatusbar.content === 'black-translucent') {
      classNames.push('device-full-viewport');
    }
    classNames.push("device-pixel-ratio-" + Math.floor(device.pixelRatio));
    if (device.os && !device.desktop) {
      classNames.push("device-" + device.os);
    } else if (device.desktop) {
      classNames.push('device-desktop');
      if (device.os) {
        classNames.push("device-" + device.os);
      }
    }
    if (device.cordova || device.phonegap) {
      classNames.push('device-cordova');
    }
    classNames.forEach(function (className) {
      html.classList.add(className);
    });
  }
  App.jsx = jsx;
  App.ModalMethods = Modals;
  App.ConstructorMethods = Constructors;
  App.loadModule = loadModule;
  App.loadModules = function (modules) {
    return Promise.all(modules.map(function (module) {
      return App.loadModule(module);
    }));
  };
  App.support = support;
  App.device = device;
  App.utils = Utils;
  App.use([Resize, Click, Touch, SW$1]);

  var _opts = {
    normal: 'nor',
    retina: 'ret',
    srcset: 'set',
    threshold: 0
  };
  var _opt;
  var _ticking;
  var _nodes;
  var _windowHeight = window.innerHeight;
  var _root;
  var _prevLoc = getLoc();
  var _srcset = document.body.classList.contains('srcset') || 'srcset' in document.createElement('img');
  var _dpr = window.devicePixelRatio || window.screen.deviceXDPI / window.screen.logicalXDPI;
  var Lazy = function () {
    function Lazy(opt) {
      _opt = $.assign({}, _opts, opt);
    }
    var _proto = Lazy.prototype;
    _proto.start = function start(root) {
      ['scroll', 'resize'].forEach(function (event) {
        return root['addEventListener'](event, requestScroll);
      });
      _root = root;
      return this;
    };
    _proto.stop = function stop() {
      ['scroll', 'resize'].forEach(function (event) {
        return _root['removeEventListener'](event, requestScroll);
      });
      return this;
    };
    _proto.update = function update() {
      setTimeout(function () {
        _update();
        check();
      }, 1);
    };
    return Lazy;
  }();
  function getLoc() {
    return window.scrollY || window.pageYOffset;
  }
  function requestScroll() {
    _prevLoc = getLoc();
    requestFrame();
  }
  function requestFrame() {
    if (!_ticking) {
      window.requestAnimationFrame(function () {
        return check();
      });
      _ticking = true;
    }
  }
  function getOffset(node) {
    return node.getBoundingClientRect().top + _prevLoc;
  }
  function inViewport(node) {
    var viewTop = _prevLoc;
    var viewBot = viewTop + _windowHeight;
    var nodeTop = getOffset(node);
    var nodeBot = nodeTop + node.offsetHeight;
    var offset = _opt.threshold / 100 * _windowHeight;
    var rc = nodeBot >= viewTop - offset && nodeTop <= viewBot + offset;
    return rc;
  }
  function setSource(node) {
    $.emit('lazy:src:before', node);
    if (_srcset && node.hasAttribute(_opt.srcset)) {
      node.setAttribute('srcset', node.getAttribute(_opt.srcset));
    } else {
      var retina = _dpr > 1 && node.getAttribute(_opt.retina);
      var src = retina || node.getAttribute(_opt.normal);
      node.setAttribute('src', src);
      console.log("set src:" + src);
    }
    $.emit('lazy:src:after', node);
    [_opt.normal, _opt.retina, _opt.srcset].forEach(function (attr) {
      return node.removeAttribute(attr);
    });
    _update();
  }
  function check() {
    if (!_nodes) return;
    _windowHeight = window.innerHeight;
    _nodes.forEach(function (node) {
      return inViewport(node) && setSource(node);
    });
    _ticking = false;
    return this;
  }
  function _update(root) {
    if (root) _nodes = Array.prototype.slice.call(root.querySelectorAll("[" + _opt.normal + "]"));else _nodes = Array.prototype.slice.call(document.querySelectorAll("[" + _opt.normal + "]"));
    return this;
  }

  var openedModals = [];
  var dialogsQueue = [];
  function clearDialogsQueue() {
    if (dialogsQueue.length === 0) return;
    var dialog = dialogsQueue.shift();
    dialog.open();
  }
  var Modal = function (_Event) {
    _inheritsLoose(Modal, _Event);
    function Modal(app, params) {
      var _this;
      _this = _Event.call(this, params, [app]) || this;
      var modal = _assertThisInitialized(_this);
      var defaults = {};
      modal.params = Utils.extend(defaults, params);
      modal.opened = false;
      return _assertThisInitialized(_this) || _assertThisInitialized(_this);
    }
    var _proto = Modal.prototype;
    _proto.onOpen = function onOpen() {
      var modal = this;
      modal.opened = true;
      openedModals.push(modal);
      $('html').addClass("with-modal-" + modal.type.toLowerCase());
      modal.$el.trigger("modal:open " + modal.type.toLowerCase() + ":open");
      modal.emit("local::open modalOpen " + modal.type + "Open", modal);
    };
    _proto.onOpened = function onOpened() {
      var modal = this;
      modal.$el.trigger("modal:opened " + modal.type.toLowerCase() + ":opened");
      modal.emit("local::opened modalOpened " + modal.type + "Opened", modal);
    };
    _proto.onClose = function onClose() {
      var modal = this;
      modal.opened = false;
      if (!modal.type || !modal.$el) return;
      openedModals.splice(openedModals.indexOf(modal), 1);
      $('html').removeClass("with-modal-" + modal.type.toLowerCase());
      modal.$el.trigger("modal:close " + modal.type.toLowerCase() + ":close");
      modal.emit("local::close modalClose " + modal.type + "Close", modal);
    };
    _proto.onClosed = function onClosed() {
      var modal = this;
      if (!modal.type || !modal.$el) return;
      modal.$el.removeClass('modal-out');
      modal.$el.hide();
      modal.$el.trigger("modal:closed " + modal.type.toLowerCase() + ":closed");
      modal.emit("local::closed modalClosed " + modal.type + "Closed", modal);
    };
    _proto.open = function open(animateModal) {
      var modal = this;
      var app = modal.app,
        $el = modal.$el,
        type = modal.type,
        $backdropEl = modal.$backdropEl;
      var moveToRoot = modal.params.moveToRoot;
      var animate = true;
      if (typeof animateModal !== 'undefined') animate = animateModal;else if (typeof modal.params.animate !== 'undefined') {
        animate = modal.params.animate;
      }
      if (!$el || $el.hasClass('modal-in')) {
        return modal;
      }
      if (type === 'dialog' && app.params.modal.queueDialogs) {
        var pushToQueue;
        if ($('.dialog.modal-in').length > 0) {
          pushToQueue = true;
        } else if (openedModals.length > 0) {
          openedModals.forEach(function (openedModal) {
            if (openedModal.type === 'dialog') pushToQueue = true;
          });
        }
        if (pushToQueue) {
          dialogsQueue.push(modal);
          return modal;
        }
      }
      var $modalParentEl = $el.parent();
      var wasInDom = $el.parents(document).length > 0;
      if (moveToRoot && app.params.modal.moveToRoot && !$modalParentEl.is(app.root)) {
        app.root.append($el);
        modal.once(type + "Closed", function () {
          if (wasInDom) {
            $modalParentEl.append($el);
          } else {
            $el.remove();
          }
        });
      }
      $el.show();
      modal._clientLeft = $el[0].clientLeft;
      function transitionEnd() {
        if ($el.hasClass('modal-out')) {
          modal.onClosed();
        } else if ($el.hasClass('modal-in')) {
          modal.onOpened();
        }
      }
      if (animate) {
        if ($backdropEl) {
          $backdropEl.removeClass('not-animated');
          $backdropEl.addClass('backdrop-in');
        }
        $el.animationEnd(function () {
          transitionEnd();
        });
        $el.transitionEnd(function () {
          transitionEnd();
        });
        $el.removeClass('modal-out not-animated').addClass('modal-in');
        modal.onOpen();
      } else {
        if ($backdropEl) {
          $backdropEl.addClass('backdrop-in not-animated');
        }
        $el.removeClass('modal-out').addClass('modal-in not-animated');
        modal.onOpen();
        modal.onOpened();
      }
      return modal;
    };
    _proto.close = function close(animateModal) {
      var modal = this;
      var $el = modal.$el;
      var $backdropEl = modal.$backdropEl;
      var animate = true;
      if (typeof animateModal !== 'undefined') animate = animateModal;else if (typeof modal.params.animate !== 'undefined') {
        animate = modal.params.animate;
      }
      if (!$el || !$el.hasClass('modal-in')) {
        if (dialogsQueue.indexOf(modal) >= 0) {
          dialogsQueue.splice(dialogsQueue.indexOf(modal), 1);
        }
        return modal;
      }
      if ($backdropEl) {
        var needToHideBackdrop = true;
        if (modal.type === 'popup') {
          modal.$el.prevAll('.popup.modal-in').each(function (index, popupEl) {
            var popupInstance = popupEl.f7Modal;
            if (!popupInstance) return;
            if (popupInstance.params.closeByBackdropClick && popupInstance.params.backdrop && popupInstance.backdropEl === modal.backdropEl) {
              needToHideBackdrop = false;
            }
          });
        }
        if (needToHideBackdrop) {
          $backdropEl[animate ? 'removeClass' : 'addClass']('not-animated');
          $backdropEl.removeClass('backdrop-in');
        }
      }
      $el[animate ? 'removeClass' : 'addClass']('not-animated');
      function transitionEnd() {
        if ($el.hasClass('modal-out')) {
          modal.onClosed();
        } else if ($el.hasClass('modal-in')) {
          modal.onOpened();
        }
      }
      if (animate) {
        $el.animationEnd(function () {
          transitionEnd();
        });
        $el.transitionEnd(function () {
          transitionEnd();
        });
        $el.removeClass('modal-in').addClass('modal-out');
        modal.onClose();
      } else {
        $el.addClass('not-animated').removeClass('modal-in').addClass('modal-out');
        modal.onClose();
        modal.onClosed();
      }
      if (modal.type === 'dialog') {
        clearDialogsQueue();
      }
      return modal;
    };
    _proto.destroy = function destroy() {
      var modal = this;
      if (modal.destroyed) return;
      modal.emit("local::beforeDestroy modalBeforeDestroy " + modal.type + "BeforeDestroy", modal);
      if (modal.$el) {
        modal.$el.trigger("modal:beforedestroy " + modal.type.toLowerCase() + ":beforedestroy");
        if (modal.$el.length && modal.$el[0].f7Modal) {
          delete modal.$el[0].f7Modal;
        }
      }
      Utils.deleteProps(modal);
      modal.destroyed = true;
    };
    return Modal;
  }(Event);

  var Support = $.support;
  var Device = $.device;

  exports.Ajax = Ajax;
  exports.App = App;
  exports.Constructors = Constructors;
  exports.Device = Device;
  exports.Event = Event;
  exports.Lazy = Lazy;
  exports.Modal = Modal;
  exports.Modals = Modals;
  exports.Module = Module;
  exports.Page = Page;
  exports.Resize = Resize;
  exports.SW = SW$1;
  exports.Support = Support;
  exports.Utils = Utils;
  exports.jsx = jsx;
  exports.loadModule = loadModule;

}));
