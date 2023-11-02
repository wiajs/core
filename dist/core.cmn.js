/*!
  * wia core v1.0.10
  * (c) 2015-2023 Sibyl Yu and contributors
  * Released under the MIT License.
  */
'use strict';

/**
 * promise version ajax get、post
 * return Promise objext.
 * get move to base.js
 */

class Ajax {
  post(url, data) {
    const pm = new Promise((res, rej) => {
      const xhr = $.getXhr();
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) res(xhr.responseText);
          else rej(new Error(xhr.statusText), xhr.responseText);
        }
        /*
          if ((xhr.readyState === 4) && (xhr.status === 200)) {
            cb(xhr.responseText);
          }
      */
      };

      // 异步 post,回调通知
      xhr.open('POST', url, true);
      let param = data;
      if (typeof data === 'object') param = objToParam(data);

      // 发送 FormData 数据, 会自动设置为 multipart/form-data
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      // xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=AaB03x');
      // alert(param);
      xhr.send(param);
    });

    return pm;
  }

  /**
   * xmlHttpRequest POST 方法
   * 发送 FormData 数据, 会自动设置为 multipart/form-data
   * 其他数据,应该是 application/x-www-form-urlencoded
   * @param url post的url地址
   * @param data 要post的数据
   * @param cb 回调
   */
  postForm(url, data) {
    const pm = new Promise((res, rej) => {
      const xhr = $.getXhr();
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) res(null, xhr.responseText);
          else rej(new Error(xhr.status), xhr.responseText);
        }
      };

      // 异步 post,回调通知
      xhr.open('POST', url, true);
      // 发送 FormData 数据, 会自动设置为 multipart/form-data
      // xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      // xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=AaB03x');
      xhr.send(data);
    });

    return pm;
  }

  get(url, param) {
    return $.get(url, param);
  }
}

function objToParam(obj) {
  let rs = '';

  const arr = [];
  for (const k in obj) {
    if (obj.hasOwnProperty(k)) {
      arr.push(`${k}=${obj[k]}`);
    }
    // rs += `${k}=${obj[k]}&`;
  }
  // 排序
  rs = arr.sort().join('&');
  // alert(rs);
  return rs;
}

/* eslint-disable */
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
  return [ row[0] * matrix[0][0] + row[1] * matrix[0][1] + row[2] * matrix[0][2], row[0] * matrix[1][0] + row[1] * matrix[1][1] + row[2] * matrix[1][2], row[0] * matrix[2][0] + row[1] * matrix[2][1] + row[2] * matrix[2][2] ];
}

const SRGB_TO_XYZ = [ [ .41233895, .35762064, .18051042 ], [ .2126, .7152, .0722 ], [ .01932141, .11916382, .95034478 ] ], XYZ_TO_SRGB = [ [ 3.2413774792388685, -1.5376652402851851, -.49885366846268053 ], [ -.9691452513005321, 1.8758853451067872, .04156585616912061 ], [ .05562093689691305, -.20395524564742123, 1.0571799111220335 ] ], WHITE_POINT_D65 = [ 95.047, 100, 108.883 ];

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
  const matrix = XYZ_TO_SRGB, linearR = matrix[0][0] * x + matrix[0][1] * y + matrix[0][2] * z, linearG = matrix[1][0] * x + matrix[1][1] * y + matrix[1][2] * z, linearB = matrix[2][0] * x + matrix[2][1] * y + matrix[2][2] * z;
  return argbFromRgb(delinearized(linearR), delinearized(linearG), delinearized(linearB));
}

function xyzFromArgb(argb) {
  return matrixMultiply([ linearized(redFromArgb(argb)), linearized(greenFromArgb(argb)), linearized(blueFromArgb(argb)) ], SRGB_TO_XYZ);
}

function argbFromLstar(lstar) {
  const component = delinearized(yFromLstar(lstar));
  return argbFromRgb(component, component, component);
}

function lstarFromArgb(argb) {
  return 116 * labF(xyzFromArgb(argb)[1] / 100) - 16;
}

function yFromLstar(lstar) {
  return 100 * labInvf((lstar + 16) / 116);
}

function linearized(rgbComponent) {
  const normalized = rgbComponent / 255;
  return normalized <= .040449936 ? normalized / 12.92 * 100 : 100 * Math.pow((normalized + .055) / 1.055, 2.4);
}

function delinearized(rgbComponent) {
  const normalized = rgbComponent / 100;
  let delinearized = 0;
  return delinearized = normalized <= .0031308 ? 12.92 * normalized : 1.055 * Math.pow(normalized, 1 / 2.4) - .055, 
  clampInt(0, 255, Math.round(255 * delinearized));
}

function whitePointD65() {
  return WHITE_POINT_D65;
}

function labF(t) {
  return t > 216 / 24389 ? Math.pow(t, 1 / 3) : (903.2962962962963 * t + 16) / 116;
}

function labInvf(ft) {
  const ft3 = ft * ft * ft;
  return ft3 > 216 / 24389 ? ft3 : (116 * ft - 16) / 903.2962962962963;
}

class ViewingConditions {
  static make(whitePoint = whitePointD65(), adaptingLuminance = 200 / Math.PI * yFromLstar(50) / 100, backgroundLstar = 50, surround = 2, discountingIlluminant = !1) {
    const xyz = whitePoint, rW = .401288 * xyz[0] + .650173 * xyz[1] + -.051461 * xyz[2], gW = -.250268 * xyz[0] + 1.204414 * xyz[1] + .045854 * xyz[2], bW = -.002079 * xyz[0] + .048952 * xyz[1] + .953127 * xyz[2], f = .8 + surround / 10, c = f >= .9 ? lerp(.59, .69, 10 * (f - .9)) : lerp(.525, .59, 10 * (f - .8));
    let d = discountingIlluminant ? 1 : f * (1 - 1 / 3.6 * Math.exp((-adaptingLuminance - 42) / 92));
    d = d > 1 ? 1 : d < 0 ? 0 : d;
    const nc = f, rgbD = [ d * (100 / rW) + 1 - d, d * (100 / gW) + 1 - d, d * (100 / bW) + 1 - d ], k = 1 / (5 * adaptingLuminance + 1), k4 = k * k * k * k, k4F = 1 - k4, fl = k4 * adaptingLuminance + .1 * k4F * k4F * Math.cbrt(5 * adaptingLuminance), n = yFromLstar(backgroundLstar) / whitePoint[1], z = 1.48 + Math.sqrt(n), nbb = .725 / Math.pow(n, .2), ncb = nbb, rgbAFactors = [ Math.pow(fl * rgbD[0] * rW / 100, .42), Math.pow(fl * rgbD[1] * gW / 100, .42), Math.pow(fl * rgbD[2] * bW / 100, .42) ], rgbA = [ 400 * rgbAFactors[0] / (rgbAFactors[0] + 27.13), 400 * rgbAFactors[1] / (rgbAFactors[1] + 27.13), 400 * rgbAFactors[2] / (rgbAFactors[2] + 27.13) ];
    return new ViewingConditions(n, (2 * rgbA[0] + rgbA[1] + .05 * rgbA[2]) * nbb, nbb, ncb, c, nc, rgbD, fl, Math.pow(fl, .25), z);
  }
  constructor(n, aw, nbb, ncb, c, nc, rgbD, fl, fLRoot, z) {
    this.n = n, this.aw = aw, this.nbb = nbb, this.ncb = ncb, this.c = c, this.nc = nc, 
    this.rgbD = rgbD, this.fl = fl, this.fLRoot = fLRoot, this.z = z;
  }
}

ViewingConditions.DEFAULT = ViewingConditions.make();

class Cam16 {
  constructor(hue, chroma, j, q, m, s, jstar, astar, bstar) {
    this.hue = hue, this.chroma = chroma, this.j = j, this.q = q, this.m = m, this.s = s, 
    this.jstar = jstar, this.astar = astar, this.bstar = bstar;
  }
  distance(other) {
    const dJ = this.jstar - other.jstar, dA = this.astar - other.astar, dB = this.bstar - other.bstar, dEPrime = Math.sqrt(dJ * dJ + dA * dA + dB * dB);
    return 1.41 * Math.pow(dEPrime, .63);
  }
  static fromInt(argb) {
    return Cam16.fromIntInViewingConditions(argb, ViewingConditions.DEFAULT);
  }
  static fromIntInViewingConditions(argb, viewingConditions) {
    const green = (65280 & argb) >> 8, blue = 255 & argb, redL = linearized((16711680 & argb) >> 16), greenL = linearized(green), blueL = linearized(blue), x = .41233895 * redL + .35762064 * greenL + .18051042 * blueL, y = .2126 * redL + .7152 * greenL + .0722 * blueL, z = .01932141 * redL + .11916382 * greenL + .95034478 * blueL, rC = .401288 * x + .650173 * y - .051461 * z, gC = -.250268 * x + 1.204414 * y + .045854 * z, bC = -.002079 * x + .048952 * y + .953127 * z, rD = viewingConditions.rgbD[0] * rC, gD = viewingConditions.rgbD[1] * gC, bD = viewingConditions.rgbD[2] * bC, rAF = Math.pow(viewingConditions.fl * Math.abs(rD) / 100, .42), gAF = Math.pow(viewingConditions.fl * Math.abs(gD) / 100, .42), bAF = Math.pow(viewingConditions.fl * Math.abs(bD) / 100, .42), rA = 400 * signum(rD) * rAF / (rAF + 27.13), gA = 400 * signum(gD) * gAF / (gAF + 27.13), bA = 400 * signum(bD) * bAF / (bAF + 27.13), a = (11 * rA + -12 * gA + bA) / 11, b = (rA + gA - 2 * bA) / 9, u = (20 * rA + 20 * gA + 21 * bA) / 20, p2 = (40 * rA + 20 * gA + bA) / 20, atanDegrees = 180 * Math.atan2(b, a) / Math.PI, hue = atanDegrees < 0 ? atanDegrees + 360 : atanDegrees >= 360 ? atanDegrees - 360 : atanDegrees, hueRadians = hue * Math.PI / 180, ac = p2 * viewingConditions.nbb, j = 100 * Math.pow(ac / viewingConditions.aw, viewingConditions.c * viewingConditions.z), q = 4 / viewingConditions.c * Math.sqrt(j / 100) * (viewingConditions.aw + 4) * viewingConditions.fLRoot, huePrime = hue < 20.14 ? hue + 360 : hue, t = 5e4 / 13 * (.25 * (Math.cos(huePrime * Math.PI / 180 + 2) + 3.8)) * viewingConditions.nc * viewingConditions.ncb * Math.sqrt(a * a + b * b) / (u + .305), alpha = Math.pow(t, .9) * Math.pow(1.64 - Math.pow(.29, viewingConditions.n), .73), c = alpha * Math.sqrt(j / 100), m = c * viewingConditions.fLRoot, s = 50 * Math.sqrt(alpha * viewingConditions.c / (viewingConditions.aw + 4)), jstar = (1 + 100 * .007) * j / (1 + .007 * j), mstar = 1 / .0228 * Math.log(1 + .0228 * m), astar = mstar * Math.cos(hueRadians), bstar = mstar * Math.sin(hueRadians);
    return new Cam16(hue, c, j, q, m, s, jstar, astar, bstar);
  }
  static fromJch(j, c, h) {
    return Cam16.fromJchInViewingConditions(j, c, h, ViewingConditions.DEFAULT);
  }
  static fromJchInViewingConditions(j, c, h, viewingConditions) {
    const q = 4 / viewingConditions.c * Math.sqrt(j / 100) * (viewingConditions.aw + 4) * viewingConditions.fLRoot, m = c * viewingConditions.fLRoot, alpha = c / Math.sqrt(j / 100), s = 50 * Math.sqrt(alpha * viewingConditions.c / (viewingConditions.aw + 4)), hueRadians = h * Math.PI / 180, jstar = (1 + 100 * .007) * j / (1 + .007 * j), mstar = 1 / .0228 * Math.log(1 + .0228 * m), astar = mstar * Math.cos(hueRadians), bstar = mstar * Math.sin(hueRadians);
    return new Cam16(h, c, j, q, m, s, jstar, astar, bstar);
  }
  static fromUcs(jstar, astar, bstar) {
    return Cam16.fromUcsInViewingConditions(jstar, astar, bstar, ViewingConditions.DEFAULT);
  }
  static fromUcsInViewingConditions(jstar, astar, bstar, viewingConditions) {
    const a = astar, b = bstar, m = Math.sqrt(a * a + b * b), c = (Math.exp(.0228 * m) - 1) / .0228 / viewingConditions.fLRoot;
    let h = Math.atan2(b, a) * (180 / Math.PI);
    h < 0 && (h += 360);
    const j = jstar / (1 - .007 * (jstar - 100));
    return Cam16.fromJchInViewingConditions(j, c, h, viewingConditions);
  }
  toInt() {
    return this.viewed(ViewingConditions.DEFAULT);
  }
  viewed(viewingConditions) {
    const alpha = 0 === this.chroma || 0 === this.j ? 0 : this.chroma / Math.sqrt(this.j / 100), t = Math.pow(alpha / Math.pow(1.64 - Math.pow(.29, viewingConditions.n), .73), 1 / .9), hRad = this.hue * Math.PI / 180, eHue = .25 * (Math.cos(hRad + 2) + 3.8), ac = viewingConditions.aw * Math.pow(this.j / 100, 1 / viewingConditions.c / viewingConditions.z), p1 = eHue * (5e4 / 13) * viewingConditions.nc * viewingConditions.ncb, p2 = ac / viewingConditions.nbb, hSin = Math.sin(hRad), hCos = Math.cos(hRad), gamma = 23 * (p2 + .305) * t / (23 * p1 + 11 * t * hCos + 108 * t * hSin), a = gamma * hCos, b = gamma * hSin, rA = (460 * p2 + 451 * a + 288 * b) / 1403, gA = (460 * p2 - 891 * a - 261 * b) / 1403, bA = (460 * p2 - 220 * a - 6300 * b) / 1403, rCBase = Math.max(0, 27.13 * Math.abs(rA) / (400 - Math.abs(rA))), rC = signum(rA) * (100 / viewingConditions.fl) * Math.pow(rCBase, 1 / .42), gCBase = Math.max(0, 27.13 * Math.abs(gA) / (400 - Math.abs(gA))), gC = signum(gA) * (100 / viewingConditions.fl) * Math.pow(gCBase, 1 / .42), bCBase = Math.max(0, 27.13 * Math.abs(bA) / (400 - Math.abs(bA))), bC = signum(bA) * (100 / viewingConditions.fl) * Math.pow(bCBase, 1 / .42), rF = rC / viewingConditions.rgbD[0], gF = gC / viewingConditions.rgbD[1], bF = bC / viewingConditions.rgbD[2];
    return argbFromXyz(1.86206786 * rF - 1.01125463 * gF + .14918677 * bF, .38752654 * rF + .62144744 * gF - .00897398 * bF, -.0158415 * rF - .03412294 * gF + 1.04996444 * bF);
  }
}

class HctSolver {
  static sanitizeRadians(angle) {
    return (angle + 8 * Math.PI) % (2 * Math.PI);
  }
  static trueDelinearized(rgbComponent) {
    const normalized = rgbComponent / 100;
    let delinearized = 0;
    return delinearized = normalized <= .0031308 ? 12.92 * normalized : 1.055 * Math.pow(normalized, 1 / 2.4) - .055, 
    255 * delinearized;
  }
  static chromaticAdaptation(component) {
    const af = Math.pow(Math.abs(component), .42);
    return 400 * signum(component) * af / (af + 27.13);
  }
  static hueOf(linrgb) {
    const scaledDiscount = matrixMultiply(linrgb, HctSolver.SCALED_DISCOUNT_FROM_LINRGB), rA = HctSolver.chromaticAdaptation(scaledDiscount[0]), gA = HctSolver.chromaticAdaptation(scaledDiscount[1]), bA = HctSolver.chromaticAdaptation(scaledDiscount[2]), a = (11 * rA + -12 * gA + bA) / 11, b = (rA + gA - 2 * bA) / 9;
    return Math.atan2(b, a);
  }
  static areInCyclicOrder(a, b, c) {
    return HctSolver.sanitizeRadians(b - a) < HctSolver.sanitizeRadians(c - a);
  }
  static intercept(source, mid, target) {
    return (mid - source) / (target - source);
  }
  static lerpPoint(source, t, target) {
    return [ source[0] + (target[0] - source[0]) * t, source[1] + (target[1] - source[1]) * t, source[2] + (target[2] - source[2]) * t ];
  }
  static setCoordinate(source, coordinate, target, axis) {
    const t = HctSolver.intercept(source[axis], coordinate, target[axis]);
    return HctSolver.lerpPoint(source, t, target);
  }
  static isBounded(x) {
    return 0 <= x && x <= 100;
  }
  static nthVertex(y, n) {
    const kR = HctSolver.Y_FROM_LINRGB[0], kG = HctSolver.Y_FROM_LINRGB[1], kB = HctSolver.Y_FROM_LINRGB[2], coordA = n % 4 <= 1 ? 0 : 100, coordB = n % 2 == 0 ? 0 : 100;
    if (n < 4) {
      const g = coordA, b = coordB, r = (y - g * kG - b * kB) / kR;
      return HctSolver.isBounded(r) ? [ r, g, b ] : [ -1, -1, -1 ];
    }
    if (n < 8) {
      const b = coordA, r = coordB, g = (y - r * kR - b * kB) / kG;
      return HctSolver.isBounded(g) ? [ r, g, b ] : [ -1, -1, -1 ];
    }
    {
      const r = coordA, g = coordB, b = (y - r * kR - g * kG) / kB;
      return HctSolver.isBounded(b) ? [ r, g, b ] : [ -1, -1, -1 ];
    }
  }
  static bisectToSegment(y, targetHue) {
    let left = [ -1, -1, -1 ], right = left, leftHue = 0, rightHue = 0, initialized = !1, uncut = !0;
    for (let n = 0; n < 12; n++) {
      const mid = HctSolver.nthVertex(y, n);
      if (mid[0] < 0) continue;
      const midHue = HctSolver.hueOf(mid);
      initialized ? (uncut || HctSolver.areInCyclicOrder(leftHue, midHue, rightHue)) && (uncut = !1, 
      HctSolver.areInCyclicOrder(leftHue, targetHue, midHue) ? (right = mid, rightHue = midHue) : (left = mid, 
      leftHue = midHue)) : (left = mid, right = mid, leftHue = midHue, rightHue = midHue, 
      initialized = !0);
    }
    return [ left, right ];
  }
  static midpoint(a, b) {
    return [ (a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2 ];
  }
  static criticalPlaneBelow(x) {
    return Math.floor(x - .5);
  }
  static criticalPlaneAbove(x) {
    return Math.ceil(x - .5);
  }
  static bisectToLimit(y, targetHue) {
    const segment = HctSolver.bisectToSegment(y, targetHue);
    let left = segment[0], leftHue = HctSolver.hueOf(left), right = segment[1];
    for (let axis = 0; axis < 3; axis++) if (left[axis] !== right[axis]) {
      let lPlane = -1, rPlane = 255;
      left[axis] < right[axis] ? (lPlane = HctSolver.criticalPlaneBelow(HctSolver.trueDelinearized(left[axis])), 
      rPlane = HctSolver.criticalPlaneAbove(HctSolver.trueDelinearized(right[axis]))) : (lPlane = HctSolver.criticalPlaneAbove(HctSolver.trueDelinearized(left[axis])), 
      rPlane = HctSolver.criticalPlaneBelow(HctSolver.trueDelinearized(right[axis])));
      for (let i = 0; i < 8 && !(Math.abs(rPlane - lPlane) <= 1); i++) {
        const mPlane = Math.floor((lPlane + rPlane) / 2), midPlaneCoordinate = HctSolver.CRITICAL_PLANES[mPlane], mid = HctSolver.setCoordinate(left, midPlaneCoordinate, right, axis), midHue = HctSolver.hueOf(mid);
        HctSolver.areInCyclicOrder(leftHue, targetHue, midHue) ? (right = mid, rPlane = mPlane) : (left = mid, 
        leftHue = midHue, lPlane = mPlane);
      }
    }
    return HctSolver.midpoint(left, right);
  }
  static inverseChromaticAdaptation(adapted) {
    const adaptedAbs = Math.abs(adapted), base = Math.max(0, 27.13 * adaptedAbs / (400 - adaptedAbs));
    return signum(adapted) * Math.pow(base, 1 / .42);
  }
  static findResultByJ(hueRadians, chroma, y) {
    let j = 11 * Math.sqrt(y);
    const viewingConditions = ViewingConditions.DEFAULT, tInnerCoeff = 1 / Math.pow(1.64 - Math.pow(.29, viewingConditions.n), .73), p1 = .25 * (Math.cos(hueRadians + 2) + 3.8) * (5e4 / 13) * viewingConditions.nc * viewingConditions.ncb, hSin = Math.sin(hueRadians), hCos = Math.cos(hueRadians);
    for (let iterationRound = 0; iterationRound < 5; iterationRound++) {
      const jNormalized = j / 100, alpha = 0 === chroma || 0 === j ? 0 : chroma / Math.sqrt(jNormalized), t = Math.pow(alpha * tInnerCoeff, 1 / .9), p2 = viewingConditions.aw * Math.pow(jNormalized, 1 / viewingConditions.c / viewingConditions.z) / viewingConditions.nbb, gamma = 23 * (p2 + .305) * t / (23 * p1 + 11 * t * hCos + 108 * t * hSin), a = gamma * hCos, b = gamma * hSin, rA = (460 * p2 + 451 * a + 288 * b) / 1403, gA = (460 * p2 - 891 * a - 261 * b) / 1403, bA = (460 * p2 - 220 * a - 6300 * b) / 1403, linrgb = matrixMultiply([ HctSolver.inverseChromaticAdaptation(rA), HctSolver.inverseChromaticAdaptation(gA), HctSolver.inverseChromaticAdaptation(bA) ], HctSolver.LINRGB_FROM_SCALED_DISCOUNT);
      if (linrgb[0] < 0 || linrgb[1] < 0 || linrgb[2] < 0) return 0;
      const kR = HctSolver.Y_FROM_LINRGB[0], kG = HctSolver.Y_FROM_LINRGB[1], kB = HctSolver.Y_FROM_LINRGB[2], fnj = kR * linrgb[0] + kG * linrgb[1] + kB * linrgb[2];
      if (fnj <= 0) return 0;
      if (4 === iterationRound || Math.abs(fnj - y) < .002) return linrgb[0] > 100.01 || linrgb[1] > 100.01 || linrgb[2] > 100.01 ? 0 : argbFromLinrgb(linrgb);
      j -= (fnj - y) * j / (2 * fnj);
    }
    return 0;
  }
  static solveToInt(hueDegrees, chroma, lstar) {
    if (chroma < 1e-4 || lstar < 1e-4 || lstar > 99.9999) return argbFromLstar(lstar);
    const hueRadians = (hueDegrees = sanitizeDegreesDouble(hueDegrees)) / 180 * Math.PI, y = yFromLstar(lstar), exactAnswer = HctSolver.findResultByJ(hueRadians, chroma, y);
    if (0 !== exactAnswer) return exactAnswer;
    return argbFromLinrgb(HctSolver.bisectToLimit(y, hueRadians));
  }
  static solveToCam(hueDegrees, chroma, lstar) {
    return Cam16.fromInt(HctSolver.solveToInt(hueDegrees, chroma, lstar));
  }
}

HctSolver.SCALED_DISCOUNT_FROM_LINRGB = [ [ .001200833568784504, .002389694492170889, .0002795742885861124 ], [ .0005891086651375999, .0029785502573438758, .0003270666104008398 ], [ .00010146692491640572, .0005364214359186694, .0032979401770712076 ] ], 
HctSolver.LINRGB_FROM_SCALED_DISCOUNT = [ [ 1373.2198709594231, -1100.4251190754821, -7.278681089101213 ], [ -271.815969077903, 559.6580465940733, -32.46047482791194 ], [ 1.9622899599665666, -57.173814538844006, 308.7233197812385 ] ], 
HctSolver.Y_FROM_LINRGB = [ .2126, .7152, .0722 ], HctSolver.CRITICAL_PLANES = [ .015176349177441876, .045529047532325624, .07588174588720938, .10623444424209313, .13658714259697685, .16693984095186062, .19729253930674434, .2276452376616281, .2579979360165119, .28835063437139563, .3188300904430532, .350925934958123, .3848314933096426, .42057480301049466, .458183274052838, .4976837250274023, .5391024159806381, .5824650784040898, .6277969426914107, .6751227633498623, .7244668422128921, .775853049866786, .829304845476233, .8848452951698498, .942497089126609, 1.0022825574869039, 1.0642236851973577, 1.1283421258858297, 1.1946592148522128, 1.2631959812511864, 1.3339731595349034, 1.407011200216447, 1.4823302800086415, 1.5599503113873272, 1.6398909516233677, 1.7221716113234105, 1.8068114625156377, 1.8938294463134073, 1.9832442801866852, 2.075074464868551, 2.1693382909216234, 2.2660538449872063, 2.36523901573795, 2.4669114995532007, 2.5710888059345764, 2.6777882626779785, 2.7870270208169257, 2.898822059350997, 3.0131901897720907, 3.1301480604002863, 3.2497121605402226, 3.3718988244681087, 3.4967242352587946, 3.624204428461639, 3.754355295633311, 3.887192587735158, 4.022731918402185, 4.160988767090289, 4.301978482107941, 4.445716283538092, 4.592217266055746, 4.741496401646282, 4.893568542229298, 5.048448422192488, 5.20615066083972, 5.3666897647573375, 5.5300801301023865, 5.696336044816294, 5.865471690767354, 6.037501145825082, 6.212438385869475, 6.390297286737924, 6.571091626112461, 6.7548350853498045, 6.941541251256611, 7.131223617812143, 7.323895587840543, 7.5195704746346665, 7.7182615035334345, 7.919981813454504, 8.124744458384042, 8.332562408825165, 8.543448553206703, 8.757415699253682, 8.974476575321063, 9.194643831691977, 9.417930041841839, 9.644347703669503, 9.873909240696694, 10.106627003236781, 10.342513269534024, 10.58158024687427, 10.8238400726681, 11.069304815507364, 11.317986476196008, 11.569896988756009, 11.825048221409341, 12.083451977536606, 12.345119996613247, 12.610063955123938, 12.878295467455942, 13.149826086772048, 13.42466730586372, 13.702830557985108, 13.984327217668513, 14.269168601521828, 14.55736596900856, 14.848930523210871, 15.143873411576273, 15.44220572664832, 15.743938506781891, 16.04908273684337, 16.35764934889634, 16.66964922287304, 16.985093187232053, 17.30399201960269, 17.62635644741625, 17.95219714852476, 18.281524751807332, 18.614349837764564, 18.95068293910138, 19.290534541298456, 19.633915083172692, 19.98083495742689, 20.331304511189067, 20.685334046541502, 21.042933821039977, 21.404114048223256, 21.76888489811322, 22.137256497705877, 22.50923893145328, 22.884842241736916, 23.264076429332462, 23.6469514538663, 24.033477234264016, 24.42366364919083, 24.817520537484558, 25.21505769858089, 25.61628489293138, 26.021211842414342, 26.429848230738664, 26.842203703840827, 27.258287870275353, 27.678110301598522, 28.10168053274597, 28.529008062403893, 28.96010235337422, 29.39497283293396, 29.83362889318845, 30.276079891419332, 30.722335150426627, 31.172403958865512, 31.62629557157785, 32.08401920991837, 32.54558406207592, 33.010999283389665, 33.4802739966603, 33.953417292456834, 34.430438229418264, 34.911345834551085, 35.39614910352207, 35.88485700094671, 36.37747846067349, 36.87402238606382, 37.37449765026789, 37.87891309649659, 38.38727753828926, 38.89959975977785, 39.41588851594697, 39.93615253289054, 40.460400508064545, 40.98864111053629, 41.520882981230194, 42.05713473317016, 42.597404951718396, 43.141702194811224, 43.6900349931913, 44.24241185063697, 44.798841244188324, 45.35933162437017, 45.92389141541209, 46.49252901546552, 47.065252796817916, 47.64207110610409, 48.22299226451468, 48.808024568002054, 49.3971762874833, 49.9904556690408, 50.587870934119984, 51.189430279724725, 51.79514187861014, 52.40501387947288, 53.0190544071392, 53.637271562750364, 54.259673423945976, 54.88626804504493, 55.517063457223934, 56.15206766869424, 56.79128866487574, 57.43473440856916, 58.08241284012621, 58.734331877617365, 59.39049941699807, 60.05092333227251, 60.715611475655585, 61.38457167773311, 62.057811747619894, 62.7353394731159, 63.417162620860914, 64.10328893648692, 64.79372614476921, 65.48848194977529, 66.18756403501224, 66.89098006357258, 67.59873767827808, 68.31084450182222, 69.02730813691093, 69.74813616640164, 70.47333615344107, 71.20291564160104, 71.93688215501312, 72.67524319850172, 73.41800625771542, 74.16517879925733, 74.9167682708136, 75.67278210128072, 76.43322770089146, 77.1981124613393, 77.96744375590167, 78.74122893956174, 79.51947534912904, 80.30219030335869, 81.08938110306934, 81.88105503125999, 82.67721935322541, 83.4778813166706, 84.28304815182372, 85.09272707154808, 85.90692527145302, 86.72564993000343, 87.54890820862819, 88.3767072518277, 89.2090541872801, 90.04595612594655, 90.88742016217518, 91.73345337380438, 92.58406282226491, 93.43925555268066, 94.29903859396902, 95.16341895893969, 96.03240364439274, 96.9059996312159, 97.78421388448044, 98.6670533535366, 99.55452497210776 ];

class Hct {
  static from(hue, chroma, tone) {
    return new Hct(HctSolver.solveToInt(hue, chroma, tone));
  }
  static fromInt(argb) {
    return new Hct(argb);
  }
  toInt() {
    return this.argb;
  }
  get hue() {
    return this.internalHue;
  }
  set hue(newHue) {
    this.setInternalState(HctSolver.solveToInt(newHue, this.internalChroma, this.internalTone));
  }
  get chroma() {
    return this.internalChroma;
  }
  set chroma(newChroma) {
    this.setInternalState(HctSolver.solveToInt(this.internalHue, newChroma, this.internalTone));
  }
  get tone() {
    return this.internalTone;
  }
  set tone(newTone) {
    this.setInternalState(HctSolver.solveToInt(this.internalHue, this.internalChroma, newTone));
  }
  constructor(argb) {
    this.argb = argb;
    const cam = Cam16.fromInt(argb);
    this.internalHue = cam.hue, this.internalChroma = cam.chroma, this.internalTone = lstarFromArgb(argb), 
    this.argb = argb;
  }
  setInternalState(argb) {
    const cam = Cam16.fromInt(argb);
    this.internalHue = cam.hue, this.internalChroma = cam.chroma, this.internalTone = lstarFromArgb(argb), 
    this.argb = argb;
  }
}

class Blend {
  static harmonize(designColor, sourceColor) {
    const fromHct = Hct.fromInt(designColor), toHct = Hct.fromInt(sourceColor), differenceDegrees$1 = differenceDegrees(fromHct.hue, toHct.hue), rotationDegrees = Math.min(.5 * differenceDegrees$1, 15), outputHue = sanitizeDegreesDouble(fromHct.hue + rotationDegrees * rotationDirection(fromHct.hue, toHct.hue));
    return Hct.from(outputHue, fromHct.chroma, fromHct.tone).toInt();
  }
  static hctHue(from, to, amount) {
    const ucs = Blend.cam16Ucs(from, to, amount), ucsCam = Cam16.fromInt(ucs), fromCam = Cam16.fromInt(from);
    return Hct.from(ucsCam.hue, fromCam.chroma, lstarFromArgb(from)).toInt();
  }
  static cam16Ucs(from, to, amount) {
    const fromCam = Cam16.fromInt(from), toCam = Cam16.fromInt(to), fromJ = fromCam.jstar, fromA = fromCam.astar, fromB = fromCam.bstar, jstar = fromJ + (toCam.jstar - fromJ) * amount, astar = fromA + (toCam.astar - fromA) * amount, bstar = fromB + (toCam.bstar - fromB) * amount;
    return Cam16.fromUcs(jstar, astar, bstar).toInt();
  }
}

class TonalPalette {
  static fromInt(argb) {
    const hct = Hct.fromInt(argb);
    return TonalPalette.fromHueAndChroma(hct.hue, hct.chroma);
  }
  static fromHueAndChroma(hue, chroma) {
    return new TonalPalette(hue, chroma);
  }
  constructor(hue, chroma) {
    this.hue = hue, this.chroma = chroma, this.cache = new Map;
  }
  tone(tone) {
    let argb = this.cache.get(tone);
    return void 0 === argb && (argb = Hct.from(this.hue, this.chroma, tone).toInt(), 
    this.cache.set(tone, argb)), argb;
  }
}

class CorePalette {
  static of(argb) {
    return new CorePalette(argb, !1);
  }
  static contentOf(argb) {
    return new CorePalette(argb, !0);
  }
  static fromColors(colors) {
    return CorePalette.createPaletteFromColors(!1, colors);
  }
  static contentFromColors(colors) {
    return CorePalette.createPaletteFromColors(!0, colors);
  }
  static createPaletteFromColors(content, colors) {
    const palette = new CorePalette(colors.primary, content);
    if (colors.secondary) {
      const p = new CorePalette(colors.secondary, content);
      palette.a2 = p.a1;
    }
    if (colors.tertiary) {
      const p = new CorePalette(colors.tertiary, content);
      palette.a3 = p.a1;
    }
    if (colors.error) {
      const p = new CorePalette(colors.error, content);
      palette.error = p.a1;
    }
    if (colors.neutral) {
      const p = new CorePalette(colors.neutral, content);
      palette.n1 = p.n1;
    }
    if (colors.neutralVariant) {
      const p = new CorePalette(colors.neutralVariant, content);
      palette.n2 = p.n2;
    }
    return palette;
  }
  constructor(argb, isContent) {
    const hct = Hct.fromInt(argb), hue = hct.hue, chroma = hct.chroma;
    isContent ? (this.a1 = TonalPalette.fromHueAndChroma(hue, chroma), this.a2 = TonalPalette.fromHueAndChroma(hue, chroma / 3), 
    this.a3 = TonalPalette.fromHueAndChroma(hue + 60, chroma / 2), this.n1 = TonalPalette.fromHueAndChroma(hue, Math.min(chroma / 12, 4)), 
    this.n2 = TonalPalette.fromHueAndChroma(hue, Math.min(chroma / 6, 8))) : (this.a1 = TonalPalette.fromHueAndChroma(hue, Math.max(48, chroma)), 
    this.a2 = TonalPalette.fromHueAndChroma(hue, 16), this.a3 = TonalPalette.fromHueAndChroma(hue + 60, 24), 
    this.n1 = TonalPalette.fromHueAndChroma(hue, 4), this.n2 = TonalPalette.fromHueAndChroma(hue, 8)), 
    this.error = TonalPalette.fromHueAndChroma(25, 84);
  }
}

class Scheme {
  get primary() {
    return this.props.primary;
  }
  get onPrimary() {
    return this.props.onPrimary;
  }
  get primaryContainer() {
    return this.props.primaryContainer;
  }
  get onPrimaryContainer() {
    return this.props.onPrimaryContainer;
  }
  get secondary() {
    return this.props.secondary;
  }
  get onSecondary() {
    return this.props.onSecondary;
  }
  get secondaryContainer() {
    return this.props.secondaryContainer;
  }
  get onSecondaryContainer() {
    return this.props.onSecondaryContainer;
  }
  get tertiary() {
    return this.props.tertiary;
  }
  get onTertiary() {
    return this.props.onTertiary;
  }
  get tertiaryContainer() {
    return this.props.tertiaryContainer;
  }
  get onTertiaryContainer() {
    return this.props.onTertiaryContainer;
  }
  get error() {
    return this.props.error;
  }
  get onError() {
    return this.props.onError;
  }
  get errorContainer() {
    return this.props.errorContainer;
  }
  get onErrorContainer() {
    return this.props.onErrorContainer;
  }
  get background() {
    return this.props.background;
  }
  get onBackground() {
    return this.props.onBackground;
  }
  get surface() {
    return this.props.surface;
  }
  get onSurface() {
    return this.props.onSurface;
  }
  get surfaceVariant() {
    return this.props.surfaceVariant;
  }
  get onSurfaceVariant() {
    return this.props.onSurfaceVariant;
  }
  get outline() {
    return this.props.outline;
  }
  get outlineVariant() {
    return this.props.outlineVariant;
  }
  get shadow() {
    return this.props.shadow;
  }
  get scrim() {
    return this.props.scrim;
  }
  get inverseSurface() {
    return this.props.inverseSurface;
  }
  get inverseOnSurface() {
    return this.props.inverseOnSurface;
  }
  get inversePrimary() {
    return this.props.inversePrimary;
  }
  static light(argb) {
    return Scheme.lightFromCorePalette(CorePalette.of(argb));
  }
  static dark(argb) {
    return Scheme.darkFromCorePalette(CorePalette.of(argb));
  }
  static lightContent(argb) {
    return Scheme.lightFromCorePalette(CorePalette.contentOf(argb));
  }
  static darkContent(argb) {
    return Scheme.darkFromCorePalette(CorePalette.contentOf(argb));
  }
  static lightFromCorePalette(core) {
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
  }
  static darkFromCorePalette(core) {
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
  }
  constructor(props) {
    this.props = props;
  }
  toJSON() {
    return {
      ...this.props
    };
  }
}

function hexFromArgb(argb) {
  const r = redFromArgb(argb), g = greenFromArgb(argb), b = blueFromArgb(argb), outParts = [ r.toString(16), g.toString(16), b.toString(16) ];
  for (const [i, part] of outParts.entries()) 1 === part.length && (outParts[i] = "0" + part);
  return "#" + outParts.join("");
}

function argbFromHex(hex) {
  const isThree = 3 === (hex = hex.replace("#", "")).length, isSix = 6 === hex.length, isEight = 8 === hex.length;
  if (!isThree && !isSix && !isEight) throw new Error("unexpected hex " + hex);
  let r = 0, g = 0, b = 0;
  return isThree ? (r = parseIntHex(hex.slice(0, 1).repeat(2)), g = parseIntHex(hex.slice(1, 2).repeat(2)), 
  b = parseIntHex(hex.slice(2, 3).repeat(2))) : isSix ? (r = parseIntHex(hex.slice(0, 2)), 
  g = parseIntHex(hex.slice(2, 4)), b = parseIntHex(hex.slice(4, 6))) : isEight && (r = parseIntHex(hex.slice(2, 4)), 
  g = parseIntHex(hex.slice(4, 6)), b = parseIntHex(hex.slice(6, 8))), (255 << 24 | (255 & r) << 16 | (255 & g) << 8 | 255 & b) >>> 0;
}

function parseIntHex(value) {
  return parseInt(value, 16);
}

function themeFromSourceColor(source, customColors = []) {
  const palette = CorePalette.of(source);
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
    customColors: customColors.map((c => customColor(source, c)))
  };
}

function customColor(source, color) {
  let value = color.value;
  const from = value, to = source;
  color.blend && (value = Blend.harmonize(from, to));
  const tones = CorePalette.of(value).a1;
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

// eslint-disable-next-line

/* eslint-disable */
// prettier-ignore
function toRGBA(d) {
  const r = Math.round;
  const l = d.length;
	const rgba = {};
	if (d.slice(0, 3).toLowerCase() === 'rgb') {
		d = d.replace(' ', '').split(',');
		rgba[0] = parseInt(d[0].slice(d[3].toLowerCase() === 'a' ? 5 : 4), 10);
		rgba[1] = parseInt(d[1], 10);
		rgba[2] = parseInt(d[2], 10);
		rgba[3] = d[3] ? parseFloat(d[3]) : -1;
	} else {
		if (l < 6) d = parseInt(String(d[1]) + d[1] + d[2] + d[2] + d[3] + d[3] + (l > 4 ? String(d[4]) + d[4] : ''), 16);
		else d = parseInt(d.slice(1), 16);
		rgba[0] = (d >> 16) & 255;
		rgba[1] = (d >> 8) & 255;
		rgba[2] = d & 255;
		rgba[3] = l === 9 || l === 5 ? r((((d >> 24) & 255) / 255) * 10000) / 10000 : -1;
	}
	return rgba;
}

// prettier-ignore
function blend(from, to, p = 0.5) {
  const r = Math.round;
  from = from.trim();
	to = to.trim();
	const b = p < 0;
	p = b ? p * -1 : p;
	const f = toRGBA(from);
	const t = toRGBA(to);
	if (to[0] === 'r') {
		return 'rgb' + (to[3] === 'a' ? 'a(' : '(') +
			r(((t[0] - f[0]) * p) + f[0]) + ',' +
			r(((t[1] - f[1]) * p) + f[1]) + ',' +
			r(((t[2] - f[2]) * p) + f[2]) + (
				f[3] < 0 && t[3] < 0 ? '' : ',' + (
					f[3] > -1 && t[3] > -1
						? r((((t[3] - f[3]) * p) + f[3]) * 10000) / 10000
						: t[3] < 0 ? f[3] : t[3]
				)
			) + ')';
	}

	return '#' + (0x100000000 + ((
		f[3] > -1 && t[3] > -1
			? r((((t[3] - f[3]) * p) + f[3]) * 255)
			: t[3] > -1 ? r(t[3] * 255) : f[3] > -1 ? r(f[3] * 255) : 255
		) * 0x1000000) +
		(r(((t[0] - f[0]) * p) + f[0]) * 0x10000) +
		(r(((t[1] - f[1]) * p) + f[1]) * 0x100) +
		r(((t[2] - f[2]) * p) + f[2])
	).toString(16).slice(f[3] > -1 || t[3] > -1 ? 1 : 3);
}
/* eslint-enable */

const materialColors = (hexColor = '') => {
  const theme = themeFromSourceColor(argbFromHex(`#${hexColor.replace('#', '')}`));
  [0.05, 0.08, 0.11, 0.12, 0.14].forEach((amount, index) => {
    theme.schemes.light.props[`surface${index + 1}`] = argbFromHex(
      blend(
        hexFromArgb(theme.schemes.light.props.surface),
        hexFromArgb(theme.schemes.light.props.primary),
        amount,
      ),
    );
    theme.schemes.dark.props[`surface${index + 1}`] = argbFromHex(
      blend(
        hexFromArgb(theme.schemes.dark.props.surface),
        hexFromArgb(theme.schemes.dark.props.primary),
        amount,
      ),
    );
  });

  const name = (n) => {
    return n
      .split('')
      .map((char) =>
        char.toUpperCase() === char && char !== '-' && char !== '7'
          ? `-${char.toLowerCase()}`
          : char,
      )
      .join('');
  };

  const shouldSkip = (prop) => {
    const skip = ['tertiary', 'shadow', 'scrim', 'error', 'background'];
    return skip.filter((v) => prop.toLowerCase().includes(v)).length > 0;
  };

  const light = {};
  const dark = {};
  Object.keys(theme.schemes.light.props).forEach((prop) => {
    if (shouldSkip(prop)) return;
    light[name(`--f7-md-${prop}`)] = hexFromArgb(theme.schemes.light.props[prop]);
  });
  Object.keys(theme.schemes.dark.props).forEach((prop) => {
    if (shouldSkip(prop)) return;
    dark[name(`--f7-md-${prop}`)] = hexFromArgb(theme.schemes.dark.props[prop]);
  });

  return { light, dark };
};

/* eslint no-control-regex: "off" */

let uniqueNumber = 1;

const Utils = {
  uniqueNumber() {
    uniqueNumber += 1;
    return uniqueNumber;
  },
  id(mask = 'xxxxxxxxxx', map = '0123456789abcdef') {
    return $.uid(mask, map);
  },
  mdPreloaderContent: `
		<span class="preloader-inner">
			<svg viewBox="0 0 36 36">
				<circle cx="18" cy="18" r="16"></circle>
			</svg>
    </span>
  `.trim(),
  iosPreloaderContent: `
		<span class="preloader-inner">
			${[0, 1, 2, 3, 4, 5, 6, 7].map(() => '<span class="preloader-inner-line"></span>').join('')}
		</span>
  `.trim(),
  pcPreloaderContent: `
  <span class="preloader-inner">
    <span class="preloader-inner-circle"></span>
  </span>
`,
  eventNameToColonCase(eventName) {
    let hasColon;
    return eventName
      .split('')
      .map((char, index) => {
        if (char.match(/[A-Z]/) && index !== 0 && !hasColon) {
          hasColon = true;
          return `:${char.toLowerCase()}`;
        }
        return char.toLowerCase();
      })
      .join('');
  },
  deleteProps(obj) {
    $.deleteProps(obj);
  },
  requestAnimationFrame(cb) {
    return $.requestAnimationFrame(cb);
  },
  cancelAnimationFrame(id) {
    return $.cancelAnimationFrame(id);
  },
  nextTick(cb, delay = 0) {
    return $.nextTick(cb, delay);
  },
  nextFrame(cb) {
    return $.nextFrame(cb);
  },
  now() {
    return Date.now();
  },
  parseUrlQuery(url) {
    return $.urlParam(url);
  },
  getTranslate(el, axis = 'x') {
    return $.getTranslate(el, axis);
  },
  serializeObject(obj, parents = []) {
    if (typeof obj === 'string') return obj;
    const resultArray = [];
    const separator = '&';
    let newParents;
    function varName(name) {
      if (parents.length > 0) {
        let parentParts = '';
        for (let j = 0; j < parents.length; j += 1) {
          if (j === 0) parentParts += parents[j];
          else parentParts += `[${encodeURIComponent(parents[j])}]`;
        }
        return `${parentParts}[${encodeURIComponent(name)}]`;
      }
      return encodeURIComponent(name);
    }
    function varValue(value) {
      return encodeURIComponent(value);
    }
    Object.keys(obj).forEach(prop => {
      let toPush;
      if (Array.isArray(obj[prop])) {
        toPush = [];
        for (let i = 0; i < obj[prop].length; i += 1) {
          if (!Array.isArray(obj[prop][i]) && typeof obj[prop][i] === 'object') {
            newParents = parents.slice();
            newParents.push(prop);
            newParents.push(String(i));
            toPush.push(Utils.serializeObject(obj[prop][i], newParents));
          } else {
            toPush.push(`${varName(prop)}[]=${varValue(obj[prop][i])}`);
          }
        }
        if (toPush.length > 0) resultArray.push(toPush.join(separator));
      } else if (obj[prop] === null || obj[prop] === '') {
        resultArray.push(`${varName(prop)}=`);
      } else if (typeof obj[prop] === 'object') {
        // Object, convert to named array
        newParents = parents.slice();
        newParents.push(prop);
        toPush = Utils.serializeObject(obj[prop], newParents);
        if (toPush !== '') resultArray.push(toPush);
      } else if (typeof obj[prop] !== 'undefined' && obj[prop] !== '') {
        // Should be string or plain value
        resultArray.push(`${varName(prop)}=${varValue(obj[prop])}`);
      } else if (obj[prop] === '') resultArray.push(varName(prop));
    });
    return resultArray.join(separator);
  },
  isObject(o) {
    return typeof o === 'object' && o !== null && o.constructor && o.constructor === Object;
  },
  merge(...args) {
    return $.merge(...args);
  },
  extend(...args) {
    const to = args[0];
    args.splice(0, 1);
    return $.assign(to, ...args);
  },
  // 绑定类方法到类实例，复制类属性、方法到类
  bindMethods(instance, obj) {
    Object.keys(obj).forEach(key => {
      if (Utils.isObject(obj[key])) {
        Object.keys(obj[key]).forEach(subKey => {
          if (typeof obj[key][subKey] === 'function') {
            obj[key][subKey] = obj[key][subKey].bind(instance);
          }
        });
      }
      instance[key] = obj[key];
    });
  },
  flattenArray(...args) {
    const arr = [];
    args.forEach(arg => {
      if (Array.isArray(arg)) arr.push(...flattenArray(...arg));
      else arr.push(arg);
    });
    return arr;
  },
  colorHexToRgb(hex) {
    const h = hex.replace(
      /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
      (m, r, g, b) => r + r + g + g + b + b
    );
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h);
    return result ? result.slice(1).map(n => parseInt(n, 16)) : null;
  },
  colorRgbToHex(r, g, b) {
    const result = [r, g, b]
      .map(n => {
        const hex = n.toString(16);
        return hex.length === 1 ? `0${hex}` : hex;
      })
      .join('');
    return `#${result}`;
  },
  colorRgbToHsl(r, g, b) {
    r /= 255; // eslint-disable-line
    g /= 255; // eslint-disable-line
    b /= 255; // eslint-disable-line
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;
    let h;
    if (d === 0) h = 0;
    else if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else if (max === b) h = (r - g) / d + 4;
    const l = (min + max) / 2;
    const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
    if (h < 0) h = 360 / 60 + h;
    return [h * 60, s, l];
  },
  colorHslToRgb(h, s, l) {
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const hp = h / 60;
    const x = c * (1 - Math.abs((hp % 2) - 1));
    let rgb1;
    if (Number.isNaN(h) || typeof h === 'undefined') {
      rgb1 = [0, 0, 0];
    } else if (hp <= 1) rgb1 = [c, x, 0];
    else if (hp <= 2) rgb1 = [x, c, 0];
    else if (hp <= 3) rgb1 = [0, c, x];
    else if (hp <= 4) rgb1 = [0, x, c];
    else if (hp <= 5) rgb1 = [x, 0, c];
    else if (hp <= 6) rgb1 = [c, 0, x];
    const m = l - c / 2;
    return rgb1.map(n => Math.max(0, Math.min(255, Math.round(255 * (n + m)))));
  },
  colorHsbToHsl(h, s, b) {
    const HSL = {
      h,
      s: 0,
      l: 0,
    };
    const HSB = {h, s, b};

    HSL.l = ((2 - HSB.s) * HSB.b) / 2;
    HSL.s =
      HSL.l && HSL.l < 1 ? (HSB.s * HSB.b) / (HSL.l < 0.5 ? HSL.l * 2 : 2 - HSL.l * 2) : HSL.s;

    return [HSL.h, HSL.s, HSL.l];
  },
  colorHslToHsb(h, s, l) {
    const HSB = {
      h,
      s: 0,
      b: 0,
    };
    const HSL = {h, s, l};

    const t = HSL.s * (HSL.l < 0.5 ? HSL.l : 1 - HSL.l);
    HSB.b = HSL.l + t;
    HSB.s = HSL.l > 0 ? (2 * t) / HSB.b : HSB.s;

    return [HSB.h, HSB.s, HSB.b];
  },
  getShadeTintColors(rgb) {
    const hsl = Utils.colorRgbToHsl(...rgb);
    const hslShade = [hsl[0], hsl[1], Math.max(0, hsl[2] - 0.08)];
    const hslTint = [hsl[0], hsl[1], Math.max(0, hsl[2] + 0.08)];
    const shade = Utils.colorRgbToHex(...Utils.colorHslToRgb(...hslShade));
    const tint = Utils.colorRgbToHex(...Utils.colorHslToRgb(...hslTint));
    return {shade, tint};
  },
  colorThemeCSSProperties(...args) {
    let hex;
    let rgb;
    if (args.length === 1) {
      hex = args[0];
      rgb = Utils.colorHexToRgb(hex);
    } else if (args.length === 3) {
      rgb = args;
      hex = Utils.colorRgbToHex(...rgb);
    }
    if (!rgb) return {};
    const {light, dark} = materialColors(hex);
    const shadeTintIos = Utils.getShadeTintColors(rgb);
    const shadeTintMdLight = Utils.getShadeTintColors(
      Utils.colorHexToRgb(light['--f7-md-primary'])
    );
    const shadeTintMdDark = Utils.getShadeTintColors(Utils.colorHexToRgb(dark['--f7-md-primary']));
    Object.keys(light).forEach(key => {
      if (key.includes('surface-')) {
        light[`${key}-rgb`] = Utils.colorHexToRgb(light[key]);
      }
    });
    Object.keys(dark).forEach(key => {
      if (key.includes('surface-')) {
        dark[`${key}-rgb`] = Utils.colorHexToRgb(dark[key]);
      }
    });
    return {
      ios: {
        '--f7-theme-color': 'var(--f7-ios-primary)',
        '--f7-theme-color-rgb': 'var(--f7-ios-primary-rgb)',
        '--f7-theme-color-shade': 'var(--f7-ios-primary-shade)',
        '--f7-theme-color-tint': 'var(--f7-ios-primary-tint)',
      },
      md: {
        '--f7-theme-color': 'var(--f7-md-primary)',
        '--f7-theme-color-rgb': 'var(--f7-md-primary-rgb)',
        '--f7-theme-color-shade': 'var(--f7-md-primary-shade)',
        '--f7-theme-color-tint': 'var(--f7-md-primary-tint)',
      },
      light: {
        '--f7-ios-primary': hex,
        '--f7-ios-primary-shade': shadeTintIos.shade,
        '--f7-ios-primary-tint': shadeTintIos.tint,
        '--f7-ios-primary-rgb': rgb.join(', '),
        '--f7-md-primary-shade': shadeTintMdLight.shade,
        '--f7-md-primary-tint': shadeTintMdLight.tint,
        '--f7-md-primary-rgb': Utils.colorHexToRgb(light['--f7-md-primary']).join(', '),
        ...light,
      },
      dark: {
        '--f7-md-primary-shade': shadeTintMdDark.shade,
        '--f7-md-primary-tint': shadeTintMdDark.tint,
        '--f7-md-primary-rgb': Utils.colorHexToRgb(dark['--f7-md-primary']).join(', '),
        ...dark,
      },
    };
  },
  colorThemeCSSStyles(colors = {}) {
    const stringifyObject = obj => {
      let res = '';
      Object.keys(obj).forEach(key => {
        res += `${key}:${obj[key]};`;
      });
      return res;
    };
    const colorVars = Utils.colorThemeCSSProperties(colors.primary);

    const primary = [
      `:root{`,
      stringifyObject(colorVars.light),
      `--swiper-theme-color:var(--f7-theme-color);`,
      ...Object.keys(colors).map(colorName => `--f7-color-${colorName}: ${colors[colorName]};`),
      `}`,
      `.dark{`,
      stringifyObject(colorVars.dark),
      `}`,
      `.ios, .ios .dark{`,
      stringifyObject(colorVars.ios),
      '}',
      `.md, .md .dark{`,
      stringifyObject(colorVars.md),
      '}',
    ].join('');

    const restVars = {};

    Object.keys(colors).forEach(colorName => {
      const colorValue = colors[colorName];
      restVars[colorName] = Utils.colorThemeCSSProperties(colorValue);
    });

    // rest
    let rest = '';

    Object.keys(colors).forEach(colorName => {
      const {light, dark, ios, md} = restVars[colorName];

      const whiteColorVars = `
			--f7-ios-primary: #ffffff;
			--f7-ios-primary-shade: #ebebeb;
			--f7-ios-primary-tint: #ffffff;
			--f7-ios-primary-rgb: 255, 255, 255;
			--f7-md-primary-shade: #eee;
			--f7-md-primary-tint: #fff;
			--f7-md-primary-rgb: 255, 255, 255;
			--f7-md-primary: #fff;
			--f7-md-on-primary: #000;
			--f7-md-primary-container: #fff;
			--f7-md-on-primary-container: #000;
			--f7-md-secondary: #fff;
			--f7-md-on-secondary: #000;
			--f7-md-secondary-container: #555;
			--f7-md-on-secondary-container: #fff;
			--f7-md-surface: #fff;
			--f7-md-on-surface: #000;
			--f7-md-surface-variant: #333;
			--f7-md-on-surface-variant: #fff;
			--f7-md-outline: #fff;
			--f7-md-outline-variant: #fff;
			--f7-md-inverse-surface: #000;
			--f7-md-inverse-on-surface: #fff;
			--f7-md-inverse-primary: #000;
			--f7-md-surface-1: #f8f8f8;
			--f7-md-surface-2: #f1f1f1;
			--f7-md-surface-3: #e7e7e7;
			--f7-md-surface-4: #e1e1e1;
			--f7-md-surface-5: #d7d7d7;
			--f7-md-surface-variant-rgb: 51, 51, 51;
			--f7-md-on-surface-variant-rgb: 255, 255, 255;
			--f7-md-surface-1-rgb: 248, 248, 248;
			--f7-md-surface-2-rgb: 241, 241, 241;
			--f7-md-surface-3-rgb: 231, 231, 231;
			--f7-md-surface-4-rgb: 225, 225, 225;
			--f7-md-surface-5-rgb: 215, 215, 215;
			`;
      const blackColorVars = `
			--f7-ios-primary: #000;
			--f7-ios-primary-shade: #000;
			--f7-ios-primary-tint: #232323;
			--f7-ios-primary-rgb: 0, 0, 0;
			--f7-md-primary-shade: #000;
			--f7-md-primary-tint: #232323;
			--f7-md-primary-rgb: 0, 0, 0;
			--f7-md-primary: #000;
			--f7-md-on-primary: #fff;
			--f7-md-primary-container: #000;
			--f7-md-on-primary-container: #fff;
			--f7-md-secondary: #000;
			--f7-md-on-secondary: #fff;
			--f7-md-secondary-container: #aaa;
			--f7-md-on-secondary-container: #000;
			--f7-md-surface: #000;
			--f7-md-on-surface: #fff;
			--f7-md-surface-variant: #ccc;
			--f7-md-on-surface-variant: #000;
			--f7-md-outline: #000;
			--f7-md-outline-variant: #000;
			--f7-md-inverse-surface: #fff;
			--f7-md-inverse-on-surface: #000;
			--f7-md-inverse-primary: #fff;
			--f7-md-surface-1: #070707;
			--f7-md-surface-2: #161616;
			--f7-md-surface-3: #232323;
			--f7-md-surface-4: #303030;
			--f7-md-surface-5: #373737;
			--f7-md-surface-variant-rgb: 204, 204, 204;
			--f7-md-on-surface-variant-rgb: 0, 0, 0;
			--f7-md-surface-1-rgb: 7, 7, 7;
			--f7-md-surface-2-rgb: 22, 22, 22;
			--f7-md-surface-3-rgb: 35, 35, 35;
			--f7-md-surface-4-rgb: 48, 48, 48;
			--f7-md-surface-5-rgb: 55, 55, 55;
			`;
      /* eslint-disable */
      const lightString =
        colorName === 'white'
          ? whiteColorVars
          : colorName === 'black'
          ? blackColorVars
          : stringifyObject(light);
      const darkString =
        colorName === 'white'
          ? whiteColorVars
          : colorName === 'black'
          ? blackColorVars
          : stringifyObject(dark);
      /* eslint-enable */
      rest += [
        `.color-${colorName} {`,
        lightString,
        `--swiper-theme-color: var(--f7-theme-color);`,
        `}`,
        `.color-${colorName}.dark, .color-${colorName} .dark, .dark .color-${colorName} {`,
        darkString,
        `--swiper-theme-color: var(--f7-theme-color);`,
        `}`,
        `.ios .color-${colorName}, .ios.color-${colorName}, .ios .dark .color-${colorName}, .ios .dark.color-${colorName} {`,
        stringifyObject(ios),
        `}`,
        `.md .color-${colorName}, .md.color-${colorName}, .md .dark .color-${colorName}, .md .dark.color-${colorName} {`,
        stringifyObject(md),
        `}`,

        // text color
        `.text-color-${colorName} {`,
        `--f7-theme-color-text-color: ${colors[colorName]};`,
        `}`,

        // bg color
        `.bg-color-${colorName} {`,
        `--f7-theme-color-bg-color: ${colors[colorName]};`,
        `}`,

        // border color
        `.border-color-${colorName} {`,
        `--f7-theme-color-border-color: ${colors[colorName]};`,
        `}`,

        // ripple color
        `.ripple-color-${colorName} {`,
        `--f7-theme-color-ripple-color: rgba(${light['--f7-ios-primary-rgb']}, 0.3);`,
        `}`,
      ].join('');
    });

    return `${primary}${rest}`;
  },
};

/**
 * 事件类，提供对象的事件侦听、触发，只在类实例中有效。
 * 需要支持事件的对象，可以从这个类继承，则类实例具备事件功能。
 * Fork from Framework7，
 */
class Event {
  /**
   * 页面Page实例事件触发，f7 UI组件需要
   * @param {Object} params 参数
   * @param {Array} parents 事件组件的父对象，用于向上传播事件！
   * 组件的parents 是 Page实例，Page实例的Parent是App实例
   * @param {String} pre 向上传播前缀，避免事件重名冲突
   * @private
   */
  constructor(params = {}, parents = [], pre = '') {
    const m = this;
    m.params = params;

    if (parents) {
      if (!Array.isArray(parents)) m.eventsParents = [parents];
      else m.eventsParents = parents.filter(p => p);
    } else m.eventsParents = [];

    m.eventsListeners = {};
    m.pre = pre;

    // 通过 params 中的 on 加载事件响应
    if (m.params && m.params.on) {
      Object.keys(m.params.on).forEach(eventName => {
        m.on(eventName, m.params.on[eventName]);
      });
    }
  }

  /**
   * 添加事件响应函数
   * @param {*} events 多个事件用空格隔开
   * @param {*} handler 事件响应函数
   * @param {*} priority 是否优先，缺省不优先
   * @returns
   */
  on(events, handler, priority = false) {
    const m = this;
    if (typeof handler !== 'function') return m;
    const method = priority ? 'unshift' : 'push';
    events.split(' ').forEach(event => {
      const lis = {
        owner: '',
        appName: '',
        handler,
      };

      // 应用事件
      if (event.includes('app::')) {
        let page = null;
        if ($.isPage(m)) page = m;
        else if ($.isPage(m?.page)) page = m.page;
        else if ($.isPage(m?.parent)) page = m.parent;

        if (page && page.app && $.isApp(page.app)) {
          lis.owner = page.owner;
          lis.appName = page.appName;
          const {app} = page;

          const ev = event.replace('app::', '');
          if (!app.eventsListeners[ev]) app.eventsListeners[ev] = [];
          app.eventsListeners[ev][method](lis);
        }
      } else {
        // 对象自身事件
        if (!m.eventsListeners[event]) m.eventsListeners[event] = [];

        m.eventsListeners[event][method](lis);
      }
    });

    return m;
  }

  /**
   * 调用一次后清除
   * @param {*} events 多个事件用空格隔开
   * @param {*} handler 事件响应函数
   * @param {*} priority 是否优先，缺省不优先
   * @returns
   */
  once(events, handler, priority = false) {
    const m = this;
    if (typeof handler !== 'function') return m;

    // 调用一次后自动删除事件
    function onceHandler(...args) {
      m.off(events, onceHandler);
      if (onceHandler.proxy) {
        onceHandler.proxy.apply(m, args);
        delete onceHandler.proxy;
      }
    }

    onceHandler.proxy = handler;
    return m.on(events, onceHandler, priority);
  }

  /**
   * 删除事件响应函数
   * @param {*} events 事件，多个事件空格隔开，不传则清除该对象所有事件响应函数
   * @param {*} handler 事件响应函数
   * @returns
   */
  off(events, handler) {
    const m = this;
    if (!m.eventsListeners) return m;

    if (events) {
      events.split(' ').forEach(event => {
        if (typeof handler === 'undefined') m.eventsListeners[event] = [];
        else if (m.eventsListeners[event]) {
          const arr = m.eventsListeners[event];
          for (let i = arr.length - 1; i >= 0; i--) {
            const lis = arr[i];
            if (lis.handler === handler || lis.handler?.proxy === handler)
              arr.splice(i, 1);
          }
        }
      });
    } else m.eventsListeners = {};

    return m;
  }

  /**
   * 事件触发，应用事件只能由 Page 实例触发，才能按同页面所有者触发事件
   * @param {*} 事件，字符串、数组或对象
   * @param {*} 数据，传递到事件响应函数的数据
   */
  emit(...args) {
    const m = this;
    if (!m.eventsListeners) return m;

    let events;
    let data;
    let context;
    let eventsParents;

    let pop = false;

    let event = args[0]; // 事件
    if (!event) return m;

    // 原始触发事件
    if (typeof event === 'string' || Array.isArray(event)) {
      event = event.split(' ');
      // 带前缀，自动添加前缀向父节点传递事件
      if (m.pre) {
        events = [];
        event.forEach(ev => {
          events.push(`.${ev}`); // 本组件事件
          events.push(`${m.pre}${ev[0].toUpperCase()}${ev.substr(1)}`); // 向上事件
        });
      } else events = event;

      data = args.slice(1, args.length);
      context = m;
      eventsParents = m.eventsParents;
    } else {
      // 冒泡向上传递事件，或指定对象触发事件
      pop = event.pop;
      events = event.events;
      data = event.data;
      context = event.context || m;
      eventsParents = event.local ? [] : event.parents || m.eventsParents;
    }

    const eventsArray = Array.isArray(events) ? events : events.split(' ');

    // 本对象事件
    // ['local:event'] or ['.event']，不向父组件传递
    const selfEvents = eventsArray.map(ev => ev.replace(/local::|^[.]/, ''));

    // 非本对象事件，向上传递时，转换为对象，记录来源
    let parentEvents = null;
    if (pop) parentEvents = event;
    else {
      const popEvents = eventsArray.filter(ev => !ev.match(/^local::|^[.]/));
      if (popEvents?.length) {
        parentEvents = {
          pop: true, // 冒泡事件
          events: popEvents,
          context: m, // 事件发起者
          data,
          owner: '',
          appName: '',
        };
      }
    }

    // 记录page属性，标记事件来源，冒泡到app时判断是否触发本页面应用事件
    if (parentEvents && $.isPage(m)) {
      parentEvents.owner = m?.owner;
      parentEvents.appName = m?.appName;
    }

    // 调用对象事件函数，父对象emit后，调用父对象事件函数
    selfEvents.forEach(ev => {
      if (m.eventsListeners && m.eventsListeners[ev]) {
        const handlers = [];
        m.eventsListeners[ev].forEach(lis => {
          // 应用事件，需判断所有者
          if (lis.owner && lis.appName) {
            // 同一html页面运行多个应用页面层时，只有所有者、应用名称相同才能触发跨页面事件，避免跨应用事件安全问题。
            // 页面冒泡到应用事件
            if (pop && lis.owner === ev.owner && lis.appName === ev.appName)
              handlers.push(lis.handler);
          } else handlers.push(lis.handler);
        });

        // 由 window 对象异步调用，而不是事件对象直接调用
        handlers.forEach(fn => {
          // setTimeout(() => fn.apply(context, data), 0);
          fn.apply(context, data); // this 指针为原始触发事件对象，事件函数中可引用
        });
      }
    });

    // 向上一级一级迭代冒泡传递后，触发父对象事件响应函数
    if (parentEvents && eventsParents?.length > 0) {
      eventsParents.forEach(eventsParent => eventsParent.emit(parentEvents));
    }

    return m;
  }
}

/**
 * 所有页面从该类继承，并必须实现 load 事件！
 * 事件
 *  五个个事件：load -> ready -> show / hide -> unload
 *  load：必选，加载视图、代码，第一次加载后缓存，后续不会重复加载，动态代码也要在这里加载
 *    参数；param
 *    如果需要前路由数据，通过 $.lastPage.data 访问
 *    view 还未创建，隐藏page 不存在
 *  ready：可选，对视图中的对象事件绑定，已经缓存的视图，比如回退，不会再次触发 ready
 *    参数；view、param
 *    如果需要前路由数据，通过 $.lastPage.data 访问
 *  show：可选，视图显示时触发，可以接收参数，操作视图，无论是否缓存（比如回退）都会触发
 *    对于已经加载、绑定隐藏（缓存）的页面，重新显示时，不会触发load和ready，只会触发show
 *    参数：view、param
 *  hide：可选，视图卸载删除时触发，适合保存卸载页面的数据，卸载的页面从页面删除，进入缓存
 *  unload：可选，页面从缓存中删除时触发，目前暂未实现
 *
 * 数据传递
 *  每个页面都能访问当前路由，路由存在以下参数，用户跨页面数据传递
 *  url：页面跳转时的原始网址
 *  param：页面网址及go中传入的参数合并，保存在 param 中
 *  data：路由中需要保存的数据
 *  view：当前页面层，dom 对象，已经包括绑定的事件
 *  $.page：当前页面对象
 *  $.lastPage：前路由，可通过该参数，获取前路由的 data，在后续路由中使用
 *
 */


class Page extends Event {
  constructor(app, name, title, style) {
    super(null, [app]);
    this.app = app; // 应用实例
    this.cfg = app.cfg;
    this.name = name; // 名称，可带路径 admin/login
    this.title = title; // 浏览器标题
    this.style = style || `./page/${name}.css`;

    // 以下变量由路由器赋值
    this.owner = '';
    this.appName = '';
    this.path = '';
    this.view = null; // 页面的div层$Dom对象，router创建实例时赋值
    this.dom = null; // 页面的div层dom对象，router创建实例时赋值
    this.$el = null; // $dom === view
    this.el = null; // dom === dom

    this.html = ''; // 页面html文本，router创建实例时赋值
    this.css = ''; // 页面css样式，router创建实例时赋值
    this.js = ''; // 页面代码，router创建实例时赋值
    this.data = {}; // 页面数据对象
    this.param = {}; // 页面切换传递进来的参数对象，router创建实例时赋值
  }

  /**
   * 异步加载页面视图内容
   * 返回Promise对象
   * @param {*} param
   * @param {*} cfg
   */
  load(param) {
    // $.assign(this.data, param);
    this.emit('local::load pageLoad', param);
    this.emit('pageLoad', this);
  }

  /**
   * 在已经加载就绪的视图上操作
   * @param {*} view 页面层的 Dom 对象，已经使用`$(#page-name)`，做了处理
   * @param {*} param go 函数的参数，或 网址中 url 中的参数
   * @param {*} back 是否为回退，A->B, B->A，这种操作属于回退
   */
  ready(view, param, back) {
    // $.assign(this, {page, param, back});
    // $.assign(this.data, param);
    // 隐藏所有模板
    this.init();
    this.emit('local::ready', view, param, back);
    // 向上触发跨页面事件，存在安全问题
    this.emit('pageReady', this);
  }

  /**
   * 对页面进行初始化处理，或页面内容动态变更时，对局部页面容器进行初始化
   * @param {*} v dom 容器，默认为页面实例的view
   */
  init(v) {
    const {view} = this;
    v = v ? $(v) : view;
  }

  // 显示已加载的页面
  // view：页面Dom层，param：参数
  show(view, param) {
    // 隐藏所有模板
    view.qus('[name$=-tp]').hide();
    // 防止空链接，刷新页面
    view.qus('a[href=""]').attr('href', 'javascript:;');
    // this.init();
    if (this.reset) this.reset();
    this.emit('local::show', view, param);
    // 向上触发跨页面事件，存在安全问题
    this.emit('pageShow', this);
  }

  // 回退显示已加载的页面
  // view：页面Dom层，param：参数
  back(view, param) {
    // 隐藏所有模板
    view.qus('[name$=-tp]').hide();
    // 防止空链接，刷新页面
    view.qus('a[href=""]').attr('href', 'javascript:;');

    this.emit('local::back', view, param);
    // 向上触发跨页面事件，存在安全问题
    this.emit('pageBack', this);
  }

  hide(view) {
    this.emit('local::hide', view);
    // 向上触发跨页面事件，存在安全问题
    this.emit('pageHide', this);
  }

  unload(view) {
    this.emit('local::unload', view);
    // 向上触发跨页面事件，存在安全问题
    this.emit('pageUnload', this);
  }
}

/**
 * Wia app、router等继承类，通过模块化扩展类功能
 */

class Module extends Event {
  constructor(params = {}, parents = []) {
    super(params, parents);
    const self = this;
    self.params = params;
  }

  // eslint-disable-next-line
  useModuleParams(module, instanceParams) {
    if (module.params) {
      const originalParams = {};
      Object.keys(module.params).forEach(paramKey => {
        if (typeof instanceParams[paramKey] === 'undefined') return;
        originalParams[paramKey] = $.extend({}, instanceParams[paramKey]);
      });
      $.extend(instanceParams, module.params);
      Object.keys(originalParams).forEach(paramKey => {
        $.extend(instanceParams[paramKey], originalParams[paramKey]);
      });
    }
  }

  useModulesParams(instanceParams) {
    const instance = this;
    if (!instance.modules) return;
    Object.keys(instance.modules).forEach(moduleName => {
      const module = instance.modules[moduleName];
      // Extend params
      if (module.params) {
        $.extend(instanceParams, module.params);
      }
    });
  }

  /**
   * 将扩展模块的相关方法、事件加载到类实例
   * @param {*} moduleName 扩展模块名称
   * @param {*} moduleParams
   */
  useModule(moduleName = '', moduleParams = {}) {
    const instance = this;
    if (!instance.modules) return;

    // 从原型中获得的模块类引用
    const module =
      typeof moduleName === 'string'
        ? instance.modules[moduleName]
        : moduleName;
    if (!module) return;

    // 扩展实例的方法和属性，Extend instance methods and props
    if (module.instance) {
      Object.keys(module.instance).forEach(modulePropName => {
        const moduleProp = module.instance[modulePropName];
        if (typeof moduleProp === 'function') {
          instance[modulePropName] = moduleProp.bind(instance);
        } else {
          instance[modulePropName] = moduleProp;
        }
      });
    }

    // 将扩展模块中的on加载到实例的事件侦听中，比如 init 在实例初始化时被调用
    if (module.on && instance.on) {
      Object.keys(module.on).forEach(moduleEventName => {
        instance.on(moduleEventName, module.on[moduleEventName]);
      });
    }

    // 加载扩展模块的vnodeHooks，Add vnode hooks
    if (module.vnode) {
      if (!instance.vnodeHooks) instance.vnodeHooks = {};
      Object.keys(module.vnode).forEach(vnodeId => {
        Object.keys(module.vnode[vnodeId]).forEach(hookName => {
          const handler = module.vnode[vnodeId][hookName];
          if (!instance.vnodeHooks[hookName])
            instance.vnodeHooks[hookName] = {};
          if (!instance.vnodeHooks[hookName][vnodeId])
            instance.vnodeHooks[hookName][vnodeId] = [];
          instance.vnodeHooks[hookName][vnodeId].push(handler.bind(instance));
        });
      });
    }

    // 执行模块的create方法，模块实例化回调，Module create callback
    if (module.create) {
      module.create.bind(instance)(moduleParams);
    }
  }

  /**
   * 实例创建初始化时，执行扩展模块中定义的相关回调
   * @param {*} modulesParams
   */
  useModules(modulesParams = {}) {
    const instance = this;
    if (!instance.modules) return;
    Object.keys(instance.modules).forEach(moduleName => {
      const moduleParams = modulesParams[moduleName] || {};
      instance.useModule(moduleName, moduleParams);
    });
  }

  static set components(components) {
    const Class = this;
    if (!Class.use) return;
    Class.use(components);
  }

  /**
   * 将模块类装配到指定类的modules属性，用于扩展类
   * @param {*} module 模块类
   * @param  {...any} params 参数
   */
  static installModule(module, ...params) {
    const Class = this;
    if (!Class.prototype.modules) Class.prototype.modules = {};
    const name =
      module.name ||
      `${Object.keys(Class.prototype.modules).length}_${$.now()}`;
    // 原型属性中引用该模块类，类实例
    Class.prototype.modules[name] = module;
    // 模块如果定义了原型，则将模块原型加载到类原型
    if (module.proto) {
      Object.keys(module.proto).forEach(key => {
        Class.prototype[key] = module.proto[key];
      });
    }
    // 加载静态属性
    if (module.static) {
      Object.keys(module.static).forEach(key => {
        Class[key] = module.static[key];
      });
    }
    // 执行加载回调函数
    if (module.install) {
      module.install.apply(Class, params);
    }
    return Class;
  }

  /**
   * 加载类扩展模块到类
   * @param {*} module
   * @param  {...any} params
   */
  static use(module, ...params) {
    const Class = this;
    if (Array.isArray(module)) {
      module.forEach(m => Class.installModule(m));
      return Class;
    }
    return Class.installModule(module, ...params);
  }
}

/**
 * 扩展构造函数
 * @param {*} parameters
 */
function Constructors(parameters = {}) {
  const { defaultSelector, constructor: Constructor, domProp, app, addMethods } = parameters;
  const methods = {
    create(...args) {
      if (app) return new Constructor(app, ...args);
      return new Constructor(...args);
    },
    get(el = defaultSelector) {
      if (el instanceof Constructor) return el;
      const $el = $(el);
      if ($el.length === 0) return undefined;
      return $el[0][domProp];
    },
    destroy(el) {
      const instance = methods.get(el);
      if (instance && instance.destroy) return instance.destroy();
      return undefined;
    },
  };
  if (addMethods && Array.isArray(addMethods)) {
    addMethods.forEach(methodName => {
      methods[methodName] = (el = defaultSelector, ...args) => {
        const instance = methods.get(el);
        if (instance && instance[methodName]) return instance[methodName](...args);
        return undefined;
      };
    });
  }
  return methods;
}

function Modals(parameters = {}) {
  const { defaultSelector, constructor: Constructor, app } = parameters;
  const methods = $.extend(
    Constructors({
      defaultSelector,
      constructor: Constructor,
      app,
      domProp: 'f7Modal',
    }),
    {
      open(el, animate, targetEl) {
        let $el = $(el);
        if ($el.length > 1 && targetEl) {
          // check if same modal in other page
          const $targetPage = $(targetEl).parents('.page');
          if ($targetPage.length) {
            $el.each((modalEl) => {
              const $modalEl = $(modalEl);
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
        let instance = $el[0].f7Modal;
        if (!instance) {
          const params = $el.dataset();
          instance = new Constructor(app, { el: $el, ...params });
        }
        return instance.open(animate);
      },
      close(el = defaultSelector, animate, targetEl) {
        let $el = $(el);
        if (!$el.length) return undefined;
        if ($el.length > 1) {
          // check if close link (targetEl) in this modal
          let $parentEl;
          if (targetEl) {
            const $targetEl = $(targetEl);
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
        let instance = $el[0].f7Modal;
        if (!instance) {
          const params = $el.dataset();
          instance = new Constructor(app, { el: $el, ...params });
        }
        return instance.close(animate);
      },
    },
  );
  return methods;
}

/**
 * 动态加载扩展模块，被 App调用。
 * 通过写入页面标签实现动态加载js、css
 * wia base中已经实现了动态下载、加载模块功能，该模块应删除
 */

const fetchedModules = [];
function loadModule(moduleToLoad) {
  const App = this;

  return new Promise((resolve, reject) => {
    const app = App.instance;
    let modulePath;
    let moduleObj;
    let moduleFunc;
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
      const matchNamePattern = moduleToLoad.match(/([a-z0-9-]*)/i);
      if (
        moduleToLoad.indexOf('.') < 0 &&
        matchNamePattern &&
        matchNamePattern[0].length === moduleToLoad.length
      ) {
        if (!app || (app && !app.params.lazyModulesPath)) {
          reject(
            new Error(
              'Wia: "lazyModulesPath" app parameter must be specified to fetch module by name'
            )
          );
          return;
        }
        modulePath = `${app.params.lazyModulesPath}/${moduleToLoad}.js`;
      } else {
        modulePath = moduleToLoad;
      }
    } else if (typeof moduleToLoad === 'function') {
      moduleFunc = moduleToLoad;
    } else {
      // considering F7-Plugin object
      moduleObj = moduleToLoad;
    }

    if (moduleFunc) {
      const module = moduleFunc(App, false);
      if (!module) {
        reject(new Error("Wia: Can't find Wia component in specified component function"));
        return;
      }
      // Check if it was added
      if (App.prototype.modules && App.prototype.modules[module.name]) {
        resolve();
        return;
      }
      // Install It
      install(module);

      resolve();
    }
    if (moduleObj) {
      const module = moduleObj;
      if (!module) {
        reject(new Error("Wia: Can't find Wia component in specified component"));
        return;
      }
      // Check if it was added
      if (App.prototype.modules && App.prototype.modules[module.name]) {
        resolve();
        return;
      }
      // Install It
      install(module);

      resolve();
    }
    if (modulePath) {
      if (fetchedModules.indexOf(modulePath) >= 0) {
        resolve();
        return;
      }
      fetchedModules.push(modulePath);
      // 动态加载 js 脚本
      const scriptLoad = new Promise((resolveScript, rejectScript) => {
        App.request.get(
          modulePath,
          scriptContent => {
            const id = $.id();
            const callbackLoadName = `wia_component_loader_callback_${id}`;

            const scriptEl = document.createElement('script');
            scriptEl.innerHTML = `window.${callbackLoadName} = function (Wia, WiaAutoInstallComponent) {return ${scriptContent.trim()}}`;
            // 动态加载 js
            $('head').append(scriptEl);

            const componentLoader = window[callbackLoadName];
            delete window[callbackLoadName];
            $(scriptEl).remove();

            const module = componentLoader(App, false);

            if (!module) {
              rejectScript(new Error(`Wia: Can't find Wia component in ${modulePath} file`));
              return;
            }

            // Check if it was added
            if (App.prototype.modules && App.prototype.modules[module.name]) {
              resolveScript();
              return;
            }

            // Install It
            install(module);

            resolveScript();
          },
          (xhr, status) => {
            rejectScript(xhr, status);
          }
        );
      });

      // 动态加载css样式
      const styleLoad = new Promise(resolveStyle => {
        App.request.get(
          modulePath.replace('.js', app.rtl ? '.rtl.css' : '.css'),
          styleContent => {
            const styleEl = document.createElement('style');
            styleEl.innerHTML = styleContent;
            $('head').append(styleEl);

            resolveStyle();
          },
          () => {
            resolveStyle();
          }
        );
      });

      Promise.all([scriptLoad, styleLoad])
        .then(() => {
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    }
  });
}

// replace react, use by @babel/plugin-transform-react-jsx
/* eslint-disable prefer-rest-params */
function jsx(tag, props, ...args) {
  const attrs = props || {};
  const children = args || [];

  const attrsString = Object.keys(attrs)
    .map((attr) => {
      if (attr[0] === '_') {
        if (attrs[attr]) return attr.replace('_', '');
        return '';
      }
      return `${attr}="${attrs[attr]}"`;
    })
    .filter((attr) => !!attr)
    .join(' ');

  if (['path', 'img', 'circle', 'polygon', 'line', 'input'].indexOf(tag) >= 0) {
    return `<${tag} ${attrsString} />`.trim();
  }
  const childrenContent = children
    .filter((c) => !!c)
    .map((c) => (Array.isArray(c) ? c.join('') : c))
    .join('');
  return `<${tag} ${attrsString}>${childrenContent}</${tag}>`.trim();
}

const Resize = {
  name: 'resize',
  instance: {
    getSize() {
      const app = this;
      if (!app.root[0])
        return {width: 0, height: 0, left: 0, top: 0};
      const offset = app.root.offset();
      const [width, height, left, top] = [app.root[0].offsetWidth, app.root[0].offsetHeight, offset.left, offset.top];
      app.width = width;
      app.height = height;
      app.left = left;
      app.top = top;
      return { width, height, left, top };
    },
  },
  on: {
    init() {
      const app = this;

      // Get Size
      app.getSize();

      // Emit resize
      window.addEventListener('resize', () => {
        app.emit('resize');
      }, false);

      // Emit orientationchange
      window.addEventListener('orientationchange', () => {
        app.emit('orientationchange');
      });
    },
    orientationchange() {
      const app = this;
      // Fix iPad weird body scroll
      if (app.device.ipad) {
        document.body.scrollLeft = 0;
        setTimeout(() => {
          document.body.scrollLeft = 0;
        }, 0);
      }
    },
    resize() {
      const app = this;
      app.getSize();
    },
  },
};

/**
 * document 绑定click事件，传递到 app.on
 * 触发所有子模块的 clicks 
 * 支持touch则绑定touch，否则绑定click
 * 无论touch 还是 click事件，都会触发事件响应函数
 * @param {*} cb
 */
function bindClick(cb) {
  let touchStartX;
  let touchStartY;
  function touchStart(ev) {
    // ev.preventDefault();
    touchStartX = ev.changedTouches[0].clientX;
    touchStartY = ev.changedTouches[0].clientY;
  }
  function touchEnd(ev) {
    // ev.preventDefault();
    const x = Math.abs(ev.changedTouches[0].clientX - touchStartX);
    const y = Math.abs(ev.changedTouches[0].clientY - touchStartY);
    // console.log('touchEnd', {x, y});

    if (x <= 5 && y <= 5) {
      cb.call(this, ev);
    }
  }

  // 在捕捉时触发，不影响后续冒泡阶段再次触发
  if ($.support.touch) {
    // console.log('bind touch');
    document.addEventListener('touchstart', touchStart, true);
    document.addEventListener('touchend', touchEnd, true);
  } else {
    // console.log('bind click');
    document.addEventListener('click', cb, true);
  }
}

function initClicks(app) {
  function appClick(ev) {
    app.emit({
      events: 'click',
      data: [ev],
    });
  }

  function handleClicks(e) {
    const $clickedEl = $(e.target);
    const $clickedLinkEl = $clickedEl.closest('a');
    const isLink = $clickedLinkEl.length > 0;
    isLink && $clickedLinkEl.attr('href');

    // call Modules Clicks
    Object.keys(app.modules).forEach(moduleName => {
      const moduleClicks = app.modules[moduleName].clicks;
      if (!moduleClicks) return;
      if (e.preventF7Router) return;
      Object.keys(moduleClicks).forEach(clickSelector => {
        const matchingClickedElement = $clickedEl.closest(clickSelector).eq(0);
        if (matchingClickedElement.length > 0) {
          moduleClicks[clickSelector].call(
            app,
            matchingClickedElement,
            matchingClickedElement.dataset(),
            e
          );
        }
      });
    });
  }

  // 绑定click 或 touch 事件，触发时，发射click事件
  bindClick(appClick);
  // click event 响应
  app.on('click', handleClicks);
}

const Click = {
  name: 'clicks',
  params: {
    clicks: {
      // External Links
      externalLinks: '.ext',
    },
  },
  on: {
    // app 创建时被调用
    init() {
      const app = this;
      initClicks(app);
    },
  },
};

/* eslint-disable no-nested-ternary */


const {extend: extend$1} = Utils;
const {device: device$1, support: support$1} = $;

function initTouch() {
  const app = this;
  const params = app.params.touch;
  const useRipple = params[`${app.theme}TouchRipple`];

  if (device$1.ios && device$1.webView) {
    // Strange hack required for iOS 8 webview to work on inputs
    window.addEventListener('touchstart', () => {});
  }

  let touchStartX;
  let touchStartY;
  let targetElement;
  let isMoved;
  let tapHoldFired;
  let tapHoldTimeout;
  let preventClick;

  let activableElement;
  let activeTimeout;

  let rippleWave;
  let rippleTarget;
  let rippleTimeout;

  function findActivableElement(el) {
    const target = $(el);
    const parents = target.parents(params.activeStateElements);
    if (target.closest('.no-active-state').length) {
      return null;
    }
    let activable;
    if (target.is(params.activeStateElements)) {
      activable = target;
    }
    if (parents.length > 0) {
      activable = activable ? activable.add(parents) : parents;
    }
    if (activable && activable.length > 1) {
      const newActivable = [];
      let preventPropagation;
      for (let i = 0; i < activable.length; i += 1) {
        if (!preventPropagation) {
          newActivable.push(activable[i]);
          if (
            activable.eq(i).hasClass('prevent-active-state-propagation') ||
            activable.eq(i).hasClass('no-active-state-propagation')
          ) {
            preventPropagation = true;
          }
        }
      }
      activable = $(newActivable);
    }
    return activable || target;
  }

  function isInsideScrollableView(el) {
    const pageContent = el.parents('.page-content');
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

  // Ripple handlers
  function findRippleElement(el) {
    const rippleElements = params.touchRippleElements;
    const $el = $(el);
    if ($el.is(rippleElements)) {
      if ($el.hasClass('no-ripple')) {
        return false;
      }
      return $el;
    }
    if ($el.parents(rippleElements).length > 0) {
      const rippleParent = $el.parents(rippleElements).eq(0);
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
    const inScrollable = isInsideScrollableView(rippleTarget);

    if (!inScrollable) {
      removeRipple();
      createRipple(rippleTarget, touchStartX, touchStartY);
    } else {
      clearTimeout(rippleTimeout);
      rippleTimeout = setTimeout(() => {
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

  // Mouse Handlers
  function handleMouseDown(e) {
    const $activableEl = findActivableElement(e.target);
    if ($activableEl) {
      $activableEl.addClass('active-state');
      if ('which' in e && e.which === 3) {
        setTimeout(() => {
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

    // Remove Active State
    clearTimeout(activeTimeout);
    clearTimeout(tapHoldTimeout);
    if (params.activeState) {
      removeActive();
    }

    // Remove Ripple
    if (useRipple) {
      rippleTouchEnd();
    }
  }

  let isScrolling;
  let isSegmentedStrong = false;
  let segmentedStrongEl = null;

  const touchMoveActivableIos = '.dialog-button, .actions-button';
  let isTouchMoveActivable = false;
  let touchmoveActivableEl = null;

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
      tapHoldTimeout = setTimeout(() => {
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
    isSegmentedStrong = e.target.closest(
      '.segmented-strong .button-active, .segmented-strong .tab-link-active'
    );
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
    let touch;
    let distance;
    let shouldRemoveActive = true;

    if (e.type === 'touchmove') {
      touch = e.targetTouches[0];
      distance = params.touchClicksDistanceThreshold;
    }

    const touchCurrentX = e.targetTouches[0].pageX;
    const touchCurrentY = e.targetTouches[0].pageY;

    if (typeof isScrolling === 'undefined') {
      isScrolling = !!(
        isScrolling || Math.abs(touchCurrentY - touchStartY) > Math.abs(touchCurrentX - touchStartX)
      );
    }

    if (isTouchMoveActivable || (!isScrolling && isSegmentedStrong && segmentedStrongEl)) {
      if (e.cancelable) e.preventDefault();
    }

    if (!isScrolling && isSegmentedStrong && segmentedStrongEl) {
      const elementFromPoint = document.elementFromPoint(
        e.targetTouches[0].clientX,
        e.targetTouches[0].clientY
      );
      const buttonEl = elementFromPoint.closest(
        '.segmented-strong .button:not(.button-active):not(.tab-link-active)'
      );
      if (buttonEl && segmentedStrongEl.contains(buttonEl)) {
        $(buttonEl).trigger('click', 'f7Segmented');
        targetElement = buttonEl;
      }
    }

    if (distance && touch) {
      const {pageX, pageY} = touch;
      if (Math.abs(pageX - touchStartX) > distance || Math.abs(pageY - touchStartY) > distance) {
        isMoved = true;
      }
    } else {
      isMoved = true;
    }

    if (isMoved) {
      preventClick = true;
      // Keep active state on touchMove (for dialog and actions buttons)
      if (isTouchMoveActivable) {
        const elementFromPoint = document.elementFromPoint(
          e.targetTouches[0].clientX,
          e.targetTouches[0].clientY
        );
        touchmoveActivableEl = elementFromPoint.closest(touchMoveActivableIos);
        if (
          touchmoveActivableEl &&
          activableElement &&
          activableElement[0] === touchmoveActivableEl
        ) {
          shouldRemoveActive = false;
        } else if (touchmoveActivableEl) {
          setTimeout(() => {
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
    if ((params.tapHoldPreventClicks && tapHoldFired) || preventClick) {
      if (e.cancelable) e.preventDefault();
      preventClick = true;
      return false;
    }
    return true;
  }

  function handleClick(e) {
    const isOverswipe = e && e.detail && e.detail === 'f7Overswipe';
    const isSegmented = e && e.detail && e.detail === 'f7Segmented';
    // eslint-disable-next-line
    const isTouchMoveActivable = e && e.detail && e.detail === 'f7TouchMoveActivable';
    let localPreventClick = preventClick;
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
      tapHoldTimeout = setTimeout(
        () => {
          tapHoldFired = false;
        },
        device$1.ios || device$1.androidChrome ? 100 : 400
      );
    }
    preventClick = false;
    targetElement = null;

    return !localPreventClick;
  }

  /**
   * document touch �¼����ݸ� app.on
   * @param {*} name
   * @param {*} e
   */
  function emitAppTouchEvent(name, e) {
    app.emit({
      events: name,
      data: [e],
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

  const passiveListener = support$1.passiveListener ? {passive: true} : false;
  const passiveListenerCapture = support$1.passiveListener ? {passive: true, capture: true} : true;
  const activeListener = support$1.passiveListener ? {passive: false} : false;
  const activeListenerCapture = support$1.passiveListener ? {passive: false, capture: true} : true;

  // document touch �¼� ���ݸ� app.on
  if (support$1.passiveListener) {
    document.addEventListener(app.touchEvents.start, appTouchStartActive, activeListenerCapture);
    document.addEventListener(app.touchEvents.move, appTouchMoveActive, activeListener);
    document.addEventListener(app.touchEvents.end, appTouchEndActive, activeListener);

    document.addEventListener(app.touchEvents.start, appTouchStartPassive, passiveListenerCapture);
    document.addEventListener(app.touchEvents.move, appTouchMovePassive, passiveListener);
    document.addEventListener(app.touchEvents.end, appTouchEndPassive, passiveListener);
  } else {
    document.addEventListener(
      app.touchEvents.start,
      e => {
        appTouchStartActive(e);
        appTouchStartPassive(e);
      },
      true
    );
    document.addEventListener(
      app.touchEvents.move,
      e => {
        appTouchMoveActive(e);
        appTouchMovePassive(e);
      },
      false
    );
    document.addEventListener(
      app.touchEvents.end,
      e => {
        appTouchEndActive(e);
        appTouchEndPassive(e);
      },
      false
    );
  }

  if (support$1.touch) {
    app.on('click', handleClick);
    app.on('touchstart', handleTouchStart);
    app.on('touchmove', handleTouchMove);
    app.on('touchend', handleTouchEnd);
    document.addEventListener('touchcancel', handleTouchCancel, {passive: true});
  } else if (params.activeState) {
    app.on('touchstart', handleMouseDown);
    app.on('touchmove', handleMouseMove);
    app.on('touchend', handleMouseUp);
    document.addEventListener('pointercancel', handleMouseUp, {passive: true});
  }

  document.addEventListener('contextmenu', e => {
    if (
      params.disableContextMenu &&
      (device$1.ios ||
        device$1.android ||
        device$1.cordova ||
        (window.Capacitor && window.Capacitor.isNative))
    ) {
      e.preventDefault();
    }
    if (useRipple) {
      if (activableElement) removeActive();
      rippleTouchEnd();
    }
  });
}

const Touch = {
  name: 'touch',
  params: {
    touch: {
      // Clicks
      touchClicksDistanceThreshold: 5,
      // ContextMenu
      disableContextMenu: false,
      // Tap Hold
      tapHold: false,
      tapHoldDelay: 750,
      tapHoldPreventClicks: true,
      // Active State
      activeState: true,
      activeStateElements:
        'a, button, label, span, .actions-button, .stepper-button, .stepper-button-plus, .stepper-button-minus, .card-expandable, .link, .item-link, .accordion-item-toggle',
      activeStateOnMouseMove: false,
      mdTouchRipple: true,
      iosTouchRipple: false,
      touchRippleElements:
        '.ripple, .link, .item-link, .list label.item-content, .list-button, .links-list a, .button, button, .input-clear-button, .dialog-button, .tab-link, .item-radio, .item-checkbox, .actions-button, .searchbar-disable-button, .fab a, .checkbox, .radio, .data-table .sortable-cell:not(.input-cell), .notification-close-button, .stepper-button, .stepper-button-minus, .stepper-button-plus, .list.accordion-list .accordion-item-toggle',
      touchRippleInsetElements:
        '.ripple-inset, .icon-only, .searchbar-disable-button, .input-clear-button, .notification-close-button, .md .navbar .link.back',
    },
  },

  create() {
    const app = this;
    extend$1(app, {
      touchEvents: {
        start: support$1.touch ? 'touchstart' : support$1.pointerEvents ? 'pointerdown' : 'mousedown',
        move: support$1.touch ? 'touchmove' : support$1.pointerEvents ? 'pointermove' : 'mousemove',
        end: support$1.touch ? 'touchend' : support$1.pointerEvents ? 'pointerup' : 'mouseup',
      },
    });
  },
  on: {
    init: initTouch,
  },
};

const SW = {
  registrations: [],
  register(path, scope) {
    const app = this;
    if (!('serviceWorker' in window.navigator) || !app.serviceWorker.container) {
      return new Promise((resolve, reject) => {
        reject(new Error('Service worker is not supported'));
      });
    }
    return new Promise((resolve, reject) => {
      app.serviceWorker.container.register(path, (scope ? { scope } : {}))
        .then((reg) => {
          SW.registrations.push(reg);
          app.emit('serviceWorkerRegisterSuccess', reg);
          resolve(reg);
        }).catch((error) => {
          app.emit('serviceWorkerRegisterError', error);
          reject(error);
        });
    });
  },
  unregister(registration) {
    const app = this;
    if (!('serviceWorker' in window.navigator) || !app.serviceWorker.container) {
      return new Promise((resolve, reject) => {
        reject(new Error('Service worker is not supported'));
      });
    }
    let registrations;
    if (!registration)
      registrations = SW.registrations;
    else if (Array.isArray(registration))
      registrations = registration;
    else
      registrations = [registration];
    return Promise.all(registrations.map(reg => new Promise((resolve, reject) => {
      reg.unregister()
        .then(() => {
          if (SW.registrations.indexOf(reg) >= 0) {
            SW.registrations.splice(SW.registrations.indexOf(reg), 1);
          }
          app.emit('serviceWorkerUnregisterSuccess', reg);
          resolve();
        })
        .catch((error) => {
          app.emit('serviceWorkerUnregisterError', reg, error);
          reject(error);
        });
    })));
  },
};

const SW$1 = {
  name: 'sw',
  params: {
    serviceWorker: {
      path: undefined,
      scope: undefined,
    },
  },
  create() {
    const app = this;
    $.extend(app, {
      serviceWorker: {
        container: ('serviceWorker' in window.navigator) ? window.navigator.serviceWorker : undefined,
        registrations: SW.registrations,
        register: SW.register.bind(app),
        unregister: SW.unregister.bind(app),
      },
    });
  },
  on: {
    init() {
      if (!('serviceWorker' in window.navigator))
        return;
      const app = this;
      if (app.device.cordova || (window.Capacitor && window.Capacitor.isNative)) return;
      if (!app.serviceWorker.container)
        return;
      const paths = app.params.serviceWorker.path;
      const scope = app.params.serviceWorker.scope;
      if (!paths || (Array.isArray(paths) && !paths.length))
        return;
      const toRegister = Array.isArray(paths) ? paths : [paths];
      toRegister.forEach((path) => {
        app.serviceWorker.register(path, scope);
      });
    },
  },
};

/**
 * Wia App 基类，从 Module 和 Event 继承。
 */
// 使用 rollup打包注意
// dom 独立，不打入 core！！！
// import $ from '@wiajs/dom'; // dom操作库，这种引用，导致 dom的压缩、非压缩 common包都会打入 core
// const $ = require('@wiajs/dom'); // dom操作库，这种引用，导致 dom的压缩、非压缩 common包都不会打入 core，保留了 require


const {extend, nextFrame, colorThemeCSSStyles} = Utils;
const {support, device} = $;

// Default
const def = {
  version: '1.0.1',
  el: 'body',
  root: 'body',
  theme: 'auto',
  language: window.navigator.language,
  routes: [],
  name: 'App',
  lazyModulesPath: null,
  initOnDeviceReady: true,
  // init: true, // 路由加载应用时为true
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
    black: '#000000',
  },
};

/**
 * 应用类，每个wia应用从该类继承，由 首页加载创建或者路由创建
 */
class App extends Module {
  static apps = {};
  constructor(opts = {}) {
    super(opts);
    // eslint-disable-next-line
    // 单例，只能一个
    if (App.instance && typeof window !== 'undefined') {
      throw new Error("App is already initialized and can't be initialized more than once");
    }

    const passedParams = extend({}, opts);

    const app = this;
    $.App = App;
    App.instance = app; // 控制单例
    app.device = device;
    app.support = support;
    console.log('App constructor', {Device: device, Support: support});

    // Extend defaults with modules params
    app.useModulesParams(def);

    // Extend defaults with passed params
    app.params = extend(def, opts);
    // 兼容 root
    if (opts.root && !opts.el) {
      app.params.el = opts.root;
    }

    // 判断Page、App实例
    $.isPage = p => p instanceof Page;
    $.isApp = p => p instanceof App;

    // 参数内容赋值给app 实例
    extend(app, {
      owner: app.params.owner, // 所有者
      name: app.params.name, // App Name
      id: `${app.params.owner}.${app.params.name}`, // App id
      version: app.params.version, // App version
      // Routes
      routes: app.params.routes,
      // Lang
      language: app.params.language,
      cfg: app.params.cfg, // app config
      api: app.params.api, // api config

      // Theme 主题
      theme: (() => {
        if (app.params.theme === 'auto') {
          if (device.ios) return 'ios';
          if (device.desktop) return 'pc';
          return 'md';
        }
        return app.params.theme;
      })(),

      // Initially passed parameters
      passedParams,
      online: window.navigator.onLine,
      colors: app.params.colors,
      darkMode: app.params.darkMode,
    });

    if (opts.store) app.params.store = params.store;

    // 触摸事件
    app.touchEvents = {
      start: support.touch ? 'touchstart' : support.pointerEvents ? 'pointerdown' : 'mousedown',
      move: support.touch ? 'touchmove' : support.pointerEvents ? 'pointermove' : 'mousemove',
      end: support.touch ? 'touchend' : support.pointerEvents ? 'pointerup' : 'mouseup',
    };

    // 插件：插入的模块类，每个模块作为app的一个属性，合并到实例。
    // 模块包括相关属性及方法（如：create、get、destroy）
    // 调用每个模块的 create 方法
    app.useModules();

    // 初始化数据，Init Data & Methods
    app.initData();

    // 应用初始化，路由跳转时不执行初始化
    if (app.params.init) {
      if (device.cordova && app.params.initOnDeviceReady) {
        $(document).on('deviceready', () => {
          app.init();
        });
      } else {
        app.init();
      }
    }

    // Return app instance
    return app;
  }

  // 应用事件
  // 首次加载事件，全局只触发一次
  load(param) {
    this.emit('local::load appLoad', param);
  }

  // 从后台切换到前台显示事件
  show(url, data) {
    this.emit('local::show appShow', url, data);
  }

  // 从前台显示切换到后台事件
  hide() {
    this.emit('local::hide appHide');
  }

  // 卸载应用事件
  unload() {
    this.emit('local::unload appUnload');
  }

  setColorTheme(color) {
    if (!color) return;
    const app = this;
    app.colors.primary = color;
    app.setColors();
  }

  setColors() {
    const app = this;
    if (!app.colorsStyleEl) {
      app.colorsStyleEl = document.createElement('style');
      document.head.appendChild(app.colorsStyleEl);
    }

    app.colorsStyleEl.textContent = colorThemeCSSStyles(app.colors);
  }

  /**
   * 绑定容器
   * 应用初始化时调用
   * @param {HTMLElement} rootEl
   */
  mount(rootEl) {
    const app = this;

    const $rootEl = $(rootEl || app.params.el).eq(0);
    extend(app, {
      // Root
      root: $rootEl,
      $el: $rootEl,
      el: $rootEl?.[0],
      // RTL
      rtl: $rootEl.css('direction') === 'rtl',
    });

    // Save Root
    if (app.root && app.root[0]) {
      app.root[0].wia = app;
    }
    if (app.$el && app.$el[0]) {
      app.$el[0].wia = app;
    }

    app.el.f7 = app;

    // 自动暗黑主题，Auto Dark Theme
    const DARK = '(prefers-color-scheme: dark)';
    const LIGHT = '(prefers-color-scheme: light)';
    app.mq = {};
    if (window.matchMedia) {
      app.mq.dark = window.matchMedia(DARK);
      app.mq.light = window.matchMedia(LIGHT);
    }

    app.colorSchemeListener = ({matches, media}) => {
      if (!matches) {
        return;
      }
      const html = document.querySelector('html');
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
  }

  /**
   * 初始化数据
   */
  initData() {
    const app = this;

    // Data
    app.data = {};
    if (app.params.data && typeof app.params.data === 'function') {
      $.extend(app.data, app.params.data.bind(app)());
    } else if (app.params.data) {
      $.extend(app.data, app.params.data);
    }
    // Methods
    app.methods = {};
    if (app.params.methods) {
      Object.keys(app.params.methods).forEach(methodName => {
        if (typeof app.params.methods[methodName] === 'function') {
          app.methods[methodName] = app.params.methods[methodName].bind(app);
        } else {
          app.methods[methodName] = app.params.methods[methodName];
        }
      });
    }
  }

  enableAutoDarkTheme() {
    if (!window.matchMedia) return;

    const app = this;
    const html = document.querySelector('html');
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
  }

  disableAutoDarkTheme() {
    if (!window.matchMedia) return;

    const app = this;
    if (app.mq.dark) app.mq.dark.removeListener(app.colorSchemeListener);
    if (app.mq.light) app.mq.light.removeListener(app.colorSchemeListener);
  }

  setDarkMode(mode) {
    const app = this;
    if (mode === 'auto') {
      app.enableAutoDarkMode();
    } else {
      app.disableAutoDarkMode();
      $('html')[mode ? 'addClass' : 'removeClass']('dark');
      app.darkMode = mode;
    }
  }

  initAppComponent(callback) {
    const app = this;
    app.router.componentLoader(
      app.params.component,
      app.params.componentUrl,
      {componentOptions: {el: app.$el[0]}},
      el => {
        app.$el = $(el);
        app.$el[0].wia = app;
        app.$elComponent = el.f7Component;
        app.el = app.$el[0];
        if (callback) callback();
      },
      () => {}
    );
  }

  // 初始化，包括控制 html 样式，wia app 启动时需要执行，切换app时，不需要
  init(rootEl) {
    const app = this;
    app.setColors();
    app.mount(rootEl);

    const init = () => {
      if (app.initialized) return app;

      app.$el.addClass('framework7-initializing');

      // RTL attr
      if (app.rtl) {
        $('html').attr('dir', 'rtl');
      }

      // Auto Dark Mode
      if (typeof app.params.darkMode === 'undefined') {
        app.darkMode = $('html').hasClass('dark');
      } else {
        app.setDarkMode(app.params.darkMode);
      }

      // Watch for online/offline state
      window.addEventListener('offline', () => {
        app.online = false;
        app.emit('offline');
        app.emit('connection', false);
      });

      window.addEventListener('online', () => {
        app.online = true;
        app.emit('online');
        app.emit('connection', true);
      });

      // Root class
      app.$el.addClass('framework7-root');

      // Theme class
      $('html').removeClass('ios md pc').addClass(app.theme);

      // iOS Translucent
      if (app.params.iosTranslucentBars && app.theme === 'ios') {
        $('html').addClass('ios-translucent-bars');
      }
      if (app.params.iosTranslucentModals && app.theme === 'ios') {
        $('html').addClass('ios-translucent-modals');
      }

      // Init class
      nextFrame(() => {
        app.$el.removeClass('framework7-initializing');
      });

      initStyle();

      // Emit, init other modules
      app.initialized = true;

      // 发起init 事件，模块 on 里面有 init方法的会被触发
      app.emit('init');
    };

    if (app.params.component || app.params.componentUrl) {
      app.initAppComponent(() => {
        init();
      });
    } else {
      init();
    }

    return app;
  }

  // eslint-disable-next-line
  // 加载模块
  loadModule(m) {
    App.loadModule(m);
    // 模块初始化
    if (this[m.name].init) this[m.name].init();
  }

  // eslint-disable-next-line
  loadModules(...args) {
    return App.loadModules(...args);
  }

  getVnodeHooks(hook, id) {
    const app = this;
    if (!app.vnodeHooks || !app.vnodeHooks[hook]) return [];
    return app.vnodeHooks[hook][id] || [];
  }

  // eslint-disable-next-line
  get $() {
    return $;
  }

  static get Dom() {
    return $;
  }

  static get $() {
    return $;
  }

  static get Module() {
    return Module;
  }

  static get Event() {
    return Event;
  }
  static get Class() {
    return Module;
  }

  static get Events() {
    return Event;
  }
}

/**
 * 初始化html样式
 * from device module
 */
function initStyle() {
  const classNames = [];
  const html = document.querySelector('html');
  const metaStatusbar = document.querySelector(
    'meta[name="apple-mobile-web-app-status-bar-style"]'
  );
  if (!html) return;
  if (
    device.standalone &&
    device.ios &&
    metaStatusbar &&
    metaStatusbar.content === 'black-translucent'
  ) {
    classNames.push('device-full-viewport');
  }

  // Pixel Ratio
  classNames.push(`device-pixel-ratio-${Math.floor(device.pixelRatio)}`);
  // OS classes
  if (device.os && !device.desktop) {
    classNames.push(`device-${device.os}`);
  } else if (device.desktop) {
    classNames.push('device-desktop');
    if (device.os) {
      classNames.push(`device-${device.os}`);
    }
  }
  if (device.cordova || device.phonegap) {
    classNames.push('device-cordova');
  }

  // Add html classes
  classNames.forEach(className => {
    html.classList.add(className);
    // console.log({className});
  });
}

// App 类 静态方法、属性

App.jsx = jsx;
App.ModalMethods = Modals;
App.ConstructorMethods = Constructors;
// 动态加载模块（base里面已经内置动态加载，这个方法应该用不上）
App.loadModule = loadModule;
App.loadModules = modules => {
  return Promise.all(modules.map(module => App.loadModule(module)));
};

// app 加载到 app实例的一些扩展模块
App.support = support;
App.device = device;
App.utils = Utils;

// 添加应用缺省模块
App.use([
  Resize, // 控制屏幕大小
  Click, // 触发UI组件的点击（Click 或 Touch）事件
  Touch, // 触发app.on(Touch事件)
  SW$1, // ServiceWorker

  //INSTALL_COMPONENTS
]);

/**
 * Released on: August 28, 2016
 * 图片延迟加载
 * 使用方法：
 * import {Lazy from '@wiajs/core';
 * const _lazy = new Lazy();
 * _lazy.start(dv); // 注意，这个dv是滚动的层，错了无法触发加载，sui 就是内容层！
 * setTimeout(() => {loadView()}, 1);  // krouter 里面已经做了处理，bind 时直接 加载视图即可！
 * loadView 加载视图中（每次页面更新内容后，需调用）
 * _lazy.update(); // 没有显示的图片，加入 待加载数组，并检查是否可视，可视则加载！
 */

// options
const _opts = {
  normal: 'nor', // 'data-normal' 普通图片
  retina: 'ret', // 'data-retina',
  srcset: 'set', // 'data-srcset', 浏览器根据宽、高和像素密度来加载相应的图片资源
  threshold: 0,
};

let _opt;
let _ticking;
let _nodes;
let _windowHeight = window.innerHeight;
let _root;

// private
let _prevLoc = getLoc();

// feature detection
// https://github.com/Modernizr/Modernizr/blob/master/feature-detects/img/srcset.js
const _srcset =
  document.body.classList.contains('srcset') ||
  'srcset' in document.createElement('img');

// 设备分辨率
// not supported in IE10 - https://msdn.microsoft.com/en-us/library/dn265030(v=vs.85).aspx
const _dpr =
  window.devicePixelRatio ||
  window.screen.deviceXDPI / window.screen.logicalXDPI;

/**
 * 输外部可调用的类
 * 类外面的变量、函数作为模块内部私有属性、方法，外部无法调用
 * 如果全部放入类中，属性、函数相互调用，都需要 this，非常麻烦！
 * 也可以直接使用 export default (options = {}) => {} 输出一个函数！
 * 函数内部反而不需要this，比较方便。
 */
class Lazy {
  // 实例属性
  constructor(opt) {
    _opt = $.assign({}, _opts, opt);
  }

  // API

  //----------------------------------------
  // dom 就绪后 start，dom 更新后，需 update
  /**
   * 启动延迟加载, 加载事件, dom ready时调用!
   * @param root 根对象, scroll的目标对象，错了无法触发scroll 事件！
   * @returns {init}
   */
  start(root) {
    // sui window scroll event invalid!!!
    // ['scroll', 'resize'].forEach(event => window[action](event, requestScroll));
    ['scroll', 'resize'].forEach(event =>
      root['addEventListener'](event, requestScroll)
    );
    _root = root;
    return this;
  }

  /**
   * 停止延迟加载,卸载事件!
   * @param root 根对象, scroll的目标对象
   * @returns {init}
   */
  stop() {
    // sui window scroll event invalid!!!
    // ['scroll', 'resize'].forEach(event => window[action](event, requestScroll));
    ['scroll', 'resize'].forEach(event =>
      _root['removeEventListener'](event, requestScroll)
    );
    return this;
  }

  update() {
    setTimeout(() => {
      update();
      check();
    }, 1);
  }
}

/**
 * Y 坐标，好像一直是 0
 */
function getLoc() {
  // console.log(`window.scrollY:${window.scrollY} window.pageYOffset:${window.pageYOffset}`);
  return window.scrollY || window.pageYOffset;
}

// debounce helpers
function requestScroll() {
  _prevLoc = getLoc();
  requestFrame();
}

function requestFrame() {
  if (!_ticking) {
    window.requestAnimationFrame(() => check());
    _ticking = true;
  }
}

// offset helper
/**
 * 节点相对视口的坐标，对于动态加载的，好像得到都是0，使用定时器延迟加载就能正确获取！
 */
function getOffset(node) {
  // 元素四个位置的相对于视口的坐标
  return node.getBoundingClientRect().top + _prevLoc;
  // return node.offsetTop + _prevLoc;
}

/**
 * 节点是否在可视窗口判断
 * 通过可视窗口顶部、底部坐标来判断
 * 顶部坐标就是页面的滚动条滚动的距离
 * 底部坐标就是滚动条的距离加上当前可视窗口的高度
 * dom元素中心：元素到最顶端的高度加上自身高度的一半
 * @param {*} node
 */
function inViewport(node) {
  const viewTop = _prevLoc; // 视口顶部坐标
  const viewBot = viewTop + _windowHeight; // 视口底部坐标
  // console.log(`viewTop:${viewTop} viewBot:${viewBot}`);

  // 节点坐标
  const nodeTop = getOffset(node);
  const nodeBot = nodeTop + node.offsetHeight;
  // console.log(`nodeTop:${nodeTop} nodeBot:${nodeBot}`);

  const offset = (_opt.threshold / 100) * _windowHeight;
  // 节点在可视范围内
  const rc = nodeBot >= viewTop - offset && nodeTop <= viewBot + offset;
  // if (rc)
  //   console.log(`nodeBot:${nodeBot} >= view:${viewTop - offset} nodeTop:${nodeTop} <= view:${viewBot + offset}`);

  return rc;
}

// source helper
function setSource(node) {
  $.emit('lazy:src:before', node);

  // prefer srcset, fallback to pixel density
  if (_srcset && node.hasAttribute(_opt.srcset)) {
    node.setAttribute('srcset', node.getAttribute(_opt.srcset));
  } else {
    const retina = _dpr > 1 && node.getAttribute(_opt.retina);
    const src = retina || node.getAttribute(_opt.normal);
    node.setAttribute('src', src);
    console.log(`set src:${src}`);
  }

  $.emit('lazy:src:after', node);
  // 删除懒加载属性，避免重复加载
  [_opt.normal, _opt.retina, _opt.srcset].forEach(attr =>
    node.removeAttribute(attr)
  );
  update();
}

/**
 * 检查是否可视,如果可视则更改图片src，加载图片
 * @returns {check}
 */
function check() {
  if (!_nodes) return;

  _windowHeight = window.innerHeight;
  _nodes.forEach(node => inViewport(node) && setSource(node));
  _ticking = false;
  return this;
}

/**
 * 新的图片加入dom，需重新获取属性为nor的图片节点，
 * @returns {update}
 */
function update(root) {
  if (root)
    _nodes = Array.prototype.slice.call(
      root.querySelectorAll(`[${_opt.normal}]`)
    );
  else
    _nodes = Array.prototype.slice.call(
      document.querySelectorAll(`[${_opt.normal}]`)
    );
  return this;
}

const openedModals = [];
const dialogsQueue = [];
function clearDialogsQueue() {
  if (dialogsQueue.length === 0) return;
  const dialog = dialogsQueue.shift();
  dialog.open();
}
class Modal extends Event {
  constructor(app, params) {
    super(params, [app]);

    const modal = this;
    const defaults = {};
    modal.params = Utils.extend(defaults, params);
    modal.opened = false;
    return this;
  }

  onOpen() {
    const modal = this;
    modal.opened = true;
    openedModals.push(modal);
    $('html').addClass(`with-modal-${modal.type.toLowerCase()}`);
    modal.$el.trigger(`modal:open ${modal.type.toLowerCase()}:open`);
    modal.emit(`local::open modalOpen ${modal.type}Open`, modal);
  }

  onOpened() {
    const modal = this;
    modal.$el.trigger(`modal:opened ${modal.type.toLowerCase()}:opened`);
    modal.emit(`local::opened modalOpened ${modal.type}Opened`, modal);
  }

  onClose() {
    const modal = this;
    modal.opened = false;
    if (!modal.type || !modal.$el) return;
    openedModals.splice(openedModals.indexOf(modal), 1);
    $('html').removeClass(`with-modal-${modal.type.toLowerCase()}`);
    modal.$el.trigger(`modal:close ${modal.type.toLowerCase()}:close`);
    modal.emit(`local::close modalClose ${modal.type}Close`, modal);
  }

  onClosed() {
    const modal = this;
    if (!modal.type || !modal.$el) return;
    modal.$el.removeClass('modal-out');
    modal.$el.hide();
    modal.$el.trigger(`modal:closed ${modal.type.toLowerCase()}:closed`);
    modal.emit(`local::closed modalClosed ${modal.type}Closed`, modal);
  }

  open(animateModal) {
    const modal = this;
    const {app, $el, type, $backdropEl} = modal;
    const {moveToRoot} = modal.params;

    let animate = true;
    if (typeof animateModal !== 'undefined') animate = animateModal;
    else if (typeof modal.params.animate !== 'undefined') {
      animate = modal.params.animate;
    }

    if (!$el || $el.hasClass('modal-in')) {
      return modal;
    }

    if (type === 'dialog' && app.params.modal.queueDialogs) {
      let pushToQueue;
      if ($('.dialog.modal-in').length > 0) {
        pushToQueue = true;
      } else if (openedModals.length > 0) {
        openedModals.forEach(openedModal => {
          if (openedModal.type === 'dialog') pushToQueue = true;
        });
      }
      if (pushToQueue) {
        dialogsQueue.push(modal);
        return modal;
      }
    }

    const $modalParentEl = $el.parent();
    const wasInDom = $el.parents(document).length > 0;
    if (
      moveToRoot &&
      app.params.modal.moveToRoot &&
      !$modalParentEl.is(app.root)
    ) {
      app.root.append($el);
      modal.once(`${type}Closed`, () => {
        if (wasInDom) {
          $modalParentEl.append($el);
        } else {
          $el.remove();
        }
      });
    }
    // Show Modal
    $el.show();

    /* eslint no-underscore-dangle: ["error", { "allow": ["_clientLeft"] }] */
    modal._clientLeft = $el[0].clientLeft;

    // Modal
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
      $el.animationEnd(() => {
        transitionEnd();
      });
      $el.transitionEnd(() => {
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
  }

  close(animateModal) {
    const modal = this;
    const $el = modal.$el;
    const $backdropEl = modal.$backdropEl;

    let animate = true;
    if (typeof animateModal !== 'undefined') animate = animateModal;
    else if (typeof modal.params.animate !== 'undefined') {
      animate = modal.params.animate;
    }

    if (!$el || !$el.hasClass('modal-in')) {
      if (dialogsQueue.indexOf(modal) >= 0) {
        dialogsQueue.splice(dialogsQueue.indexOf(modal), 1);
      }
      return modal;
    }

    // backdrop
    if ($backdropEl) {
      let needToHideBackdrop = true;
      if (modal.type === 'popup') {
        modal.$el.prevAll('.popup.modal-in').each((index, popupEl) => {
          const popupInstance = popupEl.f7Modal;
          if (!popupInstance) return;
          if (
            popupInstance.params.closeByBackdropClick &&
            popupInstance.params.backdrop &&
            popupInstance.backdropEl === modal.backdropEl
          ) {
            needToHideBackdrop = false;
          }
        });
      }
      if (needToHideBackdrop) {
        $backdropEl[animate ? 'removeClass' : 'addClass']('not-animated');
        $backdropEl.removeClass('backdrop-in');
      }
    }

    // Modal
    $el[animate ? 'removeClass' : 'addClass']('not-animated');
    function transitionEnd() {
      if ($el.hasClass('modal-out')) {
        modal.onClosed();
      } else if ($el.hasClass('modal-in')) {
        modal.onOpened();
      }
    }
    if (animate) {
      $el.animationEnd(() => {
        transitionEnd();
      });
      $el.transitionEnd(() => {
        transitionEnd();
      });
      $el.removeClass('modal-in').addClass('modal-out');
      // Emit close
      modal.onClose();
    } else {
      $el
        .addClass('not-animated')
        .removeClass('modal-in')
        .addClass('modal-out');
      // Emit close
      modal.onClose();
      modal.onClosed();
    }

    if (modal.type === 'dialog') {
      clearDialogsQueue();
    }

    return modal;
  }

  destroy() {
    const modal = this;
    if (modal.destroyed) return;
    modal.emit(
      `local::beforeDestroy modalBeforeDestroy ${modal.type}BeforeDestroy`,
      modal
    );
    if (modal.$el) {
      modal.$el.trigger(
        `modal:beforedestroy ${modal.type.toLowerCase()}:beforedestroy`
      );
      if (modal.$el.length && modal.$el[0].f7Modal) {
        delete modal.$el[0].f7Modal;
      }
    }
    Utils.deleteProps(modal);
    modal.destroyed = true;
  }
}

// export {default as Support} from './support';
// export {default as Device} from './device';
const Support = $.support;
const Device = $.device;

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
