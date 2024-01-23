if (typeof(Float32Array)=='undefined') {
    var Float32Array = Array;
}
var mat4 = {
    set: function(a, b) {
        b[0] = a[0];
        b[1] = a[1];
        b[2] = a[2];
        b[3] = a[3];
        b[4] = a[4];
        b[5] = a[5];
        b[6] = a[6];
        b[7] = a[7];
        b[8] = a[8];
        b[9] = a[9];
        b[10] = a[10];
        b[11] = a[11];
        b[12] = a[12];
        b[13] = a[13];
        b[14] = a[14];
        b[15] = a[15];
        return b;
    },
    create: function(a) {
    var b = new Float32Array(16);
        a &&
            (b[0] = a[0], b[1] = a[1], b[2] = a[2], b[3] = a[3], b[4] = a[4], b[5] = a[5], b[6] = a[6], b[7] = a[7], b[8] = a[8], b[9] = a[9], b[10] = a[10], b[11] = a[11], b[12] = a[12], b[13] = a[13], b[14] = a[14], b[15] = a[15]);
        return b;
    },
    frustum: function(a, b, c, d, e, g, f) {
        f || (f = mat4.create());
        // a || (a = (new new Float32Array(16)));
        var h = b - a, i = d - c, j = g - e;
        f[0] = 2 * e / h;
        f[1] = 0;
        f[2] = 0;
        f[3] = 0;
        f[4] = 0;
        f[5] = 2 * e / i;
        f[6] = 0;
        f[7] = 0;
        f[8] = (b + a) / h;
        f[9] = (d + c) / i;
        f[10] = - (g + e) / j;
        f[11] = -1;
        f[12] = 0;
        f[13] = 0;
        f[14] = - (2 * g * e) / j;
        f[15] = 0;
        return f;
    },
    perspective: function(a, b, c, d, e) {
        a = c * Math.tan(a * Math.PI / 360);
        b *= a;
        return mat4.frustum(- b, b, - a, a, c, d, e);
    },
    translate: function(a,b,c) {
        var d = b[0], e = b[1], b = b[2], g, f, h, i, j, k, l, n, o, m, p, r;
        if (!c || a === c) {
            return a[12] = a[0] * d + a[4] * e + a[8] * b + a[12], a[13] = a[1] * d + a[5] * e + a[9] * b + a[13], a[14] = a[2] * d + a[6] * e + a[10] * b + a[14], a[15] = a[3] * d + a[7] * e + a[11] * b + a[15], a;
        }
        g = a[0];
        f = a[1];
        h = a[2];
        i = a[3];
        j = a[4];
        k = a[5];
        l = a[6];
        n = a[7];
        o = a[8];
        m = a[9];
        p = a[10];
        r = a[11];
        c[0] = g;
        c[1] = f;
        c[2] = h;
        c[3] = i;
        c[4] = j;
        c[5] = k;
        c[6] = l;
        c[7] = n;
        c[8] = o;
        c[9] = m;
        c[10] = p;
        c[11] = r;
        c[12] = g * d + j * e + o * b + a[12];
        c[13] = f * d + k * e + m * b + a[13];
        c[14] = h * d + l * e + p * b + a[14];
        c[15] = i * d + n * e + r * b + a[15];
        return c;
    },
    identity: function(a) {
        a || (a = mat4.create());
        a[0] = 1;
        a[1] = 0;
        a[2] = 0;
        a[3] = 0;
        a[4] = 0;
        a[5] = 1;
        a[6] = 0;
        a[7] = 0;
        a[8] = 0;
        a[9] = 0;
        a[10] = 1;
        a[11] = 0;
        a[12] = 0;
        a[13] = 0;
        a[14] = 0;
        a[15] = 1;
        return a;
    },
    transpose: function(a, b) {
        if (!b || a === b) {
            var c = a[1], d = a[2], e = a[3], g = a[6], f = a[7], h = a[11];
            a[1] = a[4];
            a[2] = a[8];
            a[3] = a[12];
            a[4] = c;
            a[6] = a[9];
            a[7] = a[13];
            a[8] = d;
            a[9] = g;
            a[11] = a[14];
            a[12] = e;
            a[13] = f;
            a[14] = h;
            return a;
        }
        b[0] = a[0];
        b[1] = a[4];
        b[2] = a[8];
        b[3] = a[12];
        b[4] = a[1];
        b[5] = a[5];
        b[6] = a[9];
        b[7] = a[13];
        b[8] = a[2];
        b[9] = a[6];
        b[10] = a[10];
        b[11] = a[14];
        b[12] = a[3];
        b[13] = a[7];
        b[14] = a[11];
        b[15] = a[15];
        return b;
    },
    inverse: function(a, b) {
        b || (b = a);
        var c = a[0], d = a[1], e = a[2], g = a[3], f = a[4], h = a[5], i = a[6], j = a[7], k = a[8], l = a[9], n = a[10], o = a[11], m = a[12], p = a[13], r = a[14], s = a[15], A = c * h - d * f, B = c * i - e * f, t = c * j - g * f, u = d * i - e * h, v = d * j - g * h, w = e * j - g * i, x = k * p - l * m, y = k * r - n * m, z = k * s - o * m, C = l * r - n * p, D = l * s - o * p, E = n * s - o * r, q = A * E - B * D + t * C + u * z - v * y + w * x;
        if (!q) {
            return null;
        }
        q = 1 / q;
        b[0] = (h * E - i * D + j * C) * q;
        b[1] = (- d * E + e * D - g * C) * q;
        b[2] = (p * w - r * v + s * u) * q;
        b[3] = (- l * w + n * v - o * u) * q;
        b[4] = (- f * E + i * z - j * y) * q;
        b[5] = (c * E - e * z + g * y) * q;
        b[6] = (- m * w + r * t - s * B) * q;
        b[7] = (k * w - n * t + o * B) * q;
        b[8] = (f * D - h * z + j * x) * q;
        b[9] = (- c * D + d * z - g * x) * q;
        b[10] = (m * v - p * t + s * A) * q;
        b[11] = (- k * v + l * t - o * A) * q;
        b[12] = (- f * C + h * y - i * x) * q;
        b[13] = (c * C - d * y + e * x) * q;
        b[14] = (- m * u + p * B - r * A) * q;
        b[15] = (k * u - l * B + n * A) * q;
        return b;
    },
    rotate: function (a, b, c, d) { 
        /* 
            CAUTION! the original matrix is on the left and the rotations matrix is on the right 
            
        */
        var e = c[0], g = c[1], c = c[2], f = Math.sqrt(e * e + g * g + c * c), h, i, j, k, l, n, o, m, p, r, s, A, B, t, u, v, w, x, y, z;
        if (!f) {
            return null;
        }
        1 !== f && (f = 1 / f, e *= f, g *= f, c *= f);
        h = Math.sin(b);
        i = Math.cos(b);
        j = 1 - i;
        b = a[0];
        f = a[1];
        k = a[2];
        l = a[3];
        n = a[4];
        o = a[5];
        m = a[6];
        p = a[7];
        r = a[8];
        s = a[9];
        A = a[10];
        B = a[11];
        t = e * e * j + i;
        u = g * e * j + c * h;
        v = c * e * j - g * h;
        w = e * g * j - c * h;
        x = g * g * j + i;
        y = c * g * j + e * h;
        z = e * c * j + g * h;
        e = g * c * j - e * h;
        g = c * c * j + i;
        d ? a !== d &&
            (d[12] = a[12], d[13] = a[13], d[14] = a[14], d[15] = a[15]) : (d = a);
        d[0] = b * t + n * u + r * v;
        d[1] = f * t + o * u + s * v;
        d[2] = k * t + m * u + A * v;
        d[3] = l * t + p * u + B * v;
        d[4] = b * w + n * x + r * y;
        d[5] = f * w + o * x + s * y;
        d[6] = k * w + m * x + A * y;
        d[7] = l * w + p * x + B * y;
        d[8] = b * z + n * e + r * g;
        d[9] = f * z + o * e + s * g;
        d[10] = k * z + m * e + A * g;
        d[11] = l * z + p * e + B * g;
        return d;
    },
    ortho: function (a, b, c, d, e, g, f) {
    /**
        g > e, g - far plane, e - near plane
        planes coords are in the view system
        result: coords in the view system
        Matrix should be applied to points in the world system!
    **/
        f || (f = mat4.create());
        var h = b - a, i = d - c, j = g - e;
        f[0] = 2 / h;
        f[1] = 0;
        f[2] = 0;
        f[3] = 0;
        f[4] = 0;
        f[5] = 2 / i;
        f[6] = 0;
        f[7] = 0;
        f[8] = 0;
        f[9] = 0;
        f[10] = -2 / j;
        f[11] = 0;
        f[12] = - (a + b) / h;
        f[13] = - (d + c) / i;
        f[14] = - (g + e) / j;
        f[15] = 1;
        return f;
    },
    ortho2: function (a, b, c, d, e, g, f) {
    /**
        g > e, g - far plane, e - near plane
        planes coords are in the view system!
        result: coords in the world system!
        Matrix should be applied to points in the world system!
    **/
        f || (f = mat4.create());
        var h = b - a, i = d - c, j = g - e;
        f[0] = 2 / h;
        f[1] = 0;
        f[2] = 0;
        f[3] = 0;
        f[4] = 0;
        f[5] = 2 / i;
        f[6] = 0;
        f[7] = 0;
        f[8] = 0;
        f[9] = 0;
        f[10] = 2 / j;
        f[11] = 0;
        f[12] = - (a + b) / h;
        f[13] = - (d + c) / i;
        f[14] =  (g + e) / j;
        f[15] = 1;
        return f;
    },
    ortho3: function (a, b, c, d, e, g, f) {
    /**
        g > e, g - far plane, e - near plane
        planes coords are in the view system!
        result: coords in the world system!
        Matrix should be applied to points that are already in the view system!
    **/
        f || (f = mat4.create());
        var h = b - a, i = d - c, j = g - e;
        f[0] = 2 / h;
        f[1] = 0;
        f[2] = 0;
        f[3] = 0;
        f[4] = 0;
        f[5] = 2 / i;
        f[6] = 0;
        f[7] = 0;
        f[8] = 0;
        f[9] = 0;
        f[10] = 2 / j;
        f[11] = 0;
        f[12] = - (a + b) / h;
        f[13] = - (d + c) / i;
        f[14] = -(g + e) / j;
        f[15] = 1;
        return f;
    },
    multiplyVec3: function (a, b, c) {
        c || (c = b);
        var d = b[0], e = b[1], b = b[2];
        c[0] = a[0] * d + a[4] * e + a[8] * b + a[12];
        c[1] = a[1] * d + a[5] * e + a[9] * b + a[13];
        c[2] = a[2] * d + a[6] * e + a[10] * b + a[14];
        return c;
    },
    multiply: function (a, b, c) {
        c || (c = a);
        var d = a[0], e = a[1], g = a[2], f = a[3], h = a[4], i = a[5], j = a[6], k = a[7], l = a[8], n = a[9], o = a[10], m = a[11], p = a[12], r = a[13], s = a[14], a = a[15], A = b[0], B = b[1], t = b[2], u = b[3], v = b[4], w = b[5], x = b[6], y = b[7], z = b[8], C = b[9], D = b[10], E = b[11], q = b[12], F = b[13], G = b[14], b = b[15];
        c[0] = A * d + B * h + t * l + u * p;
        c[1] = A * e + B * i + t * n + u * r;
        c[2] = A * g + B * j + t * o + u * s;
        c[3] = A * f + B * k + t * m + u * a;
        c[4] = v * d + w * h + x * l + y * p;
        c[5] = v * e + w * i + x * n + y * r;
        c[6] = v * g + w * j + x * o + y * s;
        c[7] = v * f + w * k + x * m + y * a;
        c[8] = z * d + C * h + D * l + E * p;
        c[9] = z * e + C * i + D * n + E * r;
        c[10] = z * g + C * j + D * o + E * s;
        c[11] = z * f + C * k + D * m + E * a;
        c[12] = q * d + F * h + G * l + b * p;
        c[13] = q * e + F * i + G * n + b * r;
        c[14] = q * g + F * j + G * o + b * s;
        c[15] = q * f + F * k + G * m + b * a;
        return c;
    },
    scale: function (a, b, c) {
        var d = b[0], e = b[1], b = b[2];
        if (!c || a === c) {
            return a[0] *= d, a[1] *= d, a[2] *= d, a[3] *= d, a[4] *= e, a[5] *= e, a[6] *= e, a[7] *= e, a[8] *= b, a[9] *= b, a[10] *= b, a[11] *= b, a;
        }
        c[0] = a[0] * d;
        c[1] = a[1] * d;
        c[2] = a[2] * d;
        c[3] = a[3] * d;
        c[4] = a[4] * e;
        c[5] = a[5] * e;
        c[6] = a[6] * e;
        c[7] = a[7] * e;
        c[8] = a[8] * b;
        c[9] = a[9] * b;
        c[10] = a[10] * b;
        c[11] = a[11] * b;
        c[12] = a[12];
        c[13] = a[13];
        c[14] = a[14];
        c[15] = a[15];
        return c;
    },
    lookAt: function (a, b, c, d) {
        d || (d = mat4.create());
        var e, g, f, h, i, j, k, l, n = a[0], o = a[1], a = a[2];
        f = c[0];
        h = c[1];
        g = c[2];
        k = b[0];
        c = b[1];
        e = b[2];
        if (n === k && o === c && a === e) {
            return mat4.identity(d);
        }
        b = n - k;
        c = o - c;
        k = a - e;
        l = 1 / Math.sqrt(b * b + c * c + k * k);
        b *= l;
        c *= l;
        k *= l;
        e = h * k - g * c;
        g = g * b - f * k;
        f = f * c - h * b;
        (l = Math.sqrt(e * e + g * g + f * f)) ? (l = 1 / l, e *= l, g *= l, f *= l) : (f = g = e = 0);
        h = c * f - k * g;
        i = k * e - b * f;
        j = b * g - c * e;
        (l = Math.sqrt(h * h + i * i + j * j)) ? (l = 1 / l, h *= l, i *= l, j *= l) : (j = i = h = 0);
        d[0] = e;
        d[1] = h;
        d[2] = b;
        d[3] = 0;
        d[4] = g;
        d[5] = i;
        d[6] = c;
        d[7] = 0;
        d[8] = f;
        d[9] = j;
        d[10] = k;
        d[11] = 0;
        d[12] = - (e * n + g * o + f * a);
        d[13] = - (h * n + i * o + j * a);
        d[14] = - (b * n + c * o + k * a);
        d[15] = 1;
        return d;
    }
}