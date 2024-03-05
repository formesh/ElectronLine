(function(require, process, Buffer, global, setImmediate, clearImmediate, exports) {
  /*! For license information please see index.js.LICENSE.txt */
  !function(e, t) {
      if ("object" == typeof exports && "object" == typeof module)
          module.exports = t();
      else if ("function" == typeof define && define.amd)
          define([], t);
      else {
          var n = t();
          for (var r in n)
              ("object" == typeof exports ? exports : e)[r] = n[r]
      }
  }(global, (()=>(()=>{
      var e = {
          249: function(e, t, n) {
              var r;
              e.exports = (r = r || function(e, t) {
                  var r;
                  if ("undefined" != typeof window && window.crypto && (r = window.crypto),
                  "undefined" != typeof self && self.crypto && (r = self.crypto),
                  "undefined" != typeof globalThis && globalThis.crypto && (r = globalThis.crypto),
                  !r && "undefined" != typeof window && window.msCrypto && (r = window.msCrypto),
                  !r && "undefined" != typeof global && global.crypto && (r = global.crypto),
                  !r)
                      try {
                          r = n(113)
                      } catch (e) {}
                  var i = function() {
                      if (r) {
                          if ("function" == typeof r.getRandomValues)
                              try {
                                  return r.getRandomValues(new Uint32Array(1))[0]
                              } catch (e) {}
                          if ("function" == typeof r.randomBytes)
                              try {
                                  return r.randomBytes(4).readInt32LE()
                              } catch (e) {}
                      }
                      throw new Error("Native crypto module could not be used to get secure random number.")
                  }
                    , o = Object.create || function() {
                      function e() {}
                      return function(t) {
                          var n;
                          return e.prototype = t,
                          n = new e,
                          e.prototype = null,
                          n
                      }
                  }()
                    , a = {}
                    , s = a.lib = {}
                    , c = s.Base = {
                      extend: function(e) {
                          var t = o(this);
                          return e && t.mixIn(e),
                          t.hasOwnProperty("init") && this.init !== t.init || (t.init = function() {
                              t.$super.init.apply(this, arguments)
                          }
                          ),
                          t.init.prototype = t,
                          t.$super = this,
                          t
                      },
                      create: function() {
                          var e = this.extend();
                          return e.init.apply(e, arguments),
                          e
                      },
                      init: function() {},
                      mixIn: function(e) {
                          for (var t in e)
                              e.hasOwnProperty(t) && (this[t] = e[t]);
                          e.hasOwnProperty("toString") && (this.toString = e.toString)
                      },
                      clone: function() {
                          return this.init.prototype.extend(this)
                      }
                  }
                    , l = s.WordArray = c.extend({
                      init: function(e, n) {
                          e = this.words = e || [],
                          this.sigBytes = n != t ? n : 4 * e.length
                      },
                      toString: function(e) {
                          return (e || h).stringify(this)
                      },
                      concat: function(e) {
                          var t = this.words
                            , n = e.words
                            , r = this.sigBytes
                            , i = e.sigBytes;
                          if (this.clamp(),
                          r % 4)
                              for (var o = 0; o < i; o++) {
                                  var a = n[o >>> 2] >>> 24 - o % 4 * 8 & 255;
                                  t[r + o >>> 2] |= a << 24 - (r + o) % 4 * 8
                              }
                          else
                              for (var s = 0; s < i; s += 4)
                                  t[r + s >>> 2] = n[s >>> 2];
                          return this.sigBytes += i,
                          this
                      },
                      clamp: function() {
                          var t = this.words
                            , n = this.sigBytes;
                          t[n >>> 2] &= 4294967295 << 32 - n % 4 * 8,
                          t.length = e.ceil(n / 4)
                      },
                      clone: function() {
                          var e = c.clone.call(this);
                          return e.words = this.words.slice(0),
                          e
                      },
                      random: function(e) {
                          for (var t = [], n = 0; n < e; n += 4)
                              t.push(i());
                          return new l.init(t,e)
                      }
                  })
                    , u = a.enc = {}
                    , h = u.Hex = {
                      stringify: function(e) {
                          for (var t = e.words, n = e.sigBytes, r = [], i = 0; i < n; i++) {
                              var o = t[i >>> 2] >>> 24 - i % 4 * 8 & 255;
                              r.push((o >>> 4).toString(16)),
                              r.push((15 & o).toString(16))
                          }
                          return r.join("")
                      },
                      parse: function(e) {
                          for (var t = e.length, n = [], r = 0; r < t; r += 2)
                              n[r >>> 3] |= parseInt(e.substr(r, 2), 16) << 24 - r % 8 * 4;
                          return new l.init(n,t / 2)
                      }
                  }
                    , d = u.Latin1 = {
                      stringify: function(e) {
                          for (var t = e.words, n = e.sigBytes, r = [], i = 0; i < n; i++) {
                              var o = t[i >>> 2] >>> 24 - i % 4 * 8 & 255;
                              r.push(String.fromCharCode(o))
                          }
                          return r.join("")
                      },
                      parse: function(e) {
                          for (var t = e.length, n = [], r = 0; r < t; r++)
                              n[r >>> 2] |= (255 & e.charCodeAt(r)) << 24 - r % 4 * 8;
                          return new l.init(n,t)
                      }
                  }
                    , f = u.Utf8 = {
                      stringify: function(e) {
                          try {
                              return decodeURIComponent(escape(d.stringify(e)))
                          } catch (e) {
                              throw new Error("Malformed UTF-8 data")
                          }
                      },
                      parse: function(e) {
                          return d.parse(unescape(encodeURIComponent(e)))
                      }
                  }
                    , p = s.BufferedBlockAlgorithm = c.extend({
                      reset: function() {
                          this._data = new l.init,
                          this._nDataBytes = 0
                      },
                      _append: function(e) {
                          "string" == typeof e && (e = f.parse(e)),
                          this._data.concat(e),
                          this._nDataBytes += e.sigBytes
                      },
                      _process: function(t) {
                          var n, r = this._data, i = r.words, o = r.sigBytes, a = this.blockSize, s = o / (4 * a), c = (s = t ? e.ceil(s) : e.max((0 | s) - this._minBufferSize, 0)) * a, u = e.min(4 * c, o);
                          if (c) {
                              for (var h = 0; h < c; h += a)
                                  this._doProcessBlock(i, h);
                              n = i.splice(0, c),
                              r.sigBytes -= u
                          }
                          return new l.init(n,u)
                      },
                      clone: function() {
                          var e = c.clone.call(this);
                          return e._data = this._data.clone(),
                          e
                      },
                      _minBufferSize: 0
                  })
                    , m = (s.Hasher = p.extend({
                      cfg: c.extend(),
                      init: function(e) {
                          this.cfg = this.cfg.extend(e),
                          this.reset()
                      },
                      reset: function() {
                          p.reset.call(this),
                          this._doReset()
                      },
                      update: function(e) {
                          return this._append(e),
                          this._process(),
                          this
                      },
                      finalize: function(e) {
                          return e && this._append(e),
                          this._doFinalize()
                      },
                      blockSize: 16,
                      _createHelper: function(e) {
                          return function(t, n) {
                              return new e.init(n).finalize(t)
                          }
                      },
                      _createHmacHelper: function(e) {
                          return function(t, n) {
                              return new m.HMAC.init(e,n).finalize(t)
                          }
                      }
                  }),
                  a.algo = {});
                  return a
              }(Math),
              r)
          },
          214: function(e, t, n) {
              var r;
              e.exports = (r = n(249),
              function(e) {
                  var t = r
                    , n = t.lib
                    , i = n.WordArray
                    , o = n.Hasher
                    , a = t.algo
                    , s = [];
                  !function() {
                      for (var t = 0; t < 64; t++)
                          s[t] = 4294967296 * e.abs(e.sin(t + 1)) | 0
                  }();
                  var c = a.MD5 = o.extend({
                      _doReset: function() {
                          this._hash = new i.init([1732584193, 4023233417, 2562383102, 271733878])
                      },
                      _doProcessBlock: function(e, t) {
                          for (var n = 0; n < 16; n++) {
                              var r = t + n
                                , i = e[r];
                              e[r] = 16711935 & (i << 8 | i >>> 24) | 4278255360 & (i << 24 | i >>> 8)
                          }
                          var o = this._hash.words
                            , a = e[t + 0]
                            , c = e[t + 1]
                            , f = e[t + 2]
                            , p = e[t + 3]
                            , m = e[t + 4]
                            , y = e[t + 5]
                            , g = e[t + 6]
                            , v = e[t + 7]
                            , E = e[t + 8]
                            , b = e[t + 9]
                            , w = e[t + 10]
                            , O = e[t + 11]
                            , _ = e[t + 12]
                            , x = e[t + 13]
                            , S = e[t + 14]
                            , L = e[t + 15]
                            , P = o[0]
                            , k = o[1]
                            , G = o[2]
                            , T = o[3];
                          P = l(P, k, G, T, a, 7, s[0]),
                          T = l(T, P, k, G, c, 12, s[1]),
                          G = l(G, T, P, k, f, 17, s[2]),
                          k = l(k, G, T, P, p, 22, s[3]),
                          P = l(P, k, G, T, m, 7, s[4]),
                          T = l(T, P, k, G, y, 12, s[5]),
                          G = l(G, T, P, k, g, 17, s[6]),
                          k = l(k, G, T, P, v, 22, s[7]),
                          P = l(P, k, G, T, E, 7, s[8]),
                          T = l(T, P, k, G, b, 12, s[9]),
                          G = l(G, T, P, k, w, 17, s[10]),
                          k = l(k, G, T, P, O, 22, s[11]),
                          P = l(P, k, G, T, _, 7, s[12]),
                          T = l(T, P, k, G, x, 12, s[13]),
                          G = l(G, T, P, k, S, 17, s[14]),
                          P = u(P, k = l(k, G, T, P, L, 22, s[15]), G, T, c, 5, s[16]),
                          T = u(T, P, k, G, g, 9, s[17]),
                          G = u(G, T, P, k, O, 14, s[18]),
                          k = u(k, G, T, P, a, 20, s[19]),
                          P = u(P, k, G, T, y, 5, s[20]),
                          T = u(T, P, k, G, w, 9, s[21]),
                          G = u(G, T, P, k, L, 14, s[22]),
                          k = u(k, G, T, P, m, 20, s[23]),
                          P = u(P, k, G, T, b, 5, s[24]),
                          T = u(T, P, k, G, S, 9, s[25]),
                          G = u(G, T, P, k, p, 14, s[26]),
                          k = u(k, G, T, P, E, 20, s[27]),
                          P = u(P, k, G, T, x, 5, s[28]),
                          T = u(T, P, k, G, f, 9, s[29]),
                          G = u(G, T, P, k, v, 14, s[30]),
                          P = h(P, k = u(k, G, T, P, _, 20, s[31]), G, T, y, 4, s[32]),
                          T = h(T, P, k, G, E, 11, s[33]),
                          G = h(G, T, P, k, O, 16, s[34]),
                          k = h(k, G, T, P, S, 23, s[35]),
                          P = h(P, k, G, T, c, 4, s[36]),
                          T = h(T, P, k, G, m, 11, s[37]),
                          G = h(G, T, P, k, v, 16, s[38]),
                          k = h(k, G, T, P, w, 23, s[39]),
                          P = h(P, k, G, T, x, 4, s[40]),
                          T = h(T, P, k, G, a, 11, s[41]),
                          G = h(G, T, P, k, p, 16, s[42]),
                          k = h(k, G, T, P, g, 23, s[43]),
                          P = h(P, k, G, T, b, 4, s[44]),
                          T = h(T, P, k, G, _, 11, s[45]),
                          G = h(G, T, P, k, L, 16, s[46]),
                          P = d(P, k = h(k, G, T, P, f, 23, s[47]), G, T, a, 6, s[48]),
                          T = d(T, P, k, G, v, 10, s[49]),
                          G = d(G, T, P, k, S, 15, s[50]),
                          k = d(k, G, T, P, y, 21, s[51]),
                          P = d(P, k, G, T, _, 6, s[52]),
                          T = d(T, P, k, G, p, 10, s[53]),
                          G = d(G, T, P, k, w, 15, s[54]),
                          k = d(k, G, T, P, c, 21, s[55]),
                          P = d(P, k, G, T, E, 6, s[56]),
                          T = d(T, P, k, G, L, 10, s[57]),
                          G = d(G, T, P, k, g, 15, s[58]),
                          k = d(k, G, T, P, x, 21, s[59]),
                          P = d(P, k, G, T, m, 6, s[60]),
                          T = d(T, P, k, G, O, 10, s[61]),
                          G = d(G, T, P, k, f, 15, s[62]),
                          k = d(k, G, T, P, b, 21, s[63]),
                          o[0] = o[0] + P | 0,
                          o[1] = o[1] + k | 0,
                          o[2] = o[2] + G | 0,
                          o[3] = o[3] + T | 0
                      },
                      _doFinalize: function() {
                          var t = this._data
                            , n = t.words
                            , r = 8 * this._nDataBytes
                            , i = 8 * t.sigBytes;
                          n[i >>> 5] |= 128 << 24 - i % 32;
                          var o = e.floor(r / 4294967296)
                            , a = r;
                          n[15 + (i + 64 >>> 9 << 4)] = 16711935 & (o << 8 | o >>> 24) | 4278255360 & (o << 24 | o >>> 8),
                          n[14 + (i + 64 >>> 9 << 4)] = 16711935 & (a << 8 | a >>> 24) | 4278255360 & (a << 24 | a >>> 8),
                          t.sigBytes = 4 * (n.length + 1),
                          this._process();
                          for (var s = this._hash, c = s.words, l = 0; l < 4; l++) {
                              var u = c[l];
                              c[l] = 16711935 & (u << 8 | u >>> 24) | 4278255360 & (u << 24 | u >>> 8)
                          }
                          return s
                      },
                      clone: function() {
                          var e = o.clone.call(this);
                          return e._hash = this._hash.clone(),
                          e
                      }
                  });
                  function l(e, t, n, r, i, o, a) {
                      var s = e + (t & n | ~t & r) + i + a;
                      return (s << o | s >>> 32 - o) + t
                  }
                  function u(e, t, n, r, i, o, a) {
                      var s = e + (t & r | n & ~r) + i + a;
                      return (s << o | s >>> 32 - o) + t
                  }
                  function h(e, t, n, r, i, o, a) {
                      var s = e + (t ^ n ^ r) + i + a;
                      return (s << o | s >>> 32 - o) + t
                  }
                  function d(e, t, n, r, i, o, a) {
                      var s = e + (n ^ (t | ~r)) + i + a;
                      return (s << o | s >>> 32 - o) + t
                  }
                  t.MD5 = o._createHelper(c),
                  t.HmacMD5 = o._createHmacHelper(c)
              }(Math),
              r.MD5)
          },
          798: e=>{
              "use strict";
              var t = String.prototype.replace
                , n = /%20/g
                , r = "RFC1738"
                , i = "RFC3986";
              e.exports = {
                  default: i,
                  formatters: {
                      RFC1738: function(e) {
                          return t.call(e, n, "+")
                      },
                      RFC3986: function(e) {
                          return String(e)
                      }
                  },
                  RFC1738: r,
                  RFC3986: i
              }
          }
          ,
          129: (e,t,n)=>{
              "use strict";
              var r = n(261)
                , i = n(235)
                , o = n(798);
              e.exports = {
                  formats: o,
                  parse: i,
                  stringify: r
              }
          }
          ,
          235: (e,t,n)=>{
              "use strict";
              var r = n(769)
                , i = Object.prototype.hasOwnProperty
                , o = Array.isArray
                , a = {
                  allowDots: !1,
                  allowPrototypes: !1,
                  arrayLimit: 20,
                  charset: "utf-8",
                  charsetSentinel: !1,
                  comma: !1,
                  decoder: r.decode,
                  delimiter: "&",
                  depth: 5,
                  ignoreQueryPrefix: !1,
                  interpretNumericEntities: !1,
                  parameterLimit: 1e3,
                  parseArrays: !0,
                  plainObjects: !1,
                  strictNullHandling: !1
              }
                , s = function(e) {
                  return e.replace(/&#(\d+);/g, (function(e, t) {
                      return String.fromCharCode(parseInt(t, 10))
                  }
                  ))
              }
                , c = function(e, t) {
                  return e && "string" == typeof e && t.comma && e.indexOf(",") > -1 ? e.split(",") : e
              }
                , l = function(e, t, n, r) {
                  if (e) {
                      var o = n.allowDots ? e.replace(/\.([^.[]+)/g, "[$1]") : e
                        , a = /(\[[^[\]]*])/g
                        , s = n.depth > 0 && /(\[[^[\]]*])/.exec(o)
                        , l = s ? o.slice(0, s.index) : o
                        , u = [];
                      if (l) {
                          if (!n.plainObjects && i.call(Object.prototype, l) && !n.allowPrototypes)
                              return;
                          u.push(l)
                      }
                      for (var h = 0; n.depth > 0 && null !== (s = a.exec(o)) && h < n.depth; ) {
                          if (h += 1,
                          !n.plainObjects && i.call(Object.prototype, s[1].slice(1, -1)) && !n.allowPrototypes)
                              return;
                          u.push(s[1])
                      }
                      return s && u.push("[" + o.slice(s.index) + "]"),
                      function(e, t, n, r) {
                          for (var i = r ? t : c(t, n), o = e.length - 1; o >= 0; --o) {
                              var a, s = e[o];
                              if ("[]" === s && n.parseArrays)
                                  a = [].concat(i);
                              else {
                                  a = n.plainObjects ? Object.create(null) : {};
                                  var l = "[" === s.charAt(0) && "]" === s.charAt(s.length - 1) ? s.slice(1, -1) : s
                                    , u = parseInt(l, 10);
                                  n.parseArrays || "" !== l ? !isNaN(u) && s !== l && String(u) === l && u >= 0 && n.parseArrays && u <= n.arrayLimit ? (a = [])[u] = i : "__proto__" !== l && (a[l] = i) : a = {
                                      0: i
                                  }
                              }
                              i = a
                          }
                          return i
                      }(u, t, n, r)
                  }
              };
              e.exports = function(e, t) {
                  var n = function(e) {
                      if (!e)
                          return a;
                      if (null !== e.decoder && void 0 !== e.decoder && "function" != typeof e.decoder)
                          throw new TypeError("Decoder has to be a function.");
                      if (void 0 !== e.charset && "utf-8" !== e.charset && "iso-8859-1" !== e.charset)
                          throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
                      var t = void 0 === e.charset ? a.charset : e.charset;
                      return {
                          allowDots: void 0 === e.allowDots ? a.allowDots : !!e.allowDots,
                          allowPrototypes: "boolean" == typeof e.allowPrototypes ? e.allowPrototypes : a.allowPrototypes,
                          arrayLimit: "number" == typeof e.arrayLimit ? e.arrayLimit : a.arrayLimit,
                          charset: t,
                          charsetSentinel: "boolean" == typeof e.charsetSentinel ? e.charsetSentinel : a.charsetSentinel,
                          comma: "boolean" == typeof e.comma ? e.comma : a.comma,
                          decoder: "function" == typeof e.decoder ? e.decoder : a.decoder,
                          delimiter: "string" == typeof e.delimiter || r.isRegExp(e.delimiter) ? e.delimiter : a.delimiter,
                          depth: "number" == typeof e.depth || !1 === e.depth ? +e.depth : a.depth,
                          ignoreQueryPrefix: !0 === e.ignoreQueryPrefix,
                          interpretNumericEntities: "boolean" == typeof e.interpretNumericEntities ? e.interpretNumericEntities : a.interpretNumericEntities,
                          parameterLimit: "number" == typeof e.parameterLimit ? e.parameterLimit : a.parameterLimit,
                          parseArrays: !1 !== e.parseArrays,
                          plainObjects: "boolean" == typeof e.plainObjects ? e.plainObjects : a.plainObjects,
                          strictNullHandling: "boolean" == typeof e.strictNullHandling ? e.strictNullHandling : a.strictNullHandling
                      }
                  }(t);
                  if ("" === e || null == e)
                      return n.plainObjects ? Object.create(null) : {};
                  for (var u = "string" == typeof e ? function(e, t) {
                      var n, l = {}, u = t.ignoreQueryPrefix ? e.replace(/^\?/, "") : e, h = t.parameterLimit === 1 / 0 ? void 0 : t.parameterLimit, d = u.split(t.delimiter, h), f = -1, p = t.charset;
                      if (t.charsetSentinel)
                          for (n = 0; n < d.length; ++n)
                              0 === d[n].indexOf("utf8=") && ("utf8=%E2%9C%93" === d[n] ? p = "utf-8" : "utf8=%26%2310003%3B" === d[n] && (p = "iso-8859-1"),
                              f = n,
                              n = d.length);
                      for (n = 0; n < d.length; ++n)
                          if (n !== f) {
                              var m, y, g = d[n], v = g.indexOf("]="), E = -1 === v ? g.indexOf("=") : v + 1;
                              -1 === E ? (m = t.decoder(g, a.decoder, p, "key"),
                              y = t.strictNullHandling ? null : "") : (m = t.decoder(g.slice(0, E), a.decoder, p, "key"),
                              y = r.maybeMap(c(g.slice(E + 1), t), (function(e) {
                                  return t.decoder(e, a.decoder, p, "value")
                              }
                              ))),
                              y && t.interpretNumericEntities && "iso-8859-1" === p && (y = s(y)),
                              g.indexOf("[]=") > -1 && (y = o(y) ? [y] : y),
                              i.call(l, m) ? l[m] = r.combine(l[m], y) : l[m] = y
                          }
                      return l
                  }(e, n) : e, h = n.plainObjects ? Object.create(null) : {}, d = Object.keys(u), f = 0; f < d.length; ++f) {
                      var p = d[f]
                        , m = l(p, u[p], n, "string" == typeof e);
                      h = r.merge(h, m, n)
                  }
                  return r.compact(h)
              }
          }
          ,
          261: (e,t,n)=>{
              "use strict";
              var r = n(769)
                , i = n(798)
                , o = Object.prototype.hasOwnProperty
                , a = {
                  brackets: function(e) {
                      return e + "[]"
                  },
                  comma: "comma",
                  indices: function(e, t) {
                      return e + "[" + t + "]"
                  },
                  repeat: function(e) {
                      return e
                  }
              }
                , s = Array.isArray
                , c = String.prototype.split
                , l = Array.prototype.push
                , u = function(e, t) {
                  l.apply(e, s(t) ? t : [t])
              }
                , h = Date.prototype.toISOString
                , d = i.default
                , f = {
                  addQueryPrefix: !1,
                  allowDots: !1,
                  charset: "utf-8",
                  charsetSentinel: !1,
                  delimiter: "&",
                  encode: !0,
                  encoder: r.encode,
                  encodeValuesOnly: !1,
                  format: d,
                  formatter: i.formatters[d],
                  indices: !1,
                  serializeDate: function(e) {
                      return h.call(e)
                  },
                  skipNulls: !1,
                  strictNullHandling: !1
              }
                , p = function e(t, n, i, o, a, l, h, d, p, m, y, g, v, E) {
                  var b, w = t;
                  if ("function" == typeof h ? w = h(n, w) : w instanceof Date ? w = m(w) : "comma" === i && s(w) && (w = r.maybeMap(w, (function(e) {
                      return e instanceof Date ? m(e) : e
                  }
                  ))),
                  null === w) {
                      if (o)
                          return l && !v ? l(n, f.encoder, E, "key", y) : n;
                      w = ""
                  }
                  if ("string" == typeof (b = w) || "number" == typeof b || "boolean" == typeof b || "symbol" == typeof b || "bigint" == typeof b || r.isBuffer(w)) {
                      if (l) {
                          var O = v ? n : l(n, f.encoder, E, "key", y);
                          if ("comma" === i && v) {
                              for (var _ = c.call(String(w), ","), x = "", S = 0; S < _.length; ++S)
                                  x += (0 === S ? "" : ",") + g(l(_[S], f.encoder, E, "value", y));
                              return [g(O) + "=" + x]
                          }
                          return [g(O) + "=" + g(l(w, f.encoder, E, "value", y))]
                      }
                      return [g(n) + "=" + g(String(w))]
                  }
                  var L, P = [];
                  if (void 0 === w)
                      return P;
                  if ("comma" === i && s(w))
                      L = [{
                          value: w.length > 0 ? w.join(",") || null : void 0
                      }];
                  else if (s(h))
                      L = h;
                  else {
                      var k = Object.keys(w);
                      L = d ? k.sort(d) : k
                  }
                  for (var G = 0; G < L.length; ++G) {
                      var T = L[G]
                        , D = "object" == typeof T && void 0 !== T.value ? T.value : w[T];
                      if (!a || null !== D) {
                          var A = s(w) ? "function" == typeof i ? i(n, T) : n : n + (p ? "." + T : "[" + T + "]");
                          u(P, e(D, A, i, o, a, l, h, d, p, m, y, g, v, E))
                      }
                  }
                  return P
              };
              e.exports = function(e, t) {
                  var n, r = e, c = function(e) {
                      if (!e)
                          return f;
                      if (null !== e.encoder && void 0 !== e.encoder && "function" != typeof e.encoder)
                          throw new TypeError("Encoder has to be a function.");
                      var t = e.charset || f.charset;
                      if (void 0 !== e.charset && "utf-8" !== e.charset && "iso-8859-1" !== e.charset)
                          throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
                      var n = i.default;
                      if (void 0 !== e.format) {
                          if (!o.call(i.formatters, e.format))
                              throw new TypeError("Unknown format option provided.");
                          n = e.format
                      }
                      var r = i.formatters[n]
                        , a = f.filter;
                      return ("function" == typeof e.filter || s(e.filter)) && (a = e.filter),
                      {
                          addQueryPrefix: "boolean" == typeof e.addQueryPrefix ? e.addQueryPrefix : f.addQueryPrefix,
                          allowDots: void 0 === e.allowDots ? f.allowDots : !!e.allowDots,
                          charset: t,
                          charsetSentinel: "boolean" == typeof e.charsetSentinel ? e.charsetSentinel : f.charsetSentinel,
                          delimiter: void 0 === e.delimiter ? f.delimiter : e.delimiter,
                          encode: "boolean" == typeof e.encode ? e.encode : f.encode,
                          encoder: "function" == typeof e.encoder ? e.encoder : f.encoder,
                          encodeValuesOnly: "boolean" == typeof e.encodeValuesOnly ? e.encodeValuesOnly : f.encodeValuesOnly,
                          filter: a,
                          format: n,
                          formatter: r,
                          serializeDate: "function" == typeof e.serializeDate ? e.serializeDate : f.serializeDate,
                          skipNulls: "boolean" == typeof e.skipNulls ? e.skipNulls : f.skipNulls,
                          sort: "function" == typeof e.sort ? e.sort : null,
                          strictNullHandling: "boolean" == typeof e.strictNullHandling ? e.strictNullHandling : f.strictNullHandling
                      }
                  }(t);
                  "function" == typeof c.filter ? r = (0,
                  c.filter)("", r) : s(c.filter) && (n = c.filter);
                  var l, h = [];
                  if ("object" != typeof r || null === r)
                      return "";
                  l = t && t.arrayFormat in a ? t.arrayFormat : t && "indices"in t ? t.indices ? "indices" : "repeat" : "indices";
                  var d = a[l];
                  n || (n = Object.keys(r)),
                  c.sort && n.sort(c.sort);
                  for (var m = 0; m < n.length; ++m) {
                      var y = n[m];
                      c.skipNulls && null === r[y] || u(h, p(r[y], y, d, c.strictNullHandling, c.skipNulls, c.encode ? c.encoder : null, c.filter, c.sort, c.allowDots, c.serializeDate, c.format, c.formatter, c.encodeValuesOnly, c.charset))
                  }
                  var g = h.join(c.delimiter)
                    , v = !0 === c.addQueryPrefix ? "?" : "";
                  return c.charsetSentinel && ("iso-8859-1" === c.charset ? v += "utf8=%26%2310003%3B&" : v += "utf8=%E2%9C%93&"),
                  g.length > 0 ? v + g : ""
              }
          }
          ,
          769: (e,t,n)=>{
              "use strict";
              var r = n(798)
                , i = Object.prototype.hasOwnProperty
                , o = Array.isArray
                , a = function() {
                  for (var e = [], t = 0; t < 256; ++t)
                      e.push("%" + ((t < 16 ? "0" : "") + t.toString(16)).toUpperCase());
                  return e
              }()
                , s = function(e, t) {
                  for (var n = t && t.plainObjects ? Object.create(null) : {}, r = 0; r < e.length; ++r)
                      void 0 !== e[r] && (n[r] = e[r]);
                  return n
              };
              e.exports = {
                  arrayToObject: s,
                  assign: function(e, t) {
                      return Object.keys(t).reduce((function(e, n) {
                          return e[n] = t[n],
                          e
                      }
                      ), e)
                  },
                  combine: function(e, t) {
                      return [].concat(e, t)
                  },
                  compact: function(e) {
                      for (var t = [{
                          obj: {
                              o: e
                          },
                          prop: "o"
                      }], n = [], r = 0; r < t.length; ++r)
                          for (var i = t[r], a = i.obj[i.prop], s = Object.keys(a), c = 0; c < s.length; ++c) {
                              var l = s[c]
                                , u = a[l];
                              "object" == typeof u && null !== u && -1 === n.indexOf(u) && (t.push({
                                  obj: a,
                                  prop: l
                              }),
                              n.push(u))
                          }
                      return function(e) {
                          for (; e.length > 1; ) {
                              var t = e.pop()
                                , n = t.obj[t.prop];
                              if (o(n)) {
                                  for (var r = [], i = 0; i < n.length; ++i)
                                      void 0 !== n[i] && r.push(n[i]);
                                  t.obj[t.prop] = r
                              }
                          }
                      }(t),
                      e
                  },
                  decode: function(e, t, n) {
                      var r = e.replace(/\+/g, " ");
                      if ("iso-8859-1" === n)
                          return r.replace(/%[0-9a-f]{2}/gi, unescape);
                      try {
                          return decodeURIComponent(r)
                      } catch (e) {
                          return r
                      }
                  },
                  encode: function(e, t, n, i, o) {
                      if (0 === e.length)
                          return e;
                      var s = e;
                      if ("symbol" == typeof e ? s = Symbol.prototype.toString.call(e) : "string" != typeof e && (s = String(e)),
                      "iso-8859-1" === n)
                          return escape(s).replace(/%u[0-9a-f]{4}/gi, (function(e) {
                              return "%26%23" + parseInt(e.slice(2), 16) + "%3B"
                          }
                          ));
                      for (var c = "", l = 0; l < s.length; ++l) {
                          var u = s.charCodeAt(l);
                          45 === u || 46 === u || 95 === u || 126 === u || u >= 48 && u <= 57 || u >= 65 && u <= 90 || u >= 97 && u <= 122 || o === r.RFC1738 && (40 === u || 41 === u) ? c += s.charAt(l) : u < 128 ? c += a[u] : u < 2048 ? c += a[192 | u >> 6] + a[128 | 63 & u] : u < 55296 || u >= 57344 ? c += a[224 | u >> 12] + a[128 | u >> 6 & 63] + a[128 | 63 & u] : (l += 1,
                          u = 65536 + ((1023 & u) << 10 | 1023 & s.charCodeAt(l)),
                          c += a[240 | u >> 18] + a[128 | u >> 12 & 63] + a[128 | u >> 6 & 63] + a[128 | 63 & u])
                      }
                      return c
                  },
                  isBuffer: function(e) {
                      return !(!e || "object" != typeof e) && !!(e.constructor && e.constructor.isBuffer && e.constructor.isBuffer(e))
                  },
                  isRegExp: function(e) {
                      return "[object RegExp]" === Object.prototype.toString.call(e)
                  },
                  maybeMap: function(e, t) {
                      if (o(e)) {
                          for (var n = [], r = 0; r < e.length; r += 1)
                              n.push(t(e[r]));
                          return n
                      }
                      return t(e)
                  },
                  merge: function e(t, n, r) {
                      if (!n)
                          return t;
                      if ("object" != typeof n) {
                          if (o(t))
                              t.push(n);
                          else {
                              if (!t || "object" != typeof t)
                                  return [t, n];
                              (r && (r.plainObjects || r.allowPrototypes) || !i.call(Object.prototype, n)) && (t[n] = !0)
                          }
                          return t
                      }
                      if (!t || "object" != typeof t)
                          return [t].concat(n);
                      var a = t;
                      return o(t) && !o(n) && (a = s(t, r)),
                      o(t) && o(n) ? (n.forEach((function(n, o) {
                          if (i.call(t, o)) {
                              var a = t[o];
                              a && "object" == typeof a && n && "object" == typeof n ? t[o] = e(a, n, r) : t.push(n)
                          } else
                              t[o] = n
                      }
                      )),
                      t) : Object.keys(n).reduce((function(t, o) {
                          var a = n[o];
                          return i.call(t, o) ? t[o] = e(t[o], a, r) : t[o] = a,
                          t
                      }
                      ), a)
                  }
              }
          }
          ,
          267: e=>{
              const t = {
                  auto: "Automatic",
                  af: "Afrikaans",
                  sq: "Albanian",
                  am: "Amharic",
                  ar: "Arabic",
                  hy: "Armenian",
                  az: "Azerbaijani",
                  eu: "Basque",
                  be: "Belarusian",
                  bn: "Bengali",
                  bs: "Bosnian",
                  bg: "Bulgarian",
                  ca: "Catalan",
                  ceb: "Cebuano",
                  ny: "Chichewa",
                  "zh-cn": "Chinese Simplified",
                  "zh-tw": "Chinese Traditional",
                  co: "Corsican",
                  hr: "Croatian",
                  cs: "Czech",
                  da: "Danish",
                  nl: "Dutch",
                  en: "English",
                  eo: "Esperanto",
                  et: "Estonian",
                  tl: "Filipino",
                  fi: "Finnish",
                  fr: "French",
                  fy: "Frisian",
                  gl: "Galician",
                  ka: "Georgian",
                  de: "German",
                  el: "Greek",
                  gu: "Gujarati",
                  ht: "Haitian Creole",
                  ha: "Hausa",
                  haw: "Hawaiian",
                  iw: "Hebrew",
                  hi: "Hindi",
                  hmn: "Hmong",
                  hu: "Hungarian",
                  is: "Icelandic",
                  ig: "Igbo",
                  id: "Indonesian",
                  ga: "Irish",
                  it: "Italian",
                  ja: "Japanese",
                  jw: "Javanese",
                  kn: "Kannada",
                  kk: "Kazakh",
                  km: "Khmer",
                  ko: "Korean",
                  ku: "Kurdish (Kurmanji)",
                  ky: "Kyrgyz",
                  lo: "Lao",
                  la: "Latin",
                  lv: "Latvian",
                  lt: "Lithuanian",
                  lb: "Luxembourgish",
                  mk: "Macedonian",
                  mg: "Malagasy",
                  ms: "Malay",
                  ml: "Malayalam",
                  mt: "Maltese",
                  mi: "Maori",
                  mr: "Marathi",
                  mn: "Mongolian",
                  my: "Myanmar (Burmese)",
                  ne: "Nepali",
                  no: "Norwegian",
                  ps: "Pashto",
                  fa: "Persian",
                  pl: "Polish",
                  pt: "Portuguese",
                  pa: "Punjabi",
                  ro: "Romanian",
                  ru: "Russian",
                  sm: "Samoan",
                  gd: "Scots Gaelic",
                  sr: "Serbian",
                  st: "Sesotho",
                  sn: "Shona",
                  sd: "Sindhi",
                  si: "Sinhala",
                  sk: "Slovak",
                  sl: "Slovenian",
                  so: "Somali",
                  es: "Spanish",
                  su: "Sundanese",
                  sw: "Swahili",
                  sv: "Swedish",
                  tg: "Tajik",
                  ta: "Tamil",
                  te: "Telugu",
                  th: "Thai",
                  tr: "Turkish",
                  uk: "Ukrainian",
                  ur: "Urdu",
                  uz: "Uzbek",
                  vi: "Vietnamese",
                  cy: "Welsh",
                  xh: "Xhosa",
                  yi: "Yiddish",
                  yo: "Yoruba",
                  zu: "Zulu"
              };
              function n(e) {
                  if (!e)
                      return !1;
                  if ((e = e.toLowerCase())in t)
                      return e;
                  return Object.keys(t).filter((n=>"string" == typeof t[n] && t[n].toLowerCase() === e))[0] || null
              }
              e.exports = t,
              e.exports.isSupported = function(e) {
                  return Boolean(n(e))
              }
              ,
              e.exports.getISOCode = n
          }
          ,
          280: e=>{
              const t = {
                  TKK: "0"
              };
              let n = null
                , r = function(e) {
                  return function() {
                      return e
                  }
              }
                , i = function(e, t) {
                  for (let n = 0; n < t.length - 2; n += 3) {
                      let r = t.charAt(n + 2);
                      r = r >= "a" ? r.charCodeAt(0) - 87 : Number(r),
                      r = "+" == t.charAt(n + 1) ? e >>> r : e << r,
                      e = "+" == t.charAt(n) ? e + r & 4294967295 : e ^ r
                  }
                  return e
              };
              e.exports.generate = async function(e) {
                  try {
                      let o = function(e) {
                          let o;
                          if (null !== n)
                              o = n;
                          else {
                              o = r(String.fromCharCode(84));
                              let e = r(String.fromCharCode(75));
                              o = [o(), o()],
                              o[1] = e(),
                              o = (n = t[o.join(e())] || "") || ""
                          }
                          let a = r(String.fromCharCode(116))
                            , s = r(String.fromCharCode(107));
                          a = [a(), a()],
                          a[1] = s(),
                          s = "&" + a.join("") + "=",
                          a = o.split("."),
                          o = Number(a[0]) || 0;
                          for (var c = [], l = 0, u = 0; u < e.length; u++) {
                              let t = e.charCodeAt(u);
                              128 > t ? c[l++] = t : (2048 > t ? c[l++] = t >> 6 | 192 : (55296 == (64512 & t) && u + 1 < e.length && 56320 == (64512 & e.charCodeAt(u + 1)) ? (t = 65536 + ((1023 & t) << 10) + (1023 & e.charCodeAt(++u)),
                              c[l++] = t >> 18 | 240,
                              c[l++] = t >> 12 & 63 | 128) : c[l++] = t >> 12 | 224,
                              c[l++] = t >> 6 & 63 | 128),
                              c[l++] = 63 & t | 128)
                          }
                          e = o;
                          for (let t = 0; t < c.length; t++)
                              e += c[t],
                              e = i(e, "+-a^+6");
                          return e = i(e, "+-3^+b+-f"),
                          0 > (e ^= Number(a[1]) || 0) && (e = 2147483648 + (2147483647 & e)),
                          s + ((e %= 1e6).toString() + ".") + (e ^ o)
                      }(e);
                      return o = o.replace("&tk=", ""),
                      {
                          name: "tk",
                          value: o
                      }
                  } catch (e) {
                      return e
                  }
              }
          }
          ,
          861: (e,t,n)=>{
              !function(e) {
                  var t = {};
                  function n(r) {
                      if (t[r])
                          return t[r].exports;
                      var i = t[r] = {
                          i: r,
                          l: !1,
                          exports: {}
                      };
                      return e[r].call(i.exports, i, i.exports, n),
                      i.l = !0,
                      i.exports
                  }
                  n.m = e,
                  n.c = t,
                  n.d = function(e, t, r) {
                      n.o(e, t) || Object.defineProperty(e, t, {
                          enumerable: !0,
                          get: r
                      })
                  }
                  ,
                  n.r = function(e) {
                      "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
                          value: "Module"
                      }),
                      Object.defineProperty(e, "__esModule", {
                          value: !0
                      })
                  }
                  ,
                  n.t = function(e, t) {
                      if (1 & t && (e = n(e)),
                      8 & t)
                          return e;
                      if (4 & t && "object" == typeof e && e && e.__esModule)
                          return e;
                      var r = Object.create(null);
                      if (n.r(r),
                      Object.defineProperty(r, "default", {
                          enumerable: !0,
                          value: e
                      }),
                      2 & t && "string" != typeof e)
                          for (var i in e)
                              n.d(r, i, function(t) {
                                  return e[t]
                              }
                              .bind(null, i));
                      return r
                  }
                  ,
                  n.n = function(e) {
                      var t = e && e.__esModule ? function() {
                          return e.default
                      }
                      : function() {
                          return e
                      }
                      ;
                      return n.d(t, "a", t),
                      t
                  }
                  ,
                  n.o = function(e, t) {
                      return Object.prototype.hasOwnProperty.call(e, t)
                  }
                  ,
                  n.p = "",
                  n(n.s = "./src/preload.ts")
              }({
                  "./src/preload.ts": function(e, t, n) {
                      "use strict";
                      n.r(t);
                      var r = n("./src/renderer/index.ts");
                      location.href.startsWith("chrome-extension://") && Object(r.injectExtensionAPIs)()
                  },
                  "./src/renderer/event.ts": function(e, t, n) {
                      "use strict";
                      n.r(t),
                      n.d(t, "addExtensionListener", (function() {
                          return a
                      }
                      )),
                      n.d(t, "removeExtensionListener", (function() {
                          return s
                      }
                      ));
                      var r = n("electron");
                      const i = e=>`crx-${e}`
                        , o = new Map
                        , a = (e,t,n)=>{
                          const a = o.get(t) || 0;
                          0 === a && r.ipcRenderer.send("crx-add-listener", e, t),
                          o.set(t, a + 1),
                          r.ipcRenderer.addListener(i(t), (function(e, ...r) {
                              console.log(t, "(result)", ...r),
                              n(...r)
                          }
                          ))
                      }
                        , s = (e,t,n)=>{
                          if (o.has(t)) {
                              const n = o.get(t) || 0;
                              n <= 1 ? (o.delete(t),
                              r.ipcRenderer.send("crx-remove-listener", e, t)) : o.set(t, n - 1)
                          }
                          r.ipcRenderer.removeListener(i(t), n)
                      }
                  },
                  "./src/renderer/index.ts": function(e, t, n) {
                      "use strict";
                      n.r(t),
                      n.d(t, "injectExtensionAPIs", (function() {
                          return o
                      }
                      ));
                      var r = n("electron")
                        , i = n("./src/renderer/event.ts");
                      const o = ()=>{
                          const e = {
                              invokeExtension: async function(e, t, n={}, ...i) {
                                  const o = "function" == typeof i[i.length - 1] ? i.pop() : void 0;
                                  if (console.log(t, i),
                                  n.noop)
                                      return console.warn(`${t} is not yet implemented.`),
                                      void (o && o());
                                  let a;
                                  n.serialize && (i = n.serialize(...i));
                                  try {
                                      a = await r.ipcRenderer.invoke("crx-msg", e, t, ...i)
                                  } catch (e) {
                                      console.error(e),
                                      a = void 0
                                  }
                                  if (console.log(t, "(result)", a),
                                  !o)
                                      return a;
                                  o(a)
                              },
                              addExtensionListener: i.addExtensionListener,
                              removeExtensionListener: i.removeExtensionListener
                          };
                          function t() {
                              var t;
                              const n = window.electron || e
                                , r = window.chrome || {}
                                , i = null === (t = r.runtime) || void 0 === t ? void 0 : t.id
                                , o = i && r.runtime.getManifest() || {}
                                , a = (e,t={})=>(...r)=>n.invokeExtension(i, e, t, ...r);
                              function s(e) {
                                  const t = document.createElement("canvas")
                                    , n = t.getContext("2d");
                                  return n ? (t.width = e.width,
                                  t.height = e.height,
                                  n.putImageData(e, 0, 0),
                                  t.toDataURL()) : null
                              }
                              class c {
                                  constructor(e) {
                                      this.name = e
                                  }
                                  addListener(e) {
                                      n.addExtensionListener(i, this.name, e)
                                  }
                                  removeListener(e) {
                                      n.removeExtensionListener(i, this.name, e)
                                  }
                                  getRules(e, t) {
                                      throw new Error("Method not implemented.")
                                  }
                                  hasListener(e) {
                                      throw new Error("Method not implemented.")
                                  }
                                  removeRules(e, t) {
                                      throw new Error("Method not implemented.")
                                  }
                                  addRules(e, t) {
                                      throw new Error("Method not implemented.")
                                  }
                                  hasListeners() {
                                      throw new Error("Method not implemented.")
                                  }
                              }
                              class l {
                                  set() {}
                                  get() {}
                                  clear() {}
                              }
                              const u = {
                                  browserAction: {
                                      shouldInject: ()=>!!o.browser_action,
                                      factory: e=>({
                                          ...e,
                                          setTitle: a("browserAction.setTitle"),
                                          getTitle: a("browserAction.getTitle"),
                                          setIcon: a("browserAction.setIcon", {
                                              serialize: e=>(e.imageData && (e.imageData instanceof ImageData ? e.imageData = s(e.imageData) : e.imageData = Object.entries(e.imageData).reduce(((e,t)=>(e[t[0]] = s(t[1]),
                                              e)), {})),
                                              [e])
                                          }),
                                          setPopup: a("browserAction.setPopup"),
                                          getPopup: a("browserAction.getPopup"),
                                          setBadgeText: a("browserAction.setBadgeText"),
                                          getBadgeText: a("browserAction.getBadgeText"),
                                          setBadgeBackgroundColor: a("browserAction.setBadgeBackgroundColor"),
                                          getBadgeBackgroundColor: a("browserAction.getBadgeBackgroundColor"),
                                          enable: a("browserAction.enable", {
                                              noop: !0
                                          }),
                                          disable: a("browserAction.disable", {
                                              noop: !0
                                          }),
                                          onClicked: new c("browserAction.onClicked")
                                      })
                                  },
                                  commands: {
                                      factory: e=>({
                                          ...e,
                                          getAll: a("commands.getAll"),
                                          onCommand: new c("commands.onCommand")
                                      })
                                  },
                                  contextMenus: {
                                      factory: e=>{
                                          let t = 0;
                                          const n = {}
                                            , r = a("contextMenus.create");
                                          let i = !1;
                                          const o = {
                                              ...e,
                                              create: function(e, a) {
                                                  return void 0 === e.id && (e.id = "" + ++t),
                                                  e.onclick && (i || (o.onClicked.addListener(((e,t)=>{
                                                      const r = n[e.menuItemId];
                                                      r && t && r(e, t)
                                                  }
                                                  )),
                                                  i = !0),
                                                  n[e.id] = e.onclick,
                                                  delete e.onclick),
                                                  r(e, a),
                                                  e.id
                                              },
                                              update: a("contextMenus.update", {
                                                  noop: !0
                                              }),
                                              remove: a("contextMenus.remove"),
                                              removeAll: a("contextMenus.removeAll"),
                                              onClicked: new c("contextMenus.onClicked")
                                          };
                                          return o
                                      }
                                  },
                                  cookies: {
                                      factory: e=>({
                                          ...e,
                                          get: a("cookies.get"),
                                          getAll: a("cookies.getAll"),
                                          set: a("cookies.set"),
                                          remove: a("cookies.remove"),
                                          getAllCookieStores: a("cookies.getAllCookieStores"),
                                          onChanged: new c("cookies.onChanged")
                                      })
                                  },
                                  extension: {
                                      factory: e=>({
                                          ...e,
                                          isAllowedIncognitoAccess: ()=>!1,
                                          getViews: ()=>[]
                                      })
                                  },
                                  notifications: {
                                      factory: e=>({
                                          ...e,
                                          clear: a("notifications.clear"),
                                          create: a("notifications.create"),
                                          getAll: a("notifications.getAll"),
                                          getPermissionLevel: a("notifications.getPermissionLevel"),
                                          update: a("notifications.update"),
                                          onClicked: new c("notifications.onClicked"),
                                          onButtonClicked: new c("notifications.onButtonClicked"),
                                          onClosed: new c("notifications.onClosed")
                                      })
                                  },
                                  privacy: {
                                      factory: e=>({
                                          ...e,
                                          network: {
                                              networkPredictionEnabled: new l,
                                              webRTCIPHandlingPolicy: new l
                                          },
                                          websites: {
                                              hyperlinkAuditingEnabled: new l
                                          }
                                      })
                                  },
                                  runtime: {
                                      factory: e=>({
                                          ...e,
                                          openOptionsPage: a("runtime.openOptionsPage")
                                      })
                                  },
                                  storage: {
                                      factory: e=>{
                                          const t = e && e.local;
                                          return {
                                              ...e,
                                              managed: t,
                                              sync: t
                                          }
                                      }
                                  },
                                  tabs: {
                                      factory: e=>{
                                          const t = {
                                              ...e,
                                              create: a("tabs.create"),
                                              executeScript: function(n, i, o) {
                                                  "object" == typeof n ? t.query({
                                                      active: !0,
                                                      windowId: r.windows.WINDOW_ID_CURRENT
                                                  }, (([e])=>{
                                                      t.executeScript(e.id, n, i)
                                                  }
                                                  )) : e.executeScript(n, i, o)
                                              },
                                              get: a("tabs.get"),
                                              getCurrent: a("tabs.getCurrent"),
                                              getAllInWindow: a("tabs.getAllInWindow"),
                                              insertCSS: a("tabs.insertCSS"),
                                              query: a("tabs.query"),
                                              reload: a("tabs.reload"),
                                              update: a("tabs.update"),
                                              remove: a("tabs.remove"),
                                              goBack: a("tabs.goBack"),
                                              goForward: a("tabs.goForward"),
                                              onCreated: new c("tabs.onCreated"),
                                              onRemoved: new c("tabs.onRemoved"),
                                              onUpdated: new c("tabs.onUpdated"),
                                              onActivated: new c("tabs.onActivated"),
                                              onReplaced: new c("tabs.onReplaced")
                                          };
                                          return t
                                      }
                                  },
                                  webNavigation: {
                                      factory: e=>({
                                          ...e,
                                          getFrame: a("webNavigation.getFrame"),
                                          getAllFrames: a("webNavigation.getAllFrames"),
                                          onBeforeNavigate: new c("webNavigation.onBeforeNavigate"),
                                          onCommitted: new c("webNavigation.onCommitted"),
                                          onCompleted: new c("webNavigation.onCompleted"),
                                          onCreatedNavigationTarget: new c("webNavigation.onCreatedNavigationTarget"),
                                          onDOMContentLoaded: new c("webNavigation.onDOMContentLoaded"),
                                          onErrorOccurred: new c("webNavigation.onErrorOccurred"),
                                          onHistoryStateUpdated: new c("webNavigation.onHistoryStateUpdated"),
                                          onReferenceFragmentUpdated: new c("webNavigation.onReferenceFragmentUpdated"),
                                          onTabReplaced: new c("webNavigation.onTabReplaced")
                                      })
                                  },
                                  webRequest: {
                                      factory: e=>({
                                          ...e,
                                          onHeadersReceived: new c("webRequest.onHeadersReceived")
                                      })
                                  },
                                  windows: {
                                      factory: e=>({
                                          ...e,
                                          WINDOW_ID_NONE: -1,
                                          WINDOW_ID_CURRENT: -2,
                                          get: a("windows.get"),
                                          getLastFocused: a("windows.getLastFocused"),
                                          getAll: a("windows.getAll"),
                                          create: a("windows.create"),
                                          update: a("windows.update"),
                                          remove: a("windows.remove"),
                                          onCreated: new c("windows.onCreated"),
                                          onRemoved: new c("windows.onRemoved"),
                                          onFocusChanged: new c("windows.onFocusChanged")
                                      })
                                  }
                              };
                              Object.keys(u).forEach((e=>{
                                  const t = e
                                    , n = r[t]
                                    , i = u[t];
                                  i.shouldInject && !i.shouldInject() || Object.defineProperty(r, t, {
                                      value: i.factory(n),
                                      enumerable: !0,
                                      configurable: !0
                                  })
                              }
                              )),
                              delete window.electron,
                              Object.freeze(r)
                          }
                          try {
                              r.contextBridge.exposeInMainWorld("electron", e),
                              r.webFrame.executeJavaScript(`(${t}());`)
                          } catch {
                              t()
                          }
                      }
                  },
                  electron: function(e, t) {
                      e.exports = n(298)
                  }
              })
          }
          ,
          113: e=>{
              "use strict";
              e.exports = require("crypto")
          }
          ,
          298: e=>{
              "use strict";
              e.exports = require("electron")
          }
      }
        , t = {};
      function n(r) {
          var i = t[r];
          if (void 0 !== i)
              return i.exports;
          var o = t[r] = {
              exports: {}
          };
          return e[r].call(o.exports, o, o.exports, n),
          o.exports
      }
      n.n = e=>{
          var t = e && e.__esModule ? ()=>e.default : ()=>e;
          return n.d(t, {
              a: t
          }),
          t
      }
      ,
      n.d = (e,t)=>{
          for (var r in t)
              n.o(t, r) && !n.o(e, r) && Object.defineProperty(e, r, {
                  enumerable: !0,
                  get: t[r]
              })
      }
      ,
      n.o = (e,t)=>Object.prototype.hasOwnProperty.call(e, t),
      n.r = e=>{
          "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
              value: "Module"
          }),
          Object.defineProperty(e, "__esModule", {
              value: !0
          })
      }
      ;
      var r = {};
      return (()=>{
          "use strict";
          var e;
          n.r(r),
          function(e) {
              e.WHATSAPP = "WHATSAPP",
              e.ZALO = "ZALO",
              e.LINE = "LINE",
              e.TELEGRAM = "TELEGRAM",
              e.TWITTER = "TWITTER",
              e.FACEBOOK = "FACEBOOK",
              e.INSTAGRAM = "INSTAGRAM",
              e.MESSENGER = "MESSENGER",
              e.TIKTOK = "TIKTOK",
              e.CUSTOM = "CUSTOM"
          }(e || (e = {}));
          const t = {
              [e.WHATSAPP]: {
                  title: "Whatsapp",
                  type: e.WHATSAPP,
                  url: "https://web.whatsapp.com/",
                  checkUrl: "https://web.whatsapp.com/",
                  serverId: 1,
                  contactType: "手机号",
                  preload: "whatsapp-preload"
              },
              [e.ZALO]: {
                  title: "Zalo",
                  type: e.ZALO,
                  url: "https://chat.zalo.me/",
                  checkUrl: "https://chat.zalo.me/",
                  serverId: 2,
                  contactType: "用户名",
                  preload: "zalo-preload"
              },
              [e.LINE]: {
                  title: "Line",
                  type: e.LINE,
                  url: "chrome-extension://ophjlpahpchlmihnnnihgmmeilfjmjjc/index.html",
                  checkUrl: "https://line.me",
                  serverId: 3,
                  contactType: "手机号",
                  preload: "line-preload"
              },
              [e.TELEGRAM]: {
                  title: "Telegram",
                  type: e.TELEGRAM,
                  url: "https://web.telegram.org/z/",
                  checkUrl: "https://web.telegram.org/z/",
                  serverId: 4,
                  contactType: "用户名",
                  preload: "telegram-preload"
              },
              [e.TIKTOK]: {
                  title: "Tiktok",
                  type: e.TIKTOK,
                  url: "https://www.tiktok.com/messages",
                  checkUrl: "https://www.tiktok.com/messages",
                  serverId: 6,
                  contactType: "用户名",
                  preload: "tiktok-preload"
              },
              [e.INSTAGRAM]: {
                  title: "Instagram",
                  type: e.INSTAGRAM,
                  url: "https://www.instagram.com/direct/inbox/",
                  checkUrl: "https://www.instagram.com/direct/inbox/",
                  serverId: 7,
                  contactType: "用户名",
                  preload: "instagram-preload"
              },
              [e.FACEBOOK]: {
                  title: "Facebook",
                  type: e.FACEBOOK,
                  url: "https://www.facebook.com/messages/",
                  checkUrl: "https://www.facebook.com/messages/",
                  serverId: 8,
                  contactType: "用户名",
                  preload: "facebook-preload"
              },
              [e.TWITTER]: {
                  title: "Twitter",
                  type: e.TWITTER,
                  url: "https://twitter.com/messages",
                  checkUrl: "https://twitter.com/messages",
                  serverId: 9,
                  contactType: "用户名",
                  preload: "twitter-preload"
              },
              [e.MESSENGER]: {
                  title: "Messenger",
                  type: e.MESSENGER,
                  url: "https://www.messenger.com",
                  checkUrl: "https://www.messenger.com",
                  serverId: 10,
                  contactType: "用户名",
                  preload: "messenger-preload"
              },
              [e.CUSTOM]: {
                  title: "自定义Web",
                  type: e.CUSTOM,
                  url: "",
                  checkUrl: "",
                  serverId: 10,
                  contactType: "用户名",
                  preload: ""
              }
          };
          var i = function() {
              var e, t, n, r, i, o, a = [], s = a.concat, c = a.filter, l = a.slice, u = window.document, h = {}, d = {}, f = {
                  "column-count": 1,
                  columns: 1,
                  "font-weight": 1,
                  "line-height": 1,
                  opacity: 1,
                  "z-index": 1,
                  zoom: 1
              }, p = /^\s*<(\w+|!)[^>]*>/, m = /^<(\w+)\s*\/?>(?:<\/\1>|)$/, y = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, g = /^(?:body|html)$/i, v = /([A-Z])/g, E = ["val", "css", "html", "text", "data", "width", "height", "offset"], b = u.createElement("table"), w = u.createElement("tr"), O = {
                  tr: u.createElement("tbody"),
                  tbody: b,
                  thead: b,
                  tfoot: b,
                  td: w,
                  th: w,
                  "*": u.createElement("div")
              }, _ = /complete|loaded|interactive/, x = /^[\w-]*$/, S = {}, L = S.toString, P = {}, k = u.createElement("div"), G = {
                  tabindex: "tabIndex",
                  readonly: "readOnly",
                  for: "htmlFor",
                  class: "className",
                  maxlength: "maxLength",
                  cellspacing: "cellSpacing",
                  cellpadding: "cellPadding",
                  rowspan: "rowSpan",
                  colspan: "colSpan",
                  usemap: "useMap",
                  frameborder: "frameBorder",
                  contenteditable: "contentEditable"
              }, T = Array.isArray || function(e) {
                  return e instanceof Array
              }
              ;
              function D(e) {
                  return null == e ? String(e) : S[L.call(e)] || "object"
              }
              function A(e) {
                  return "function" == D(e)
              }
              function C(e) {
                  return null != e && e == e.window
              }
              function N(e) {
                  return null != e && e.nodeType == e.DOCUMENT_NODE
              }
              function I(e) {
                  return "object" == D(e)
              }
              function j(e) {
                  return I(e) && !C(e) && Object.getPrototypeOf(e) == Object.prototype
              }
              function R(e) {
                  var t = !!e && "length"in e && e.length
                    , r = n.type(e);
                  return "function" != r && !C(e) && ("array" == r || 0 === t || "number" == typeof t && t > 0 && t - 1 in e)
              }
              function M(e) {
                  return e.replace(/::/g, "/").replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z\d])([A-Z])/g, "$1_$2").replace(/_/g, "-").toLowerCase()
              }
              function B(e) {
                  return e in d ? d[e] : d[e] = new RegExp("(^|\\s)" + e + "(\\s|$)")
              }
              function K(e, t) {
                  return "number" != typeof t || f[M(e)] ? t : t + "px"
              }
              function F(e) {
                  return "children"in e ? l.call(e.children) : n.map(e.childNodes, (function(e) {
                      if (1 == e.nodeType)
                          return e
                  }
                  ))
              }
              function q(e, t) {
                  var n, r = e ? e.length : 0;
                  for (n = 0; n < r; n++)
                      this[n] = e[n];
                  this.length = r,
                  this.selector = t || ""
              }
              function U(n, r, i) {
                  for (t in r)
                      i && (j(r[t]) || T(r[t])) ? (j(r[t]) && !j(n[t]) && (n[t] = {}),
                      T(r[t]) && !T(n[t]) && (n[t] = []),
                      U(n[t], r[t], i)) : r[t] !== e && (n[t] = r[t])
              }
              function z(e, t) {
                  return null == t ? n(e) : n(e).filter(t)
              }
              function $(e, t, n, r) {
                  return A(t) ? t.call(e, n, r) : t
              }
              function W(e, t, n) {
                  null == n ? e.removeAttribute(t) : e.setAttribute(t, n)
              }
              function H(t, n) {
                  var r = t.className || ""
                    , i = r && r.baseVal !== e;
                  if (n === e)
                      return i ? r.baseVal : r;
                  i ? r.baseVal = n : t.className = n
              }
              function V(e) {
                  try {
                      return e ? "true" == e || "false" != e && ("null" == e ? null : +e + "" == e ? +e : /^[\[\{]/.test(e) ? n.parseJSON(e) : e) : e
                  } catch (t) {
                      return e
                  }
              }
              function Y(e, t) {
                  t(e);
                  for (var n = 0, r = e.childNodes.length; n < r; n++)
                      Y(e.childNodes[n], t)
              }
              return P.matches = function(e, t) {
                  if (!t || !e || 1 !== e.nodeType)
                      return !1;
                  var n = e.matches || e.webkitMatchesSelector || e.mozMatchesSelector || e.oMatchesSelector || e.matchesSelector;
                  if (n)
                      return n.call(e, t);
                  var r, i = e.parentNode, o = !i;
                  return o && (i = k).appendChild(e),
                  r = ~P.qsa(i, t).indexOf(e),
                  o && k.removeChild(e),
                  r
              }
              ,
              i = function(e) {
                  return e.replace(/-+(.)?/g, (function(e, t) {
                      return t ? t.toUpperCase() : ""
                  }
                  ))
              }
              ,
              o = function(e) {
                  return c.call(e, (function(t, n) {
                      return e.indexOf(t) == n
                  }
                  ))
              }
              ,
              P.fragment = function(t, r, i) {
                  var o, a, s;
                  return m.test(t) && (o = n(u.createElement(RegExp.$1))),
                  o || (t.replace && (t = t.replace(y, "<$1></$2>")),
                  r === e && (r = p.test(t) && RegExp.$1),
                  r in O || (r = "*"),
                  (s = O[r]).innerHTML = "" + t,
                  o = n.each(l.call(s.childNodes), (function() {
                      s.removeChild(this)
                  }
                  ))),
                  j(i) && (a = n(o),
                  n.each(i, (function(e, t) {
                      E.indexOf(e) > -1 ? a[e](t) : a.attr(e, t)
                  }
                  ))),
                  o
              }
              ,
              P.Z = function(e, t) {
                  return new q(e,t)
              }
              ,
              P.isZ = function(e) {
                  return e instanceof P.Z
              }
              ,
              P.init = function(t, r) {
                  var i, o;
                  if (!t)
                      return P.Z();
                  if ("string" == typeof t)
                      if ("<" == (t = t.trim())[0] && p.test(t))
                          i = P.fragment(t, RegExp.$1, r),
                          t = null;
                      else {
                          if (r !== e)
                              return n(r).find(t);
                          i = P.qsa(u, t)
                      }
                  else {
                      if (A(t))
                          return n(u).ready(t);
                      if (P.isZ(t))
                          return t;
                      if (T(t))
                          o = t,
                          i = c.call(o, (function(e) {
                              return null != e
                          }
                          ));
                      else if (I(t))
                          i = [t],
                          t = null;
                      else if (p.test(t))
                          i = P.fragment(t.trim(), RegExp.$1, r),
                          t = null;
                      else {
                          if (r !== e)
                              return n(r).find(t);
                          i = P.qsa(u, t)
                      }
                  }
                  return P.Z(i, t)
              }
              ,
              (n = function(e, t) {
                  return P.init(e, t)
              }
              ).extend = function(e) {
                  var t, n = l.call(arguments, 1);
                  return "boolean" == typeof e && (t = e,
                  e = n.shift()),
                  n.forEach((function(n) {
                      U(e, n, t)
                  }
                  )),
                  e
              }
              ,
              P.qsa = function(e, t) {
                  var n, r = "#" == t[0], i = !r && "." == t[0], o = r || i ? t.slice(1) : t, a = x.test(o);
                  return e.getElementById && a && r ? (n = e.getElementById(o)) ? [n] : [] : 1 !== e.nodeType && 9 !== e.nodeType && 11 !== e.nodeType ? [] : l.call(a && !r && e.getElementsByClassName ? i ? e.getElementsByClassName(o) : e.getElementsByTagName(t) : e.querySelectorAll(t))
              }
              ,
              n.contains = u.documentElement && u.documentElement.contains ? function(e, t) {
                  return e !== t && e.contains(t)
              }
              : function(e, t) {
                  for (; t && (t = t.parentNode); )
                      if (t === e)
                          return !0;
                  return !1
              }
              ,
              n.type = D,
              n.isFunction = A,
              n.isWindow = C,
              n.isArray = T,
              n.isPlainObject = j,
              n.isEmptyObject = function(e) {
                  var t;
                  for (t in e)
                      return !1;
                  return !0
              }
              ,
              n.isNumeric = function(e) {
                  var t = Number(e)
                    , n = typeof e;
                  return null != e && "boolean" != n && ("string" != n || e.length) && !isNaN(t) && isFinite(t) || !1
              }
              ,
              n.inArray = function(e, t, n) {
                  return a.indexOf.call(t, e, n)
              }
              ,
              n.camelCase = i,
              n.trim = function(e) {
                  return null == e ? "" : String.prototype.trim.call(e)
              }
              ,
              n.uuid = 0,
              n.support = {},
              n.expr = {},
              n.noop = function() {}
              ,
              n.map = function(e, t) {
                  var r, i, o, a, s = [];
                  if (R(e))
                      for (i = 0; i < e.length; i++)
                          null != (r = t(e[i], i)) && s.push(r);
                  else
                      for (o in e)
                          null != (r = t(e[o], o)) && s.push(r);
                  return (a = s).length > 0 ? n.fn.concat.apply([], a) : a
              }
              ,
              n.each = function(e, t) {
                  var n, r;
                  if (R(e)) {
                      for (n = 0; n < e.length; n++)
                          if (!1 === t.call(e[n], n, e[n]))
                              return e
                  } else
                      for (r in e)
                          if (!1 === t.call(e[r], r, e[r]))
                              return e;
                  return e
              }
              ,
              n.grep = function(e, t) {
                  return c.call(e, t)
              }
              ,
              window.JSON && (n.parseJSON = JSON.parse),
              n.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), (function(e, t) {
                  S["[object " + t + "]"] = t.toLowerCase()
              }
              )),
              n.fn = {
                  constructor: P.Z,
                  length: 0,
                  forEach: a.forEach,
                  reduce: a.reduce,
                  push: a.push,
                  sort: a.sort,
                  splice: a.splice,
                  indexOf: a.indexOf,
                  concat: function() {
                      var e, t, n = [];
                      for (e = 0; e < arguments.length; e++)
                          t = arguments[e],
                          n[e] = P.isZ(t) ? t.toArray() : t;
                      return s.apply(P.isZ(this) ? this.toArray() : this, n)
                  },
                  map: function(e) {
                      return n(n.map(this, (function(t, n) {
                          return e.call(t, n, t)
                      }
                      )))
                  },
                  slice: function() {
                      return n(l.apply(this, arguments))
                  },
                  ready: function(e) {
                      return _.test(u.readyState) && u.body ? e(n) : u.addEventListener("DOMContentLoaded", (function() {
                          e(n)
                      }
                      ), !1),
                      this
                  },
                  get: function(t) {
                      return t === e ? l.call(this) : this[t >= 0 ? t : t + this.length]
                  },
                  toArray: function() {
                      return this.get()
                  },
                  size: function() {
                      return this.length
                  },
                  remove: function() {
                      return this.each((function() {
                          null != this.parentNode && this.parentNode.removeChild(this)
                      }
                      ))
                  },
                  each: function(e) {
                      return a.every.call(this, (function(t, n) {
                          return !1 !== e.call(t, n, t)
                      }
                      )),
                      this
                  },
                  filter: function(e) {
                      return A(e) ? this.not(this.not(e)) : n(c.call(this, (function(t) {
                          return P.matches(t, e)
                      }
                      )))
                  },
                  add: function(e, t) {
                      return n(o(this.concat(n(e, t))))
                  },
                  is: function(e) {
                      return this.length > 0 && P.matches(this[0], e)
                  },
                  not: function(t) {
                      var r = [];
                      if (A(t) && t.call !== e)
                          this.each((function(e) {
                              t.call(this, e) || r.push(this)
                          }
                          ));
                      else {
                          var i = "string" == typeof t ? this.filter(t) : R(t) && A(t.item) ? l.call(t) : n(t);
                          this.forEach((function(e) {
                              i.indexOf(e) < 0 && r.push(e)
                          }
                          ))
                      }
                      return n(r)
                  },
                  has: function(e) {
                      return this.filter((function() {
                          return I(e) ? n.contains(this, e) : n(this).find(e).size()
                      }
                      ))
                  },
                  eq: function(e) {
                      return -1 === e ? this.slice(e) : this.slice(e, +e + 1)
                  },
                  first: function() {
                      var e = this[0];
                      return e && !I(e) ? e : n(e)
                  },
                  last: function() {
                      var e = this[this.length - 1];
                      return e && !I(e) ? e : n(e)
                  },
                  find: function(e) {
                      var t = this;
                      return e ? "object" == typeof e ? n(e).filter((function() {
                          var e = this;
                          return a.some.call(t, (function(t) {
                              return n.contains(t, e)
                          }
                          ))
                      }
                      )) : 1 == this.length ? n(P.qsa(this[0], e)) : this.map((function() {
                          return P.qsa(this, e)
                      }
                      )) : n()
                  },
                  closest: function(e, t) {
                      var r = []
                        , i = "object" == typeof e && n(e);
                      return this.each((function(n, o) {
                          for (; o && !(i ? i.indexOf(o) >= 0 : P.matches(o, e)); )
                              o = o !== t && !N(o) && o.parentNode;
                          o && r.indexOf(o) < 0 && r.push(o)
                      }
                      )),
                      n(r)
                  },
                  parents: function(e) {
                      for (var t = [], r = this; r.length > 0; )
                          r = n.map(r, (function(e) {
                              if ((e = e.parentNode) && !N(e) && t.indexOf(e) < 0)
                                  return t.push(e),
                                  e
                          }
                          ));
                      return z(t, e)
                  },
                  parent: function(e) {
                      return z(o(this.pluck("parentNode")), e)
                  },
                  children: function(e) {
                      return z(this.map((function() {
                          return F(this)
                      }
                      )), e)
                  },
                  contents: function() {
                      return this.map((function() {
                          return this.contentDocument || l.call(this.childNodes)
                      }
                      ))
                  },
                  siblings: function(e) {
                      return z(this.map((function(e, t) {
                          return c.call(F(t.parentNode), (function(e) {
                              return e !== t
                          }
                          ))
                      }
                      )), e)
                  },
                  empty: function() {
                      return this.each((function() {
                          this.innerHTML = ""
                      }
                      ))
                  },
                  pluck: function(e) {
                      return n.map(this, (function(t) {
                          return t[e]
                      }
                      ))
                  },
                  show: function() {
                      return this.each((function() {
                          var e, t, n;
                          "none" == this.style.display && (this.style.display = ""),
                          "none" == getComputedStyle(this, "").getPropertyValue("display") && (this.style.display = (e = this.nodeName,
                          h[e] || (t = u.createElement(e),
                          u.body.appendChild(t),
                          n = getComputedStyle(t, "").getPropertyValue("display"),
                          t.parentNode.removeChild(t),
                          "none" == n && (n = "block"),
                          h[e] = n),
                          h[e]))
                      }
                      ))
                  },
                  replaceWith: function(e) {
                      return this.before(e).remove()
                  },
                  wrap: function(e) {
                      var t = A(e);
                      if (this[0] && !t)
                          var r = n(e).get(0)
                            , i = r.parentNode || this.length > 1;
                      return this.each((function(o) {
                          n(this).wrapAll(t ? e.call(this, o) : i ? r.cloneNode(!0) : r)
                      }
                      ))
                  },
                  wrapAll: function(e) {
                      if (this[0]) {
                          var t;
                          for (n(this[0]).before(e = n(e)); (t = e.children()).length; )
                              e = t.first();
                          n(e).append(this)
                      }
                      return this
                  },
                  wrapInner: function(e) {
                      var t = A(e);
                      return this.each((function(r) {
                          var i = n(this)
                            , o = i.contents()
                            , a = t ? e.call(this, r) : e;
                          o.length ? o.wrapAll(a) : i.append(a)
                      }
                      ))
                  },
                  unwrap: function() {
                      return this.parent().each((function() {
                          n(this).replaceWith(n(this).children())
                      }
                      )),
                      this
                  },
                  clone: function() {
                      return this.map((function() {
                          return this.cloneNode(!0)
                      }
                      ))
                  },
                  hide: function() {
                      return this.css("display", "none")
                  },
                  toggle: function(t) {
                      return this.each((function() {
                          var r = n(this);
                          (t === e ? "none" == r.css("display") : t) ? r.show() : r.hide()
                      }
                      ))
                  },
                  prev: function(e) {
                      return n(this.pluck("previousElementSibling")).filter(e || "*")
                  },
                  next: function(e) {
                      return n(this.pluck("nextElementSibling")).filter(e || "*")
                  },
                  html: function(e) {
                      return 0 in arguments ? this.each((function(t) {
                          var r = this.innerHTML;
                          n(this).empty().append($(this, e, t, r))
                      }
                      )) : 0 in this ? this[0].innerHTML : null
                  },
                  text: function(e) {
                      return 0 in arguments ? this.each((function(t) {
                          var n = $(this, e, t, this.textContent);
                          this.textContent = null == n ? "" : "" + n
                      }
                      )) : 0 in this ? this.pluck("textContent").join("") : null
                  },
                  attr: function(n, r) {
                      var i;
                      return "string" != typeof n || 1 in arguments ? this.each((function(e) {
                          if (1 === this.nodeType)
                              if (I(n))
                                  for (t in n)
                                      W(this, t, n[t]);
                              else
                                  W(this, n, $(this, r, e, this.getAttribute(n)))
                      }
                      )) : 0 in this && 1 == this[0].nodeType && null != (i = this[0].getAttribute(n)) ? i : e
                  },
                  removeAttr: function(e) {
                      return this.each((function() {
                          1 === this.nodeType && e.split(" ").forEach((function(e) {
                              W(this, e)
                          }
                          ), this)
                      }
                      ))
                  },
                  prop: function(e, t) {
                      return e = G[e] || e,
                      1 in arguments ? this.each((function(n) {
                          this[e] = $(this, t, n, this[e])
                      }
                      )) : this[0] && this[0][e]
                  },
                  removeProp: function(e) {
                      return e = G[e] || e,
                      this.each((function() {
                          delete this[e]
                      }
                      ))
                  },
                  data: function(t, n) {
                      var r = "data-" + t.replace(v, "-$1").toLowerCase()
                        , i = 1 in arguments ? this.attr(r, n) : this.attr(r);
                      return null !== i ? V(i) : e
                  },
                  val: function(e) {
                      return 0 in arguments ? (null == e && (e = ""),
                      this.each((function(t) {
                          this.value = $(this, e, t, this.value)
                      }
                      ))) : this[0] && (this[0].multiple ? n(this[0]).find("option").filter((function() {
                          return this.selected
                      }
                      )).pluck("value") : this[0].value)
                  },
                  offset: function(e) {
                      if (e)
                          return this.each((function(t) {
                              var r = n(this)
                                , i = $(this, e, t, r.offset())
                                , o = r.offsetParent().offset()
                                , a = {
                                  top: i.top - o.top,
                                  left: i.left - o.left
                              };
                              "static" == r.css("position") && (a.position = "relative"),
                              r.css(a)
                          }
                          ));
                      if (!this.length)
                          return null;
                      if (u.documentElement !== this[0] && !n.contains(u.documentElement, this[0]))
                          return {
                              top: 0,
                              left: 0
                          };
                      var t = this[0].getBoundingClientRect();
                      return {
                          left: t.left + window.pageXOffset,
                          top: t.top + window.pageYOffset,
                          width: Math.round(t.width),
                          height: Math.round(t.height)
                      }
                  },
                  css: function(e, r) {
                      if (arguments.length < 2) {
                          var o = this[0];
                          if ("string" == typeof e) {
                              if (!o)
                                  return;
                              return o.style[i(e)] || getComputedStyle(o, "").getPropertyValue(e)
                          }
                          if (T(e)) {
                              if (!o)
                                  return;
                              var a = {}
                                , s = getComputedStyle(o, "");
                              return n.each(e, (function(e, t) {
                                  a[t] = o.style[i(t)] || s.getPropertyValue(t)
                              }
                              )),
                              a
                          }
                      }
                      var c = "";
                      if ("string" == D(e))
                          r || 0 === r ? c = M(e) + ":" + K(e, r) : this.each((function() {
                              this.style.removeProperty(M(e))
                          }
                          ));
                      else
                          for (t in e)
                              e[t] || 0 === e[t] ? c += M(t) + ":" + K(t, e[t]) + ";" : this.each((function() {
                                  this.style.removeProperty(M(t))
                              }
                              ));
                      return this.each((function() {
                          this.style.cssText += ";" + c
                      }
                      ))
                  },
                  index: function(e) {
                      return e ? this.indexOf(n(e)[0]) : this.parent().children().indexOf(this[0])
                  },
                  hasClass: function(e) {
                      return !!e && a.some.call(this, (function(e) {
                          return this.test(H(e))
                      }
                      ), B(e))
                  },
                  addClass: function(e) {
                      return e ? this.each((function(t) {
                          if ("className"in this) {
                              r = [];
                              var i = H(this);
                              $(this, e, t, i).split(/\s+/g).forEach((function(e) {
                                  n(this).hasClass(e) || r.push(e)
                              }
                              ), this),
                              r.length && H(this, i + (i ? " " : "") + r.join(" "))
                          }
                      }
                      )) : this
                  },
                  removeClass: function(t) {
                      return this.each((function(n) {
                          if ("className"in this) {
                              if (t === e)
                                  return H(this, "");
                              r = H(this),
                              $(this, t, n, r).split(/\s+/g).forEach((function(e) {
                                  r = r.replace(B(e), " ")
                              }
                              )),
                              H(this, r.trim())
                          }
                      }
                      ))
                  },
                  toggleClass: function(t, r) {
                      return t ? this.each((function(i) {
                          var o = n(this);
                          $(this, t, i, H(this)).split(/\s+/g).forEach((function(t) {
                              (r === e ? !o.hasClass(t) : r) ? o.addClass(t) : o.removeClass(t)
                          }
                          ))
                      }
                      )) : this
                  },
                  scrollTop: function(t) {
                      if (this.length) {
                          var n = "scrollTop"in this[0];
                          return t === e ? n ? this[0].scrollTop : this[0].pageYOffset : this.each(n ? function() {
                              this.scrollTop = t
                          }
                          : function() {
                              this.scrollTo(this.scrollX, t)
                          }
                          )
                      }
                  },
                  scrollLeft: function(t) {
                      if (this.length) {
                          var n = "scrollLeft"in this[0];
                          return t === e ? n ? this[0].scrollLeft : this[0].pageXOffset : this.each(n ? function() {
                              this.scrollLeft = t
                          }
                          : function() {
                              this.scrollTo(t, this.scrollY)
                          }
                          )
                      }
                  },
                  position: function() {
                      if (this.length) {
                          var e = this[0]
                            , t = this.offsetParent()
                            , r = this.offset()
                            , i = g.test(t[0].nodeName) ? {
                              top: 0,
                              left: 0
                          } : t.offset();
                          return r.top -= parseFloat(n(e).css("margin-top")) || 0,
                          r.left -= parseFloat(n(e).css("margin-left")) || 0,
                          i.top += parseFloat(n(t[0]).css("border-top-width")) || 0,
                          i.left += parseFloat(n(t[0]).css("border-left-width")) || 0,
                          {
                              top: r.top - i.top,
                              left: r.left - i.left
                          }
                      }
                  },
                  offsetParent: function() {
                      return this.map((function() {
                          for (var e = this.offsetParent || u.body; e && !g.test(e.nodeName) && "static" == n(e).css("position"); )
                              e = e.offsetParent;
                          return e
                      }
                      ))
                  }
              },
              n.fn.detach = n.fn.remove,
              ["width", "height"].forEach((function(t) {
                  var r = t.replace(/./, (function(e) {
                      return e[0].toUpperCase()
                  }
                  ));
                  n.fn[t] = function(i) {
                      var o, a = this[0];
                      return i === e ? C(a) ? a["inner" + r] : N(a) ? a.documentElement["scroll" + r] : (o = this.offset()) && o[t] : this.each((function(e) {
                          (a = n(this)).css(t, $(this, i, e, a[t]()))
                      }
                      ))
                  }
              }
              )),
              ["after", "prepend", "before", "append"].forEach((function(t, r) {
                  var i = r % 2;
                  n.fn[t] = function() {
                      var t, o, a = n.map(arguments, (function(r) {
                          var i = [];
                          return "array" == (t = D(r)) ? (r.forEach((function(t) {
                              return t.nodeType !== e ? i.push(t) : n.zepto.isZ(t) ? i = i.concat(t.get()) : void (i = i.concat(P.fragment(t)))
                          }
                          )),
                          i) : "object" == t || null == r ? r : P.fragment(r)
                      }
                      )), s = this.length > 1;
                      return a.length < 1 ? this : this.each((function(e, t) {
                          o = i ? t : t.parentNode,
                          t = 0 == r ? t.nextSibling : 1 == r ? t.firstChild : 2 == r ? t : null;
                          var c = n.contains(u.documentElement, o);
                          a.forEach((function(e) {
                              if (s)
                                  e = e.cloneNode(!0);
                              else if (!o)
                                  return n(e).remove();
                              o.insertBefore(e, t),
                              c && Y(e, (function(e) {
                                  if (!(null == e.nodeName || "SCRIPT" !== e.nodeName.toUpperCase() || e.type && "text/javascript" !== e.type || e.src)) {
                                      var t = e.ownerDocument ? e.ownerDocument.defaultView : window;
                                      t.eval.call(t, e.innerHTML)
                                  }
                              }
                              ))
                          }
                          ))
                      }
                      ))
                  }
                  ,
                  n.fn[i ? t + "To" : "insert" + (r ? "Before" : "After")] = function(e) {
                      return n(e)[t](this),
                      this
                  }
              }
              )),
              P.Z.prototype = q.prototype = n.fn,
              P.uniq = o,
              P.deserializeValue = V,
              n.zepto = P,
              n
          }();
          window.Zepto = i,
          setTimeout((()=>{}
          ), 1e3),
          window.$ = i,
          function(e) {
              var t, n = 1, r = Array.prototype.slice, i = e.isFunction, o = function(e) {
                  return "string" == typeof e
              }, a = {}, s = {}, c = "onfocusin"in window, l = {
                  focus: "focusin",
                  blur: "focusout"
              }, u = {
                  mouseenter: "mouseover",
                  mouseleave: "mouseout"
              };
              function h(e) {
                  return e._zid || (e._zid = n++)
              }
              function d(e, t, n, r) {
                  if ((t = f(t)).ns)
                      var i = (o = t.ns,
                      new RegExp("(?:^| )" + o.replace(" ", " .* ?") + "(?: |$)"));
                  var o;
                  return (a[h(e)] || []).filter((function(e) {
                      return e && (!t.e || e.e == t.e) && (!t.ns || i.test(e.ns)) && (!n || h(e.fn) === h(n)) && (!r || e.sel == r)
                  }
                  ))
              }
              function f(e) {
                  var t = ("" + e).split(".");
                  return {
                      e: t[0],
                      ns: t.slice(1).sort().join(" ")
                  }
              }
              function p(e, t) {
                  return e.del && !c && e.e in l || !!t
              }
              function m(e) {
                  return u[e] || c && l[e] || e
              }
              function y(n, r, i, o, s, c, l) {
                  var d = h(n)
                    , y = a[d] || (a[d] = []);
                  r.split(/\s/).forEach((function(r) {
                      if ("ready" == r)
                          return e(document).ready(i);
                      var o = f(r);
                      o.fn = i,
                      o.sel = s,
                      o.e in u && (i = function(t) {
                          var n = t.relatedTarget;
                          if (!n || n !== this && !e.contains(this, n))
                              return o.fn.apply(this, arguments)
                      }
                      ),
                      o.del = c;
                      var a = c || i;
                      o.proxy = function(e) {
                          if (!(e = O(e)).isImmediatePropagationStopped()) {
                              var r = a.apply(n, e._args == t ? [e] : [e].concat(e._args));
                              return !1 === r && (e.preventDefault(),
                              e.stopPropagation()),
                              r
                          }
                      }
                      ,
                      o.i = y.length,
                      y.push(o),
                      "addEventListener"in n && n.addEventListener(m(o.e), o.proxy, p(o, l))
                  }
                  ))
              }
              function g(e, t, n, r, i) {
                  var o = h(e);
                  (t || "").split(/\s/).forEach((function(t) {
                      d(e, t, n, r).forEach((function(t) {
                          delete a[o][t.i],
                          "removeEventListener"in e && e.removeEventListener(m(t.e), t.proxy, p(t, i))
                      }
                      ))
                  }
                  ))
              }
              s.click = s.mousedown = s.mouseup = s.mousemove = "MouseEvents",
              e.event = {
                  add: y,
                  remove: g
              },
              e.proxy = function(t, n) {
                  var a = 2 in arguments && r.call(arguments, 2);
                  if (i(t)) {
                      var s = function() {
                          return t.apply(n, a ? a.concat(r.call(arguments)) : arguments)
                      };
                      return s._zid = h(t),
                      s
                  }
                  if (o(n))
                      return a ? (a.unshift(t[n], t),
                      e.proxy.apply(null, a)) : e.proxy(t[n], t);
                  throw new TypeError("expected function")
              }
              ,
              e.fn.bind = function(e, t, n) {
                  return this.on(e, t, n)
              }
              ,
              e.fn.unbind = function(e, t) {
                  return this.off(e, t)
              }
              ,
              e.fn.one = function(e, t, n, r) {
                  return this.on(e, t, n, r, 1)
              }
              ;
              var v = function() {
                  return !0
              }
                , E = function() {
                  return !1
              }
                , b = /^([A-Z]|returnValue$|layer[XY]$|webkitMovement[XY]$)/
                , w = {
                  preventDefault: "isDefaultPrevented",
                  stopImmediatePropagation: "isImmediatePropagationStopped",
                  stopPropagation: "isPropagationStopped"
              };
              function O(n, r) {
                  return !r && n.isDefaultPrevented || (r || (r = n),
                  e.each(w, (function(e, t) {
                      var i = r[e];
                      n[e] = function() {
                          return this[t] = v,
                          i && i.apply(r, arguments)
                      }
                      ,
                      n[t] = E
                  }
                  )),
                  n.timeStamp || (n.timeStamp = Date.now()),
                  (r.defaultPrevented !== t ? r.defaultPrevented : "returnValue"in r ? !1 === r.returnValue : r.getPreventDefault && r.getPreventDefault()) && (n.isDefaultPrevented = v)),
                  n
              }
              function _(e) {
                  var n, r = {
                      originalEvent: e
                  };
                  for (n in e)
                      b.test(n) || e[n] === t || (r[n] = e[n]);
                  return O(r, e)
              }
              e.fn.delegate = function(e, t, n) {
                  return this.on(t, e, n)
              }
              ,
              e.fn.undelegate = function(e, t, n) {
                  return this.off(t, e, n)
              }
              ,
              e.fn.live = function(t, n) {
                  return e(document.body).delegate(this.selector, t, n),
                  this
              }
              ,
              e.fn.die = function(t, n) {
                  return e(document.body).undelegate(this.selector, t, n),
                  this
              }
              ,
              e.fn.on = function(n, a, s, c, l) {
                  var u, h, d = this;
                  return n && !o(n) ? (e.each(n, (function(e, t) {
                      d.on(e, a, s, t, l)
                  }
                  )),
                  d) : (o(a) || i(c) || !1 === c || (c = s,
                  s = a,
                  a = t),
                  c !== t && !1 !== s || (c = s,
                  s = t),
                  !1 === c && (c = E),
                  d.each((function(t, i) {
                      l && (u = function(e) {
                          return g(i, e.type, c),
                          c.apply(this, arguments)
                      }
                      ),
                      a && (h = function(t) {
                          var n, o = e(t.target).closest(a, i).get(0);
                          if (o && o !== i)
                              return n = e.extend(_(t), {
                                  currentTarget: o,
                                  liveFired: i
                              }),
                              (u || c).apply(o, [n].concat(r.call(arguments, 1)))
                      }
                      ),
                      y(i, n, c, 0, a, h || u)
                  }
                  )))
              }
              ,
              e.fn.off = function(n, r, a) {
                  var s = this;
                  return n && !o(n) ? (e.each(n, (function(e, t) {
                      s.off(e, r, t)
                  }
                  )),
                  s) : (o(r) || i(a) || !1 === a || (a = r,
                  r = t),
                  !1 === a && (a = E),
                  s.each((function() {
                      g(this, n, a, r)
                  }
                  )))
              }
              ,
              e.fn.trigger = function(t, n) {
                  return (t = o(t) || e.isPlainObject(t) ? e.Event(t) : O(t))._args = n,
                  this.each((function() {
                      t.type in l && "function" == typeof this[t.type] ? this[t.type]() : "dispatchEvent"in this ? this.dispatchEvent(t) : e(this).triggerHandler(t, n)
                  }
                  ))
              }
              ,
              e.fn.triggerHandler = function(t, n) {
                  var r, i;
                  return this.each((function(a, s) {
                      (r = _(o(t) ? e.Event(t) : t))._args = n,
                      r.target = s,
                      e.each(d(s, t.type || t), (function(e, t) {
                          if (i = t.proxy(r),
                          r.isImmediatePropagationStopped())
                              return !1
                      }
                      ))
                  }
                  )),
                  i
              }
              ,
              "focusin focusout focus blur load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select keydown keypress keyup error".split(" ").forEach((function(t) {
                  e.fn[t] = function(e) {
                      return 0 in arguments ? this.bind(t, e) : this.trigger(t)
                  }
              }
              )),
              e.Event = function(e, t) {
                  o(e) || (e = (t = e).type);
                  var n = document.createEvent(s[e] || "Events")
                    , r = !0;
                  if (t)
                      for (var i in t)
                          "bubbles" == i ? r = !!t[i] : n[i] = t[i];
                  return n.initEvent(e, r, !0),
                  O(n)
              }
          }(i),
          function(e) {
              var t, n, r = +new Date, i = window.document, o = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, a = /^(?:text|application)\/javascript/i, s = /^(?:text|application)\/xml/i, c = "application/json", l = "text/html", u = /^\s*$/, h = i.createElement("a");
              function d(t, n, r, o) {
                  if (t.global)
                      return function(t, n, r) {
                          var i = e.Event(n);
                          return e(t).trigger(i, r),
                          !i.isDefaultPrevented()
                      }(n || i, r, o)
              }
              function f(e, t) {
                  var n = t.context;
                  if (!1 === t.beforeSend.call(n, e, t) || !1 === d(t, n, "ajaxBeforeSend", [e, t]))
                      return !1;
                  d(t, n, "ajaxSend", [e, t])
              }
              function p(e, t, n, r) {
                  var i = n.context
                    , o = "success";
                  n.success.call(i, e, o, t),
                  r && r.resolveWith(i, [e, o, t]),
                  d(n, i, "ajaxSuccess", [t, n, e]),
                  y(o, t, n)
              }
              function m(e, t, n, r, i) {
                  var o = r.context;
                  r.error.call(o, n, t, e),
                  i && i.rejectWith(o, [n, t, e]),
                  d(r, o, "ajaxError", [n, r, e || t]),
                  y(t, n, r)
              }
              function y(t, n, r) {
                  var i = r.context;
                  r.complete.call(i, n, t),
                  d(r, i, "ajaxComplete", [n, r]),
                  function(t) {
                      t.global && !--e.active && d(t, null, "ajaxStop")
                  }(r)
              }
              function g() {}
              function v(e, t) {
                  return "" == t ? e : (e + "&" + t).replace(/[&?]{1,2}/, "?")
              }
              function E(t, n, r, i) {
                  return e.isFunction(n) && (i = r,
                  r = n,
                  n = void 0),
                  e.isFunction(r) || (i = r,
                  r = void 0),
                  {
                      url: t,
                      data: n,
                      success: r,
                      dataType: i
                  }
              }
              h.href = window.location.href,
              e.active = 0,
              e.ajaxJSONP = function(t, n) {
                  if (!("type"in t))
                      return e.ajax(t);
                  var o, a, s = t.jsonpCallback, c = (e.isFunction(s) ? s() : s) || "Zepto" + r++, l = i.createElement("script"), u = window[c], h = function(t) {
                      e(l).triggerHandler("error", t || "abort")
                  }, d = {
                      abort: h
                  };
                  return n && n.promise(d),
                  e(l).on("load error", (function(r, i) {
                      clearTimeout(a),
                      e(l).off().remove(),
                      "error" != r.type && o ? p(o[0], d, t, n) : m(null, i || "error", d, t, n),
                      window[c] = u,
                      o && e.isFunction(u) && u(o[0]),
                      u = o = void 0
                  }
                  )),
                  !1 === f(d, t) ? (h("abort"),
                  d) : (window[c] = function() {
                      o = arguments
                  }
                  ,
                  l.src = t.url.replace(/\?(.+)=\?/, "?$1=" + c),
                  i.head.appendChild(l),
                  t.timeout > 0 && (a = setTimeout((function() {
                      h("timeout")
                  }
                  ), t.timeout)),
                  d)
              }
              ,
              e.ajaxSettings = {
                  type: "GET",
                  beforeSend: g,
                  success: g,
                  error: g,
                  complete: g,
                  context: null,
                  global: !0,
                  xhr: function() {
                      return new window.XMLHttpRequest
                  },
                  accepts: {
                      script: "text/javascript, application/javascript, application/x-javascript",
                      json: c,
                      xml: "application/xml, text/xml",
                      html: l,
                      text: "text/plain"
                  },
                  crossDomain: !1,
                  timeout: 0,
                  processData: !0,
                  cache: !0,
                  dataFilter: g
              },
              e.ajax = function(r) {
                  var o, y, E = e.extend({}, r || {}), b = e.Deferred && e.Deferred();
                  for (t in e.ajaxSettings)
                      void 0 === E[t] && (E[t] = e.ajaxSettings[t]);
                  !function(t) {
                      t.global && 0 == e.active++ && d(t, null, "ajaxStart")
                  }(E),
                  E.crossDomain || ((o = i.createElement("a")).href = E.url,
                  o.href = o.href,
                  E.crossDomain = h.protocol + "//" + h.host != o.protocol + "//" + o.host),
                  E.url || (E.url = window.location.toString()),
                  (y = E.url.indexOf("#")) > -1 && (E.url = E.url.slice(0, y)),
                  function(t) {
                      t.processData && t.data && "string" != e.type(t.data) && (t.data = e.param(t.data, t.traditional)),
                      !t.data || t.type && "GET" != t.type.toUpperCase() && "jsonp" != t.dataType || (t.url = v(t.url, t.data),
                      t.data = void 0)
                  }(E);
                  var w = E.dataType
                    , O = /\?.+=\?/.test(E.url);
                  if (O && (w = "jsonp"),
                  !1 !== E.cache && (r && !0 === r.cache || "script" != w && "jsonp" != w) || (E.url = v(E.url, "_=" + Date.now())),
                  "jsonp" == w)
                      return O || (E.url = v(E.url, E.jsonp ? E.jsonp + "=?" : !1 === E.jsonp ? "" : "callback=?")),
                      e.ajaxJSONP(E, b);
                  var _, x = E.accepts[w], S = {}, L = function(e, t) {
                      S[e.toLowerCase()] = [e, t]
                  }, P = /^([\w-]+:)\/\//.test(E.url) ? RegExp.$1 : window.location.protocol, k = E.xhr(), G = k.setRequestHeader;
                  if (b && b.promise(k),
                  E.crossDomain || L("X-Requested-With", "XMLHttpRequest"),
                  L("Accept", x || "*/*"),
                  (x = E.mimeType || x) && (x.indexOf(",") > -1 && (x = x.split(",", 2)[0]),
                  k.overrideMimeType && k.overrideMimeType(x)),
                  (E.contentType || !1 !== E.contentType && E.data && "GET" != E.type.toUpperCase()) && L("Content-Type", E.contentType || "application/x-www-form-urlencoded"),
                  E.headers)
                      for (n in E.headers)
                          L(n, E.headers[n]);
                  if (k.setRequestHeader = L,
                  k.onreadystatechange = function() {
                      if (4 == k.readyState) {
                          k.onreadystatechange = g,
                          clearTimeout(_);
                          var t, n = !1;
                          if (k.status >= 200 && k.status < 300 || 304 == k.status || 0 == k.status && "file:" == P) {
                              if (w = w || function(e) {
                                  return e && (e = e.split(";", 2)[0]),
                                  e && (e == l ? "html" : e == c ? "json" : a.test(e) ? "script" : s.test(e) && "xml") || "text"
                              }(E.mimeType || k.getResponseHeader("content-type")),
                              "arraybuffer" == k.responseType || "blob" == k.responseType)
                                  t = k.response;
                              else {
                                  t = k.responseText;
                                  try {
                                      t = function(e, t, n) {
                                          if (n.dataFilter == g)
                                              return e;
                                          var r = n.context;
                                          return n.dataFilter.call(r, e, t)
                                      }(t, w, E),
                                      "script" == w ? (0,
                                      eval)(t) : "xml" == w ? t = k.responseXML : "json" == w && (t = u.test(t) ? null : e.parseJSON(t))
                                  } catch (e) {
                                      n = e
                                  }
                                  if (n)
                                      return m(n, "parsererror", k, E, b)
                              }
                              p(t, k, E, b)
                          } else
                              m(k.statusText || null, k.status ? "error" : "abort", k, E, b)
                      }
                  }
                  ,
                  !1 === f(k, E))
                      return k.abort(),
                      m(null, "abort", k, E, b),
                      k;
                  var T = !("async"in E) || E.async;
                  if (k.open(E.type, E.url, T, E.username, E.password),
                  E.xhrFields)
                      for (n in E.xhrFields)
                          k[n] = E.xhrFields[n];
                  for (n in S)
                      G.apply(k, S[n]);
                  return E.timeout > 0 && (_ = setTimeout((function() {
                      k.onreadystatechange = g,
                      k.abort(),
                      m(null, "timeout", k, E, b)
                  }
                  ), E.timeout)),
                  k.send(E.data ? E.data : null),
                  k
              }
              ,
              e.get = function() {
                  return e.ajax(E.apply(null, arguments))
              }
              ,
              e.post = function() {
                  var t = E.apply(null, arguments);
                  return t.type = "POST",
                  e.ajax(t)
              }
              ,
              e.getJSON = function() {
                  var t = E.apply(null, arguments);
                  return t.dataType = "json",
                  e.ajax(t)
              }
              ,
              e.fn.load = function(t, n, r) {
                  if (!this.length)
                      return this;
                  var i, a = this, s = t.split(/\s/), c = E(t, n, r), l = c.success;
                  return s.length > 1 && (c.url = s[0],
                  i = s[1]),
                  c.success = function(t) {
                      a.html(i ? e("<div>").html(t.replace(o, "")).find(i) : t),
                      l && l.apply(a, arguments)
                  }
                  ,
                  e.ajax(c),
                  this
              }
              ;
              var b = encodeURIComponent;
              function w(t, n, r, i) {
                  var o, a = e.isArray(n), s = e.isPlainObject(n);
                  e.each(n, (function(n, c) {
                      o = e.type(c),
                      i && (n = r ? i : i + "[" + (s || "object" == o || "array" == o ? n : "") + "]"),
                      !i && a ? t.add(c.name, c.value) : "array" == o || !r && "object" == o ? w(t, c, r, n) : t.add(n, c)
                  }
                  ))
              }
              e.param = function(t, n) {
                  var r = [];
                  return r.add = function(t, n) {
                      e.isFunction(n) && (n = n()),
                      null == n && (n = ""),
                      this.push(b(t) + "=" + b(n))
                  }
                  ,
                  w(r, t, n),
                  r.join("&").replace(/%20/g, "+")
              }
          }(i),
          function(e) {
              e.fn.serializeArray = function() {
                  var t, n, r = [], i = function(e) {
                      if (e.forEach)
                          return e.forEach(i);
                      r.push({
                          name: t,
                          value: e
                      })
                  };
                  return this[0] && e.each(this[0].elements, (function(r, o) {
                      n = o.type,
                      (t = o.name) && "fieldset" != o.nodeName.toLowerCase() && !o.disabled && "submit" != n && "reset" != n && "button" != n && "file" != n && ("radio" != n && "checkbox" != n || o.checked) && i(e(o).val())
                  }
                  )),
                  r
              }
              ,
              e.fn.serialize = function() {
                  var e = [];
                  return this.serializeArray().forEach((function(t) {
                      e.push(encodeURIComponent(t.name) + "=" + encodeURIComponent(t.value))
                  }
                  )),
                  e.join("&")
              }
              ,
              e.fn.submit = function(t) {
                  if (0 in arguments)
                      this.bind("submit", t);
                  else if (this.length) {
                      var n = e.Event("submit");
                      this.eq(0).trigger(n),
                      n.isDefaultPrevented() || this.get(0).submit()
                  }
                  return this
              }
          }(i),
          function() {
              try {
                  getComputedStyle(void 0)
              } catch (t) {
                  var e = getComputedStyle;
                  window.getComputedStyle = function(t, n) {
                      try {
                          return e(t, n)
                      } catch (e) {
                          return null
                      }
                  }
              }
          }();
          const o = $;
          var a;
          !function(e) {
              e.GOOGLE = "google",
              e.GOOGLE2 = "google2",
              e.GOOGLE3 = "google3",
              e.DEEPL = "deepl",
              e.DEEPL2 = "deepl2"
          }(a || (a = {}));
          const s = [{
              value: a.GOOGLE,
              label: "谷歌海外",
              url: "https://translate.google.com/translate_a/single"
          }, {
              value: a.GOOGLE2,
              label: "谷歌香港",
              url: "https://translate.google.com.hk/translate_a/single"
          }, {
              value: a.GOOGLE3,
              label: "谷歌新加坡",
              url: "https://translate.google.com.sg/translate_a/single"
          }, {
              value: a.DEEPL2,
              label: "DeepL海外",
              url: "https://deepl.hwch.in/deepl_api"
          }, {
              value: a.DEEPL,
              label: "DeepL香港",
              url: "https://deeplhk.hwch.in/deepl_api"
          }]
            , c = {
              [a.GOOGLE]: a.GOOGLE,
              [a.GOOGLE2]: a.GOOGLE,
              [a.GOOGLE3]: a.GOOGLE,
              [a.DEEPL]: a.DEEPL,
              [a.DEEPL2]: a.DEEPL
          }
            , l = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : "undefined" != typeof window ? window : global
            , u = Object.keys
            , h = Array.isArray;
          function d(e, t) {
              return "object" != typeof t || u(t).forEach((function(n) {
                  e[n] = t[n]
              }
              )),
              e
          }
          "undefined" == typeof Promise || l.Promise || (l.Promise = Promise);
          const f = Object.getPrototypeOf
            , p = {}.hasOwnProperty;
          function m(e, t) {
              return p.call(e, t)
          }
          function y(e, t) {
              "function" == typeof t && (t = t(f(e))),
              ("undefined" == typeof Reflect ? u : Reflect.ownKeys)(t).forEach((n=>{
                  v(e, n, t[n])
              }
              ))
          }
          const g = Object.defineProperty;
          function v(e, t, n, r) {
              g(e, t, d(n && m(n, "get") && "function" == typeof n.get ? {
                  get: n.get,
                  set: n.set,
                  configurable: !0
              } : {
                  value: n,
                  configurable: !0,
                  writable: !0
              }, r))
          }
          function E(e) {
              return {
                  from: function(t) {
                      return e.prototype = Object.create(t.prototype),
                      v(e.prototype, "constructor", e),
                      {
                          extend: y.bind(null, e.prototype)
                      }
                  }
              }
          }
          const b = Object.getOwnPropertyDescriptor;
          function w(e, t) {
              let n;
              return b(e, t) || (n = f(e)) && w(n, t)
          }
          const O = [].slice;
          function _(e, t, n) {
              return O.call(e, t, n)
          }
          function x(e, t) {
              return t(e)
          }
          function S(e) {
              if (!e)
                  throw new Error("Assertion Failed")
          }
          function L(e) {
              l.setImmediate ? setImmediate(e) : setTimeout(e, 0)
          }
          function P(e, t) {
              return e.reduce(((e,n,r)=>{
                  var i = t(n, r);
                  return i && (e[i[0]] = i[1]),
                  e
              }
              ), {})
          }
          function k(e, t) {
              if (m(e, t))
                  return e[t];
              if (!t)
                  return e;
              if ("string" != typeof t) {
                  for (var n = [], r = 0, i = t.length; r < i; ++r) {
                      var o = k(e, t[r]);
                      n.push(o)
                  }
                  return n
              }
              var a = t.indexOf(".");
              if (-1 !== a) {
                  var s = e[t.substr(0, a)];
                  return void 0 === s ? void 0 : k(s, t.substr(a + 1))
              }
          }
          function G(e, t, n) {
              if (e && void 0 !== t && (!("isFrozen"in Object) || !Object.isFrozen(e)))
                  if ("string" != typeof t && "length"in t) {
                      S("string" != typeof n && "length"in n);
                      for (var r = 0, i = t.length; r < i; ++r)
                          G(e, t[r], n[r])
                  } else {
                      var o = t.indexOf(".");
                      if (-1 !== o) {
                          var a = t.substr(0, o)
                            , s = t.substr(o + 1);
                          if ("" === s)
                              void 0 === n ? h(e) && !isNaN(parseInt(a)) ? e.splice(a, 1) : delete e[a] : e[a] = n;
                          else {
                              var c = e[a];
                              c && m(e, a) || (c = e[a] = {}),
                              G(c, s, n)
                          }
                      } else
                          void 0 === n ? h(e) && !isNaN(parseInt(t)) ? e.splice(t, 1) : delete e[t] : e[t] = n
                  }
          }
          function T(e) {
              var t = {};
              for (var n in e)
                  m(e, n) && (t[n] = e[n]);
              return t
          }
          const D = [].concat;
          function A(e) {
              return D.apply([], e)
          }
          const C = "Boolean,String,Date,RegExp,Blob,File,FileList,FileSystemFileHandle,ArrayBuffer,DataView,Uint8ClampedArray,ImageBitmap,ImageData,Map,Set,CryptoKey".split(",").concat(A([8, 16, 32, 64].map((e=>["Int", "Uint", "Float"].map((t=>t + e + "Array")))))).filter((e=>l[e]))
            , N = C.map((e=>l[e]));
          P(C, (e=>[e, !0]));
          let I = null;
          function j(e) {
              I = "undefined" != typeof WeakMap && new WeakMap;
              const t = R(e);
              return I = null,
              t
          }
          function R(e) {
              if (!e || "object" != typeof e)
                  return e;
              let t = I && I.get(e);
              if (t)
                  return t;
              if (h(e)) {
                  t = [],
                  I && I.set(e, t);
                  for (var n = 0, r = e.length; n < r; ++n)
                      t.push(R(e[n]))
              } else if (N.indexOf(e.constructor) >= 0)
                  t = e;
              else {
                  const n = f(e);
                  for (var i in t = n === Object.prototype ? {} : Object.create(n),
                  I && I.set(e, t),
                  e)
                      m(e, i) && (t[i] = R(e[i]))
              }
              return t
          }
          const {toString: M} = {};
          function B(e) {
              return M.call(e).slice(8, -1)
          }
          const K = "undefined" != typeof Symbol ? Symbol.iterator : "@@iterator"
            , F = "symbol" == typeof K ? function(e) {
              var t;
              return null != e && (t = e[K]) && t.apply(e)
          }
          : function() {
              return null
          }
            , q = {};
          function U(e) {
              var t, n, r, i;
              if (1 === arguments.length) {
                  if (h(e))
                      return e.slice();
                  if (this === q && "string" == typeof e)
                      return [e];
                  if (i = F(e)) {
                      for (n = []; !(r = i.next()).done; )
                          n.push(r.value);
                      return n
                  }
                  if (null == e)
                      return [e];
                  if ("number" == typeof (t = e.length)) {
                      for (n = new Array(t); t--; )
                          n[t] = e[t];
                      return n
                  }
                  return [e]
              }
              for (t = arguments.length,
              n = new Array(t); t--; )
                  n[t] = arguments[t];
              return n
          }
          const z = "undefined" != typeof Symbol ? e=>"AsyncFunction" === e[Symbol.toStringTag] : ()=>!1;
          var W = "undefined" != typeof location && /^(http|https):\/\/(localhost|127\.0\.0\.1)/.test(location.href);
          function H(e, t) {
              W = e,
              V = t
          }
          var V = ()=>!0;
          const Y = !new Error("").stack;
          function X() {
              if (Y)
                  try {
                      throw X.arguments,
                      new Error
                  } catch (e) {
                      return e
                  }
              return new Error
          }
          function Z(e, t) {
              var n = e.stack;
              return n ? (t = t || 0,
              0 === n.indexOf(e.name) && (t += (e.name + e.message).split("\n").length),
              n.split("\n").slice(t).filter(V).map((e=>"\n" + e)).join("")) : ""
          }
          var Q = ["Unknown", "Constraint", "Data", "TransactionInactive", "ReadOnly", "Version", "NotFound", "InvalidState", "InvalidAccess", "Abort", "Timeout", "QuotaExceeded", "Syntax", "DataClone"]
            , J = ["Modify", "Bulk", "OpenFailed", "VersionChange", "Schema", "Upgrade", "InvalidTable", "MissingAPI", "NoSuchDatabase", "InvalidArgument", "SubTransaction", "Unsupported", "Internal", "DatabaseClosed", "PrematureCommit", "ForeignAwait"].concat(Q)
            , ee = {
              VersionChanged: "Database version changed by other database connection",
              DatabaseClosed: "Database has been closed",
              Abort: "Transaction aborted",
              TransactionInactive: "Transaction has already completed or failed",
              MissingAPI: "IndexedDB API missing. Please visit https://tinyurl.com/y2uuvskb"
          };
          function te(e, t) {
              this._e = X(),
              this.name = e,
              this.message = t
          }
          function ne(e, t) {
              return e + ". Errors: " + Object.keys(t).map((e=>t[e].toString())).filter(((e,t,n)=>n.indexOf(e) === t)).join("\n")
          }
          function re(e, t, n, r) {
              this._e = X(),
              this.failures = t,
              this.failedKeys = r,
              this.successCount = n,
              this.message = ne(e, t)
          }
          function ie(e, t) {
              this._e = X(),
              this.name = "BulkError",
              this.failures = Object.keys(t).map((e=>t[e])),
              this.failuresByPos = t,
              this.message = ne(e, t)
          }
          E(te).from(Error).extend({
              stack: {
                  get: function() {
                      return this._stack || (this._stack = this.name + ": " + this.message + Z(this._e, 2))
                  }
              },
              toString: function() {
                  return this.name + ": " + this.message
              }
          }),
          E(re).from(te),
          E(ie).from(te);
          var oe = J.reduce(((e,t)=>(e[t] = t + "Error",
          e)), {});
          const ae = te;
          var se = J.reduce(((e,t)=>{
              var n = t + "Error";
              function r(e, r) {
                  this._e = X(),
                  this.name = n,
                  e ? "string" == typeof e ? (this.message = `${e}${r ? "\n " + r : ""}`,
                  this.inner = r || null) : "object" == typeof e && (this.message = `${e.name} ${e.message}`,
                  this.inner = e) : (this.message = ee[t] || n,
                  this.inner = null)
              }
              return E(r).from(ae),
              e[t] = r,
              e
          }
          ), {});
          se.Syntax = SyntaxError,
          se.Type = TypeError,
          se.Range = RangeError;
          var ce = Q.reduce(((e,t)=>(e[t + "Error"] = se[t],
          e)), {})
            , le = J.reduce(((e,t)=>(-1 === ["Syntax", "Type", "Range"].indexOf(t) && (e[t + "Error"] = se[t]),
          e)), {});
          function ue() {}
          function he(e) {
              return e
          }
          function de(e, t) {
              return null == e || e === he ? t : function(n) {
                  return t(e(n))
              }
          }
          function fe(e, t) {
              return function() {
                  e.apply(this, arguments),
                  t.apply(this, arguments)
              }
          }
          function pe(e, t) {
              return e === ue ? t : function() {
                  var n = e.apply(this, arguments);
                  void 0 !== n && (arguments[0] = n);
                  var r = this.onsuccess
                    , i = this.onerror;
                  this.onsuccess = null,
                  this.onerror = null;
                  var o = t.apply(this, arguments);
                  return r && (this.onsuccess = this.onsuccess ? fe(r, this.onsuccess) : r),
                  i && (this.onerror = this.onerror ? fe(i, this.onerror) : i),
                  void 0 !== o ? o : n
              }
          }
          function me(e, t) {
              return e === ue ? t : function() {
                  e.apply(this, arguments);
                  var n = this.onsuccess
                    , r = this.onerror;
                  this.onsuccess = this.onerror = null,
                  t.apply(this, arguments),
                  n && (this.onsuccess = this.onsuccess ? fe(n, this.onsuccess) : n),
                  r && (this.onerror = this.onerror ? fe(r, this.onerror) : r)
              }
          }
          function ye(e, t) {
              return e === ue ? t : function(n) {
                  var r = e.apply(this, arguments);
                  d(n, r);
                  var i = this.onsuccess
                    , o = this.onerror;
                  this.onsuccess = null,
                  this.onerror = null;
                  var a = t.apply(this, arguments);
                  return i && (this.onsuccess = this.onsuccess ? fe(i, this.onsuccess) : i),
                  o && (this.onerror = this.onerror ? fe(o, this.onerror) : o),
                  void 0 === r ? void 0 === a ? void 0 : a : d(r, a)
              }
          }
          function ge(e, t) {
              return e === ue ? t : function() {
                  return !1 !== t.apply(this, arguments) && e.apply(this, arguments)
              }
          }
          function ve(e, t) {
              return e === ue ? t : function() {
                  var n = e.apply(this, arguments);
                  if (n && "function" == typeof n.then) {
                      for (var r = this, i = arguments.length, o = new Array(i); i--; )
                          o[i] = arguments[i];
                      return n.then((function() {
                          return t.apply(r, o)
                      }
                      ))
                  }
                  return t.apply(this, arguments)
              }
          }
          le.ModifyError = re,
          le.DexieError = te,
          le.BulkError = ie;
          var Ee = {};
          const [be,we,Oe] = "undefined" == typeof Promise ? [] : (()=>{
              let e = Promise.resolve();
              if ("undefined" == typeof crypto || !crypto.subtle)
                  return [e, f(e), e];
              const t = crypto.subtle.digest("SHA-512", new Uint8Array([0]));
              return [t, f(t), e]
          }
          )()
            , _e = we && we.then
            , xe = be && be.constructor
            , Se = !!Oe;
          var Le = !1
            , Pe = Oe ? ()=>{
              Oe.then(Xe)
          }
          : l.setImmediate ? setImmediate.bind(null, Xe) : l.MutationObserver ? ()=>{
              var e = document.createElement("div");
              new MutationObserver((()=>{
                  Xe(),
                  e = null
              }
              )).observe(e, {
                  attributes: !0
              }),
              e.setAttribute("i", "1")
          }
          : ()=>{
              setTimeout(Xe, 0)
          }
            , ke = function(e, t) {
              Re.push([e, t]),
              Te && (Pe(),
              Te = !1)
          }
            , Ge = !0
            , Te = !0
            , De = []
            , Ae = []
            , Ce = null
            , Ne = he
            , Ie = {
              id: "global",
              global: !0,
              ref: 0,
              unhandleds: [],
              onunhandled: bt,
              pgp: !1,
              env: {},
              finalize: function() {
                  this.unhandleds.forEach((e=>{
                      try {
                          bt(e[0], e[1])
                      } catch (e) {}
                  }
                  ))
              }
          }
            , je = Ie
            , Re = []
            , Me = 0
            , Be = [];
          function Ke(e) {
              if ("object" != typeof this)
                  throw new TypeError("Promises must be constructed via new");
              this._listeners = [],
              this.onuncatched = ue,
              this._lib = !1;
              var t = this._PSD = je;
              if (W && (this._stackHolder = X(),
              this._prev = null,
              this._numPrev = 0),
              "function" != typeof e) {
                  if (e !== Ee)
                      throw new TypeError("Not a function");
                  return this._state = arguments[1],
                  this._value = arguments[2],
                  void (!1 === this._state && ze(this, this._value))
              }
              this._state = null,
              this._value = null,
              ++t.ref,
              Ue(this, e)
          }
          const Fe = {
              get: function() {
                  var e = je
                    , t = at;
                  function n(n, r) {
                      var i = !e.global && (e !== je || t !== at);
                      const o = i && !ut();
                      var a = new Ke(((t,a)=>{
                          We(this, new qe(vt(n, e, i, o),vt(r, e, i, o),t,a,e))
                      }
                      ));
                      return W && Ye(a, this),
                      a
                  }
                  return n.prototype = Ee,
                  n
              },
              set: function(e) {
                  v(this, "then", e && e.prototype === Ee ? Fe : {
                      get: function() {
                          return e
                      },
                      set: Fe.set
                  })
              }
          };
          function qe(e, t, n, r, i) {
              this.onFulfilled = "function" == typeof e ? e : null,
              this.onRejected = "function" == typeof t ? t : null,
              this.resolve = n,
              this.reject = r,
              this.psd = i
          }
          function Ue(e, t) {
              try {
                  t((t=>{
                      if (null === e._state) {
                          if (t === e)
                              throw new TypeError("A promise cannot be resolved with itself.");
                          var n = e._lib && Ze();
                          t && "function" == typeof t.then ? Ue(e, ((e,n)=>{
                              t instanceof Ke ? t._then(e, n) : t.then(e, n)
                          }
                          )) : (e._state = !0,
                          e._value = t,
                          $e(e)),
                          n && Qe()
                      }
                  }
                  ), ze.bind(null, e))
              } catch (t) {
                  ze(e, t)
              }
          }
          function ze(e, t) {
              if (Ae.push(t),
              null === e._state) {
                  var n = e._lib && Ze();
                  t = Ne(t),
                  e._state = !1,
                  e._value = t,
                  W && null !== t && "object" == typeof t && !t._promise && function(e, t, n) {
                      try {
                          e.apply(null, void 0)
                      } catch (e) {}
                  }((()=>{
                      var n = w(t, "stack");
                      t._promise = e,
                      v(t, "stack", {
                          get: ()=>Le ? n && (n.get ? n.get.apply(t) : n.value) : e.stack
                      })
                  }
                  )),
                  function(e) {
                      De.some((t=>t._value === e._value)) || De.push(e)
                  }(e),
                  $e(e),
                  n && Qe()
              }
          }
          function $e(e) {
              var t = e._listeners;
              e._listeners = [];
              for (var n = 0, r = t.length; n < r; ++n)
                  We(e, t[n]);
              var i = e._PSD;
              --i.ref || i.finalize(),
              0 === Me && (++Me,
              ke((()=>{
                  0 == --Me && Je()
              }
              ), []))
          }
          function We(e, t) {
              if (null !== e._state) {
                  var n = e._state ? t.onFulfilled : t.onRejected;
                  if (null === n)
                      return (e._state ? t.resolve : t.reject)(e._value);
                  ++t.psd.ref,
                  ++Me,
                  ke(He, [n, e, t])
              } else
                  e._listeners.push(t)
          }
          function He(e, t, n) {
              try {
                  Ce = t;
                  var r, i = t._value;
                  t._state ? r = e(i) : (Ae.length && (Ae = []),
                  r = e(i),
                  -1 === Ae.indexOf(i) && function(e) {
                      for (var t = De.length; t; )
                          if (De[--t]._value === e._value)
                              return void De.splice(t, 1)
                  }(t)),
                  n.resolve(r)
              } catch (e) {
                  n.reject(e)
              } finally {
                  Ce = null,
                  0 == --Me && Je(),
                  --n.psd.ref || n.psd.finalize()
              }
          }
          function Ve(e, t, n) {
              if (t.length === n)
                  return t;
              var r = "";
              if (!1 === e._state) {
                  var i, o, a = e._value;
                  null != a ? (i = a.name || "Error",
                  o = a.message || a,
                  r = Z(a, 0)) : (i = a,
                  o = ""),
                  t.push(i + (o ? ": " + o : "") + r)
              }
              return W && ((r = Z(e._stackHolder, 2)) && -1 === t.indexOf(r) && t.push(r),
              e._prev && Ve(e._prev, t, n)),
              t
          }
          function Ye(e, t) {
              var n = t ? t._numPrev + 1 : 0;
              n < 100 && (e._prev = t,
              e._numPrev = n)
          }
          function Xe() {
              Ze() && Qe()
          }
          function Ze() {
              var e = Ge;
              return Ge = !1,
              Te = !1,
              e
          }
          function Qe() {
              var e, t, n;
              do {
                  for (; Re.length > 0; )
                      for (e = Re,
                      Re = [],
                      n = e.length,
                      t = 0; t < n; ++t) {
                          var r = e[t];
                          r[0].apply(null, r[1])
                      }
              } while (Re.length > 0);
              Ge = !0,
              Te = !0
          }
          function Je() {
              var e = De;
              De = [],
              e.forEach((e=>{
                  e._PSD.onunhandled.call(null, e._value, e)
              }
              ));
              for (var t = Be.slice(0), n = t.length; n; )
                  t[--n]()
          }
          function et(e) {
              return new Ke(Ee,!1,e)
          }
          function tt(e, t) {
              var n = je;
              return function() {
                  var r = Ze()
                    , i = je;
                  try {
                      return pt(n, !0),
                      e.apply(this, arguments)
                  } catch (e) {
                      t && t(e)
                  } finally {
                      pt(i, !1),
                      r && Qe()
                  }
              }
          }
          y(Ke.prototype, {
              then: Fe,
              _then: function(e, t) {
                  We(this, new qe(null,null,e,t,je))
              },
              catch: function(e) {
                  if (1 === arguments.length)
                      return this.then(null, e);
                  var t = arguments[0]
                    , n = arguments[1];
                  return "function" == typeof t ? this.then(null, (e=>e instanceof t ? n(e) : et(e))) : this.then(null, (e=>e && e.name === t ? n(e) : et(e)))
              },
              finally: function(e) {
                  return this.then((t=>(e(),
                  t)), (t=>(e(),
                  et(t))))
              },
              stack: {
                  get: function() {
                      if (this._stack)
                          return this._stack;
                      try {
                          Le = !0;
                          var e = Ve(this, [], 20).join("\nFrom previous: ");
                          return null !== this._state && (this._stack = e),
                          e
                      } finally {
                          Le = !1
                      }
                  }
              },
              timeout: function(e, t) {
                  return e < 1 / 0 ? new Ke(((n,r)=>{
                      var i = setTimeout((()=>r(new se.Timeout(t))), e);
                      this.then(n, r).finally(clearTimeout.bind(null, i))
                  }
                  )) : this
              }
          }),
          "undefined" != typeof Symbol && Symbol.toStringTag && v(Ke.prototype, Symbol.toStringTag, "Dexie.Promise"),
          Ie.env = mt(),
          y(Ke, {
              all: function() {
                  var e = U.apply(null, arguments).map(ht);
                  return new Ke((function(t, n) {
                      0 === e.length && t([]);
                      var r = e.length;
                      e.forEach(((i,o)=>Ke.resolve(i).then((n=>{
                          e[o] = n,
                          --r || t(e)
                      }
                      ), n)))
                  }
                  ))
              },
              resolve: e=>{
                  if (e instanceof Ke)
                      return e;
                  if (e && "function" == typeof e.then)
                      return new Ke(((t,n)=>{
                          e.then(t, n)
                      }
                      ));
                  var t = new Ke(Ee,!0,e);
                  return Ye(t, Ce),
                  t
              }
              ,
              reject: et,
              race: function() {
                  var e = U.apply(null, arguments).map(ht);
                  return new Ke(((t,n)=>{
                      e.map((e=>Ke.resolve(e).then(t, n)))
                  }
                  ))
              },
              PSD: {
                  get: ()=>je,
                  set: e=>je = e
              },
              totalEchoes: {
                  get: ()=>at
              },
              newPSD: ct,
              usePSD: yt,
              scheduler: {
                  get: ()=>ke,
                  set: e=>{
                      ke = e
                  }
              },
              rejectionMapper: {
                  get: ()=>Ne,
                  set: e=>{
                      Ne = e
                  }
              },
              follow: (e,t)=>new Ke(((n,r)=>ct(((t,n)=>{
                  var r = je;
                  r.unhandleds = [],
                  r.onunhandled = n,
                  r.finalize = fe((function() {
                      !function(e) {
                          Be.push((function t() {
                              e(),
                              Be.splice(Be.indexOf(t), 1)
                          }
                          )),
                          ++Me,
                          ke((()=>{
                              0 == --Me && Je()
                          }
                          ), [])
                      }((()=>{
                          0 === this.unhandleds.length ? t() : n(this.unhandleds[0])
                      }
                      ))
                  }
                  ), r.finalize),
                  e()
              }
              ), t, n, r)))
          }),
          xe && (xe.allSettled && v(Ke, "allSettled", (function() {
              const e = U.apply(null, arguments).map(ht);
              return new Ke((t=>{
                  0 === e.length && t([]);
                  let n = e.length;
                  const r = new Array(n);
                  e.forEach(((e,i)=>Ke.resolve(e).then((e=>r[i] = {
                      status: "fulfilled",
                      value: e
                  }), (e=>r[i] = {
                      status: "rejected",
                      reason: e
                  })).then((()=>--n || t(r)))))
              }
              ))
          }
          )),
          xe.any && "undefined" != typeof AggregateError && v(Ke, "any", (function() {
              const e = U.apply(null, arguments).map(ht);
              return new Ke(((t,n)=>{
                  0 === e.length && n(new AggregateError([]));
                  let r = e.length;
                  const i = new Array(r);
                  e.forEach(((e,o)=>Ke.resolve(e).then((e=>t(e)), (e=>{
                      i[o] = e,
                      --r || n(new AggregateError(i))
                  }
                  ))))
              }
              ))
          }
          )));
          const nt = {
              awaits: 0,
              echoes: 0,
              id: 0
          };
          var rt = 0
            , it = []
            , ot = 0
            , at = 0
            , st = 0;
          function ct(e, t, n, r) {
              var i = je
                , o = Object.create(i);
              o.parent = i,
              o.ref = 0,
              o.global = !1,
              o.id = ++st;
              var a = Ie.env;
              o.env = Se ? {
                  Promise: Ke,
                  PromiseProp: {
                      value: Ke,
                      configurable: !0,
                      writable: !0
                  },
                  all: Ke.all,
                  race: Ke.race,
                  allSettled: Ke.allSettled,
                  any: Ke.any,
                  resolve: Ke.resolve,
                  reject: Ke.reject,
                  nthen: Et(a.nthen, o),
                  gthen: Et(a.gthen, o)
              } : {},
              t && d(o, t),
              ++i.ref,
              o.finalize = function() {
                  --this.parent.ref || this.parent.finalize()
              }
              ;
              var s = yt(o, e, n, r);
              return 0 === o.ref && o.finalize(),
              s
          }
          function lt() {
              return nt.id || (nt.id = ++rt),
              ++nt.awaits,
              nt.echoes += 100,
              nt.id
          }
          function ut() {
              return !!nt.awaits && (0 == --nt.awaits && (nt.id = 0),
              nt.echoes = 100 * nt.awaits,
              !0)
          }
          function ht(e) {
              return nt.echoes && e && e.constructor === xe ? (lt(),
              e.then((e=>(ut(),
              e)), (e=>(ut(),
              wt(e))))) : e
          }
          function dt(e) {
              ++at,
              nt.echoes && 0 != --nt.echoes || (nt.echoes = nt.id = 0),
              it.push(je),
              pt(e, !0)
          }
          function ft() {
              var e = it[it.length - 1];
              it.pop(),
              pt(e, !1)
          }
          function pt(e, t) {
              var n = je;
              if ((t ? !nt.echoes || ot++ && e === je : !ot || --ot && e === je) || gt(t ? dt.bind(null, e) : ft),
              e !== je && (je = e,
              n === Ie && (Ie.env = mt()),
              Se)) {
                  var r = Ie.env.Promise
                    , i = e.env;
                  we.then = i.nthen,
                  r.prototype.then = i.gthen,
                  (n.global || e.global) && (Object.defineProperty(l, "Promise", i.PromiseProp),
                  r.all = i.all,
                  r.race = i.race,
                  r.resolve = i.resolve,
                  r.reject = i.reject,
                  i.allSettled && (r.allSettled = i.allSettled),
                  i.any && (r.any = i.any))
              }
          }
          function mt() {
              var e = l.Promise;
              return Se ? {
                  Promise: e,
                  PromiseProp: Object.getOwnPropertyDescriptor(l, "Promise"),
                  all: e.all,
                  race: e.race,
                  allSettled: e.allSettled,
                  any: e.any,
                  resolve: e.resolve,
                  reject: e.reject,
                  nthen: we.then,
                  gthen: e.prototype.then
              } : {}
          }
          function yt(e, t, n, r, i) {
              var o = je;
              try {
                  return pt(e, !0),
                  t(n, r, i)
              } finally {
                  pt(o, !1)
              }
          }
          function gt(e) {
              _e.call(be, e)
          }
          function vt(e, t, n, r) {
              return "function" != typeof e ? e : function() {
                  var i = je;
                  n && lt(),
                  pt(t, !0);
                  try {
                      return e.apply(this, arguments)
                  } finally {
                      pt(i, !1),
                      r && gt(ut)
                  }
              }
          }
          function Et(e, t) {
              return function(n, r) {
                  return e.call(this, vt(n, t), vt(r, t))
              }
          }
          function bt(e, t) {
              var n;
              try {
                  n = t.onuncatched(e)
              } catch (e) {}
              if (!1 !== n)
                  try {
                      var r, i = {
                          promise: t,
                          reason: e
                      };
                      if (l.document && document.createEvent ? ((r = document.createEvent("Event")).initEvent("unhandledrejection", !0, !0),
                      d(r, i)) : l.CustomEvent && d(r = new CustomEvent("unhandledrejection",{
                          detail: i
                      }), i),
                      r && l.dispatchEvent && (dispatchEvent(r),
                      !l.PromiseRejectionEvent && l.onunhandledrejection))
                          try {
                              l.onunhandledrejection(r)
                          } catch (e) {}
                      W && r && !r.defaultPrevented && console.warn(`Unhandled rejection: ${e.stack || e}`)
                  } catch (e) {}
          }
          -1 === ("" + _e).indexOf("[native code]") && (lt = ut = ue);
          var wt = Ke.reject;
          function Ot(e, t, n, r) {
              if (e.idbdb && (e._state.openComplete || je.letThrough || e._vip)) {
                  var i = e._createTransaction(t, n, e._dbSchema);
                  try {
                      i.create(),
                      e._state.PR1398_maxLoop = 3
                  } catch (i) {
                      return i.name === oe.InvalidState && e.isOpen() && --e._state.PR1398_maxLoop > 0 ? (console.warn("Dexie: Need to reopen db"),
                      e._close(),
                      e.open().then((()=>Ot(e, t, n, r)))) : wt(i)
                  }
                  return i._promise(t, ((e,t)=>ct((()=>(je.trans = i,
                  r(e, t, i)))))).then((e=>i._completion.then((()=>e))))
              }
              if (e._state.openComplete)
                  return wt(new se.DatabaseClosed(e._state.dbOpenError));
              if (!e._state.isBeingOpened) {
                  if (!e._options.autoOpen)
                      return wt(new se.DatabaseClosed);
                  e.open().catch(ue)
              }
              return e._state.dbReadyPromise.then((()=>Ot(e, t, n, r)))
          }
          const _t = String.fromCharCode(65535)
            , xt = "Invalid key provided. Keys must be of type string, number, Date or Array<string | number | Date>."
            , St = []
            , Lt = "undefined" != typeof navigator && /(MSIE|Trident|Edge)/.test(navigator.userAgent)
            , Pt = Lt
            , kt = Lt
            , Gt = e=>!/(dexie\.js|dexie\.min\.js)/.test(e);
          function Tt(e, t) {
              return e ? t ? function() {
                  return e.apply(this, arguments) && t.apply(this, arguments)
              }
              : e : t
          }
          const Dt = {
              type: 3,
              lower: -1 / 0,
              lowerOpen: !1,
              upper: [[]],
              upperOpen: !1
          };
          function At(e) {
              return "string" != typeof e || /\./.test(e) ? e=>e : t=>(void 0 === t[e] && e in t && delete (t = j(t))[e],
              t)
          }
          class Ct {
              _trans(e, t, n) {
                  const r = this._tx || je.trans
                    , i = this.name;
                  function o(e, n, r) {
                      if (!r.schema[i])
                          throw new se.NotFound("Table " + i + " not part of transaction");
                      return t(r.idbtrans, r)
                  }
                  const a = Ze();
                  try {
                      return r && r.db === this.db ? r === je.trans ? r._promise(e, o, n) : ct((()=>r._promise(e, o, n)), {
                          trans: r,
                          transless: je.transless || je
                      }) : Ot(this.db, e, [this.name], o)
                  } finally {
                      a && Qe()
                  }
              }
              get(e, t) {
                  return e && e.constructor === Object ? this.where(e).first(t) : this._trans("readonly", (t=>this.core.get({
                      trans: t,
                      key: e
                  }).then((e=>this.hook.reading.fire(e))))).then(t)
              }
              where(e) {
                  if ("string" == typeof e)
                      return new this.db.WhereClause(this,e);
                  if (h(e))
                      return new this.db.WhereClause(this,`[${e.join("+")}]`);
                  const t = u(e);
                  if (1 === t.length)
                      return this.where(t[0]).equals(e[t[0]]);
                  const n = this.schema.indexes.concat(this.schema.primKey).filter((e=>e.compound && t.every((t=>e.keyPath.indexOf(t) >= 0)) && e.keyPath.every((e=>t.indexOf(e) >= 0))))[0];
                  if (n && this.db._maxKey !== _t)
                      return this.where(n.name).equals(n.keyPath.map((t=>e[t])));
                  !n && W && console.warn(`The query ${JSON.stringify(e)} on ${this.name} would benefit of a compound index [${t.join("+")}]`);
                  const {idxByName: r} = this.schema
                    , i = this.db._deps.indexedDB;
                  function o(e, t) {
                      try {
                          return 0 === i.cmp(e, t)
                      } catch (e) {
                          return !1
                      }
                  }
                  const [a,s] = t.reduce((([t,n],i)=>{
                      const a = r[i]
                        , s = e[i];
                      return [t || a, t || !a ? Tt(n, a && a.multi ? e=>{
                          const t = k(e, i);
                          return h(t) && t.some((e=>o(s, e)))
                      }
                      : e=>o(s, k(e, i))) : n]
                  }
                  ), [null, null]);
                  return a ? this.where(a.name).equals(e[a.keyPath]).filter(s) : n ? this.filter(s) : this.where(t).equals("")
              }
              filter(e) {
                  return this.toCollection().and(e)
              }
              count(e) {
                  return this.toCollection().count(e)
              }
              offset(e) {
                  return this.toCollection().offset(e)
              }
              limit(e) {
                  return this.toCollection().limit(e)
              }
              each(e) {
                  return this.toCollection().each(e)
              }
              toArray(e) {
                  return this.toCollection().toArray(e)
              }
              toCollection() {
                  return new this.db.Collection(new this.db.WhereClause(this))
              }
              orderBy(e) {
                  return new this.db.Collection(new this.db.WhereClause(this,h(e) ? `[${e.join("+")}]` : e))
              }
              reverse() {
                  return this.toCollection().reverse()
              }
              mapToClass(e) {
                  this.schema.mappedClass = e;
                  const t = t=>{
                      if (!t)
                          return t;
                      const n = Object.create(e.prototype);
                      for (var r in t)
                          if (m(t, r))
                              try {
                                  n[r] = t[r]
                              } catch (e) {}
                      return n
                  }
                  ;
                  return this.schema.readHook && this.hook.reading.unsubscribe(this.schema.readHook),
                  this.schema.readHook = t,
                  this.hook("reading", t),
                  e
              }
              defineClass() {
                  return this.mapToClass((function(e) {
                      d(this, e)
                  }
                  ))
              }
              add(e, t) {
                  const {auto: n, keyPath: r} = this.schema.primKey;
                  let i = e;
                  return r && n && (i = At(r)(e)),
                  this._trans("readwrite", (e=>this.core.mutate({
                      trans: e,
                      type: "add",
                      keys: null != t ? [t] : null,
                      values: [i]
                  }))).then((e=>e.numFailures ? Ke.reject(e.failures[0]) : e.lastResult)).then((t=>{
                      if (r)
                          try {
                              G(e, r, t)
                          } catch (e) {}
                      return t
                  }
                  ))
              }
              update(e, t) {
                  if ("object" != typeof e || h(e))
                      return this.where(":id").equals(e).modify(t);
                  {
                      const n = k(e, this.schema.primKey.keyPath);
                      if (void 0 === n)
                          return wt(new se.InvalidArgument("Given object does not contain its primary key"));
                      try {
                          "function" != typeof t ? u(t).forEach((n=>{
                              G(e, n, t[n])
                          }
                          )) : t(e, {
                              value: e,
                              primKey: n
                          })
                      } catch (e) {}
                      return this.where(":id").equals(n).modify(t)
                  }
              }
              put(e, t) {
                  const {auto: n, keyPath: r} = this.schema.primKey;
                  let i = e;
                  return r && n && (i = At(r)(e)),
                  this._trans("readwrite", (e=>this.core.mutate({
                      trans: e,
                      type: "put",
                      values: [i],
                      keys: null != t ? [t] : null
                  }))).then((e=>e.numFailures ? Ke.reject(e.failures[0]) : e.lastResult)).then((t=>{
                      if (r)
                          try {
                              G(e, r, t)
                          } catch (e) {}
                      return t
                  }
                  ))
              }
              delete(e) {
                  return this._trans("readwrite", (t=>this.core.mutate({
                      trans: t,
                      type: "delete",
                      keys: [e]
                  }))).then((e=>e.numFailures ? Ke.reject(e.failures[0]) : void 0))
              }
              clear() {
                  return this._trans("readwrite", (e=>this.core.mutate({
                      trans: e,
                      type: "deleteRange",
                      range: Dt
                  }))).then((e=>e.numFailures ? Ke.reject(e.failures[0]) : void 0))
              }
              bulkGet(e) {
                  return this._trans("readonly", (t=>this.core.getMany({
                      keys: e,
                      trans: t
                  }).then((e=>e.map((e=>this.hook.reading.fire(e)))))))
              }
              bulkAdd(e, t, n) {
                  const r = Array.isArray(t) ? t : void 0
                    , i = (n = n || (r ? void 0 : t)) ? n.allKeys : void 0;
                  return this._trans("readwrite", (t=>{
                      const {auto: n, keyPath: o} = this.schema.primKey;
                      if (o && r)
                          throw new se.InvalidArgument("bulkAdd(): keys argument invalid on tables with inbound keys");
                      if (r && r.length !== e.length)
                          throw new se.InvalidArgument("Arguments objects and keys must have the same length");
                      const a = e.length;
                      let s = o && n ? e.map(At(o)) : e;
                      return this.core.mutate({
                          trans: t,
                          type: "add",
                          keys: r,
                          values: s,
                          wantResults: i
                      }).then((({numFailures: e, results: t, lastResult: n, failures: r})=>{
                          if (0 === e)
                              return i ? t : n;
                          throw new ie(`${this.name}.bulkAdd(): ${e} of ${a} operations failed`,r)
                      }
                      ))
                  }
                  ))
              }
              bulkPut(e, t, n) {
                  const r = Array.isArray(t) ? t : void 0
                    , i = (n = n || (r ? void 0 : t)) ? n.allKeys : void 0;
                  return this._trans("readwrite", (t=>{
                      const {auto: n, keyPath: o} = this.schema.primKey;
                      if (o && r)
                          throw new se.InvalidArgument("bulkPut(): keys argument invalid on tables with inbound keys");
                      if (r && r.length !== e.length)
                          throw new se.InvalidArgument("Arguments objects and keys must have the same length");
                      const a = e.length;
                      let s = o && n ? e.map(At(o)) : e;
                      return this.core.mutate({
                          trans: t,
                          type: "put",
                          keys: r,
                          values: s,
                          wantResults: i
                      }).then((({numFailures: e, results: t, lastResult: n, failures: r})=>{
                          if (0 === e)
                              return i ? t : n;
                          throw new ie(`${this.name}.bulkPut(): ${e} of ${a} operations failed`,r)
                      }
                      ))
                  }
                  ))
              }
              bulkDelete(e) {
                  const t = e.length;
                  return this._trans("readwrite", (t=>this.core.mutate({
                      trans: t,
                      type: "delete",
                      keys: e
                  }))).then((({numFailures: e, lastResult: n, failures: r})=>{
                      if (0 === e)
                          return n;
                      throw new ie(`${this.name}.bulkDelete(): ${e} of ${t} operations failed`,r)
                  }
                  ))
              }
          }
          function Nt(e) {
              var t = {}
                , n = function(n, r) {
                  if (r) {
                      for (var i = arguments.length, o = new Array(i - 1); --i; )
                          o[i - 1] = arguments[i];
                      return t[n].subscribe.apply(null, o),
                      e
                  }
                  if ("string" == typeof n)
                      return t[n]
              };
              n.addEventType = o;
              for (var r = 1, i = arguments.length; r < i; ++r)
                  o(arguments[r]);
              return n;
              function o(e, r, i) {
                  if ("object" == typeof e)
                      return a(e);
                  r || (r = ge),
                  i || (i = ue);
                  var o = {
                      subscribers: [],
                      fire: i,
                      subscribe: function(e) {
                          -1 === o.subscribers.indexOf(e) && (o.subscribers.push(e),
                          o.fire = r(o.fire, e))
                      },
                      unsubscribe: function(e) {
                          o.subscribers = o.subscribers.filter((function(t) {
                              return t !== e
                          }
                          )),
                          o.fire = o.subscribers.reduce(r, i)
                      }
                  };
                  return t[e] = n[e] = o,
                  o
              }
              function a(e) {
                  u(e).forEach((function(t) {
                      var n = e[t];
                      if (h(n))
                          o(t, e[t][0], e[t][1]);
                      else {
                          if ("asap" !== n)
                              throw new se.InvalidArgument("Invalid event config");
                          var r = o(t, he, (function() {
                              for (var e = arguments.length, t = new Array(e); e--; )
                                  t[e] = arguments[e];
                              r.subscribers.forEach((function(e) {
                                  L((function() {
                                      e.apply(null, t)
                                  }
                                  ))
                              }
                              ))
                          }
                          ))
                      }
                  }
                  ))
              }
          }
          function It(e, t) {
              return E(t).from({
                  prototype: e
              }),
              t
          }
          function jt(e, t) {
              return !(e.filter || e.algorithm || e.or) && (t ? e.justLimit : !e.replayFilter)
          }
          function Rt(e, t) {
              e.filter = Tt(e.filter, t)
          }
          function Mt(e, t, n) {
              var r = e.replayFilter;
              e.replayFilter = r ? ()=>Tt(r(), t()) : t,
              e.justLimit = n && !r
          }
          function Bt(e, t) {
              if (e.isPrimKey)
                  return t.primaryKey;
              const n = t.getIndexByKeyPath(e.index);
              if (!n)
                  throw new se.Schema("KeyPath " + e.index + " on object store " + t.name + " is not indexed");
              return n
          }
          function Kt(e, t, n) {
              const r = Bt(e, t.schema);
              return t.openCursor({
                  trans: n,
                  values: !e.keysOnly,
                  reverse: "prev" === e.dir,
                  unique: !!e.unique,
                  query: {
                      index: r,
                      range: e.range
                  }
              })
          }
          function Ft(e, t, n, r) {
              const i = e.replayFilter ? Tt(e.filter, e.replayFilter()) : e.filter;
              if (e.or) {
                  const o = {}
                    , a = (e,n,r)=>{
                      if (!i || i(n, r, (e=>n.stop(e)), (e=>n.fail(e)))) {
                          var a = n.primaryKey
                            , s = "" + a;
                          "[object ArrayBuffer]" === s && (s = "" + new Uint8Array(a)),
                          m(o, s) || (o[s] = !0,
                          t(e, n, r))
                      }
                  }
                  ;
                  return Promise.all([e.or._iterate(a, n), qt(Kt(e, r, n), e.algorithm, a, !e.keysOnly && e.valueMapper)])
              }
              return qt(Kt(e, r, n), Tt(e.algorithm, i), t, !e.keysOnly && e.valueMapper)
          }
          function qt(e, t, n, r) {
              var i = tt(r ? (e,t,i)=>n(r(e), t, i) : n);
              return e.then((e=>{
                  if (e)
                      return e.start((()=>{
                          var n = ()=>e.continue();
                          t && !t(e, (e=>n = e), (t=>{
                              e.stop(t),
                              n = ue
                          }
                          ), (t=>{
                              e.fail(t),
                              n = ue
                          }
                          )) || i(e.value, e, (e=>n = e)),
                          n()
                      }
                      ))
              }
              ))
          }
          function Ut(e, t) {
              try {
                  const n = zt(e)
                    , r = zt(t);
                  if (n !== r)
                      return "Array" === n ? 1 : "Array" === r ? -1 : "binary" === n ? 1 : "binary" === r ? -1 : "string" === n ? 1 : "string" === r ? -1 : "Date" === n ? 1 : "Date" !== r ? NaN : -1;
                  switch (n) {
                  case "number":
                  case "Date":
                  case "string":
                      return e > t ? 1 : e < t ? -1 : 0;
                  case "binary":
                      return function(e, t) {
                          const n = e.length
                            , r = t.length
                            , i = n < r ? n : r;
                          for (let n = 0; n < i; ++n)
                              if (e[n] !== t[n])
                                  return e[n] < t[n] ? -1 : 1;
                          return n === r ? 0 : n < r ? -1 : 1
                      }($t(e), $t(t));
                  case "Array":
                      return function(e, t) {
                          const n = e.length
                            , r = t.length
                            , i = n < r ? n : r;
                          for (let n = 0; n < i; ++n) {
                              const r = Ut(e[n], t[n]);
                              if (0 !== r)
                                  return r
                          }
                          return n === r ? 0 : n < r ? -1 : 1
                      }(e, t)
                  }
              } catch (e) {}
              return NaN
          }
          function zt(e) {
              const t = typeof e;
              if ("object" !== t)
                  return t;
              if (ArrayBuffer.isView(e))
                  return "binary";
              const n = B(e);
              return "ArrayBuffer" === n ? "binary" : n
          }
          function $t(e) {
              return e instanceof Uint8Array ? e : ArrayBuffer.isView(e) ? new Uint8Array(e.buffer,e.byteOffset,e.byteLength) : new Uint8Array(e)
          }
          class Wt {
              _read(e, t) {
                  var n = this._ctx;
                  return n.error ? n.table._trans(null, wt.bind(null, n.error)) : n.table._trans("readonly", e).then(t)
              }
              _write(e) {
                  var t = this._ctx;
                  return t.error ? t.table._trans(null, wt.bind(null, t.error)) : t.table._trans("readwrite", e, "locked")
              }
              _addAlgorithm(e) {
                  var t = this._ctx;
                  t.algorithm = Tt(t.algorithm, e)
              }
              _iterate(e, t) {
                  return Ft(this._ctx, e, t, this._ctx.table.core)
              }
              clone(e) {
                  var t = Object.create(this.constructor.prototype)
                    , n = Object.create(this._ctx);
                  return e && d(n, e),
                  t._ctx = n,
                  t
              }
              raw() {
                  return this._ctx.valueMapper = null,
                  this
              }
              each(e) {
                  var t = this._ctx;
                  return this._read((n=>Ft(t, e, n, t.table.core)))
              }
              count(e) {
                  return this._read((e=>{
                      const t = this._ctx
                        , n = t.table.core;
                      if (jt(t, !0))
                          return n.count({
                              trans: e,
                              query: {
                                  index: Bt(t, n.schema),
                                  range: t.range
                              }
                          }).then((e=>Math.min(e, t.limit)));
                      var r = 0;
                      return Ft(t, (()=>(++r,
                      !1)), e, n).then((()=>r))
                  }
                  )).then(e)
              }
              sortBy(e, t) {
                  const n = e.split(".").reverse()
                    , r = n[0]
                    , i = n.length - 1;
                  function o(e, t) {
                      return t ? o(e[n[t]], t - 1) : e[r]
                  }
                  var a = "next" === this._ctx.dir ? 1 : -1;
                  function s(e, t) {
                      var n = o(e, i)
                        , r = o(t, i);
                      return n < r ? -a : n > r ? a : 0
                  }
                  return this.toArray((function(e) {
                      return e.sort(s)
                  }
                  )).then(t)
              }
              toArray(e) {
                  return this._read((e=>{
                      var t = this._ctx;
                      if ("next" === t.dir && jt(t, !0) && t.limit > 0) {
                          const {valueMapper: n} = t
                            , r = Bt(t, t.table.core.schema);
                          return t.table.core.query({
                              trans: e,
                              limit: t.limit,
                              values: !0,
                              query: {
                                  index: r,
                                  range: t.range
                              }
                          }).then((({result: e})=>n ? e.map(n) : e))
                      }
                      {
                          const n = [];
                          return Ft(t, (e=>n.push(e)), e, t.table.core).then((()=>n))
                      }
                  }
                  ), e)
              }
              offset(e) {
                  var t = this._ctx;
                  return e <= 0 || (t.offset += e,
                  jt(t) ? Mt(t, (()=>{
                      var t = e;
                      return (e,n)=>0 === t || (1 === t ? (--t,
                      !1) : (n((()=>{
                          e.advance(t),
                          t = 0
                      }
                      )),
                      !1))
                  }
                  )) : Mt(t, (()=>{
                      var t = e;
                      return ()=>--t < 0
                  }
                  ))),
                  this
              }
              limit(e) {
                  return this._ctx.limit = Math.min(this._ctx.limit, e),
                  Mt(this._ctx, (()=>{
                      var t = e;
                      return function(e, n, r) {
                          return --t <= 0 && n(r),
                          t >= 0
                      }
                  }
                  ), !0),
                  this
              }
              until(e, t) {
                  return Rt(this._ctx, (function(n, r, i) {
                      return !e(n.value) || (r(i),
                      t)
                  }
                  )),
                  this
              }
              first(e) {
                  return this.limit(1).toArray((function(e) {
                      return e[0]
                  }
                  )).then(e)
              }
              last(e) {
                  return this.reverse().first(e)
              }
              filter(e) {
                  var t, n;
                  return Rt(this._ctx, (function(t) {
                      return e(t.value)
                  }
                  )),
                  t = this._ctx,
                  n = e,
                  t.isMatch = Tt(t.isMatch, n),
                  this
              }
              and(e) {
                  return this.filter(e)
              }
              or(e) {
                  return new this.db.WhereClause(this._ctx.table,e,this)
              }
              reverse() {
                  return this._ctx.dir = "prev" === this._ctx.dir ? "next" : "prev",
                  this._ondirectionchange && this._ondirectionchange(this._ctx.dir),
                  this
              }
              desc() {
                  return this.reverse()
              }
              eachKey(e) {
                  var t = this._ctx;
                  return t.keysOnly = !t.isMatch,
                  this.each((function(t, n) {
                      e(n.key, n)
                  }
                  ))
              }
              eachUniqueKey(e) {
                  return this._ctx.unique = "unique",
                  this.eachKey(e)
              }
              eachPrimaryKey(e) {
                  var t = this._ctx;
                  return t.keysOnly = !t.isMatch,
                  this.each((function(t, n) {
                      e(n.primaryKey, n)
                  }
                  ))
              }
              keys(e) {
                  var t = this._ctx;
                  t.keysOnly = !t.isMatch;
                  var n = [];
                  return this.each((function(e, t) {
                      n.push(t.key)
                  }
                  )).then((function() {
                      return n
                  }
                  )).then(e)
              }
              primaryKeys(e) {
                  var t = this._ctx;
                  if ("next" === t.dir && jt(t, !0) && t.limit > 0)
                      return this._read((e=>{
                          var n = Bt(t, t.table.core.schema);
                          return t.table.core.query({
                              trans: e,
                              values: !1,
                              limit: t.limit,
                              query: {
                                  index: n,
                                  range: t.range
                              }
                          })
                      }
                      )).then((({result: e})=>e)).then(e);
                  t.keysOnly = !t.isMatch;
                  var n = [];
                  return this.each((function(e, t) {
                      n.push(t.primaryKey)
                  }
                  )).then((function() {
                      return n
                  }
                  )).then(e)
              }
              uniqueKeys(e) {
                  return this._ctx.unique = "unique",
                  this.keys(e)
              }
              firstKey(e) {
                  return this.limit(1).keys((function(e) {
                      return e[0]
                  }
                  )).then(e)
              }
              lastKey(e) {
                  return this.reverse().firstKey(e)
              }
              distinct() {
                  var e = this._ctx
                    , t = e.index && e.table.schema.idxByName[e.index];
                  if (!t || !t.multi)
                      return this;
                  var n = {};
                  return Rt(this._ctx, (function(e) {
                      var t = e.primaryKey.toString()
                        , r = m(n, t);
                      return n[t] = !0,
                      !r
                  }
                  )),
                  this
              }
              modify(e) {
                  var t = this._ctx;
                  return this._write((n=>{
                      var r;
                      if ("function" == typeof e)
                          r = e;
                      else {
                          var i = u(e)
                            , o = i.length;
                          r = function(t) {
                              for (var n = !1, r = 0; r < o; ++r) {
                                  var a = i[r]
                                    , s = e[a];
                                  k(t, a) !== s && (G(t, a, s),
                                  n = !0)
                              }
                              return n
                          }
                      }
                      const a = t.table.core
                        , {outbound: s, extractKey: c} = a.schema.primaryKey
                        , l = this.db._options.modifyChunkSize || 200
                        , h = [];
                      let d = 0;
                      const f = []
                        , p = (e,t)=>{
                          const {failures: n, numFailures: r} = t;
                          d += e - r;
                          for (let e of u(n))
                              h.push(n[e])
                      }
                      ;
                      return this.clone().primaryKeys().then((i=>{
                          const o = u=>{
                              const h = Math.min(l, i.length - u);
                              return a.getMany({
                                  trans: n,
                                  keys: i.slice(u, u + h),
                                  cache: "immutable"
                              }).then((d=>{
                                  const f = []
                                    , m = []
                                    , y = s ? [] : null
                                    , g = [];
                                  for (let e = 0; e < h; ++e) {
                                      const t = d[e]
                                        , n = {
                                          value: j(t),
                                          primKey: i[u + e]
                                      };
                                      !1 !== r.call(n, n.value, n) && (null == n.value ? g.push(i[u + e]) : s || 0 === Ut(c(t), c(n.value)) ? (m.push(n.value),
                                      s && y.push(i[u + e])) : (g.push(i[u + e]),
                                      f.push(n.value)))
                                  }
                                  const v = jt(t) && t.limit === 1 / 0 && ("function" != typeof e || e === Ht) && {
                                      index: t.index,
                                      range: t.range
                                  };
                                  return Promise.resolve(f.length > 0 && a.mutate({
                                      trans: n,
                                      type: "add",
                                      values: f
                                  }).then((e=>{
                                      for (let t in e.failures)
                                          g.splice(parseInt(t), 1);
                                      p(f.length, e)
                                  }
                                  ))).then((()=>(m.length > 0 || v && "object" == typeof e) && a.mutate({
                                      trans: n,
                                      type: "put",
                                      keys: y,
                                      values: m,
                                      criteria: v,
                                      changeSpec: "function" != typeof e && e
                                  }).then((e=>p(m.length, e))))).then((()=>(g.length > 0 || v && e === Ht) && a.mutate({
                                      trans: n,
                                      type: "delete",
                                      keys: g,
                                      criteria: v
                                  }).then((e=>p(g.length, e))))).then((()=>i.length > u + h && o(u + l)))
                              }
                              ))
                          }
                          ;
                          return o(0).then((()=>{
                              if (h.length > 0)
                                  throw new re("Error modifying one or more objects",h,d,f);
                              return i.length
                          }
                          ))
                      }
                      ))
                  }
                  ))
              }
              delete() {
                  var e = this._ctx
                    , t = e.range;
                  return jt(e) && (e.isPrimKey && !kt || 3 === t.type) ? this._write((n=>{
                      const {primaryKey: r} = e.table.core.schema
                        , i = t;
                      return e.table.core.count({
                          trans: n,
                          query: {
                              index: r,
                              range: i
                          }
                      }).then((t=>e.table.core.mutate({
                          trans: n,
                          type: "deleteRange",
                          range: i
                      }).then((({failures: e, lastResult: n, results: r, numFailures: i})=>{
                          if (i)
                              throw new re("Could not delete some values",Object.keys(e).map((t=>e[t])),t - i);
                          return t - i
                      }
                      ))))
                  }
                  )) : this.modify(Ht)
              }
          }
          const Ht = (e,t)=>t.value = null;
          function Vt(e, t) {
              return e < t ? -1 : e === t ? 0 : 1
          }
          function Yt(e, t) {
              return e > t ? -1 : e === t ? 0 : 1
          }
          function Xt(e, t, n) {
              var r = e instanceof nn ? new e.Collection(e) : e;
              return r._ctx.error = n ? new n(t) : new TypeError(t),
              r
          }
          function Zt(e) {
              return new e.Collection(e,(()=>tn(""))).limit(0)
          }
          function Qt(e, t, n, r, i, o) {
              for (var a = Math.min(e.length, r.length), s = -1, c = 0; c < a; ++c) {
                  var l = t[c];
                  if (l !== r[c])
                      return i(e[c], n[c]) < 0 ? e.substr(0, c) + n[c] + n.substr(c + 1) : i(e[c], r[c]) < 0 ? e.substr(0, c) + r[c] + n.substr(c + 1) : s >= 0 ? e.substr(0, s) + t[s] + n.substr(s + 1) : null;
                  i(e[c], l) < 0 && (s = c)
              }
              return a < r.length && "next" === o ? e + n.substr(e.length) : a < e.length && "prev" === o ? e.substr(0, n.length) : s < 0 ? null : e.substr(0, s) + r[s] + n.substr(s + 1)
          }
          function Jt(e, t, n, r) {
              var i, o, a, s, c, l, u, h = n.length;
              if (!n.every((e=>"string" == typeof e)))
                  return Xt(e, "String expected.");
              function d(e) {
                  i = function(e) {
                      return "next" === e ? e=>e.toUpperCase() : e=>e.toLowerCase()
                  }(e),
                  o = function(e) {
                      return "next" === e ? e=>e.toLowerCase() : e=>e.toUpperCase()
                  }(e),
                  a = "next" === e ? Vt : Yt;
                  var t = n.map((function(e) {
                      return {
                          lower: o(e),
                          upper: i(e)
                      }
                  }
                  )).sort((function(e, t) {
                      return a(e.lower, t.lower)
                  }
                  ));
                  s = t.map((function(e) {
                      return e.upper
                  }
                  )),
                  c = t.map((function(e) {
                      return e.lower
                  }
                  )),
                  l = e,
                  u = "next" === e ? "" : r
              }
              d("next");
              var f = new e.Collection(e,(()=>en(s[0], c[h - 1] + r)));
              f._ondirectionchange = function(e) {
                  d(e)
              }
              ;
              var p = 0;
              return f._addAlgorithm((function(e, n, r) {
                  var i = e.key;
                  if ("string" != typeof i)
                      return !1;
                  var d = o(i);
                  if (t(d, c, p))
                      return !0;
                  for (var f = null, m = p; m < h; ++m) {
                      var y = Qt(i, d, s[m], c[m], a, l);
                      null === y && null === f ? p = m + 1 : (null === f || a(f, y) > 0) && (f = y)
                  }
                  return n(null !== f ? function() {
                      e.continue(f + u)
                  }
                  : r),
                  !1
              }
              )),
              f
          }
          function en(e, t, n, r) {
              return {
                  type: 2,
                  lower: e,
                  upper: t,
                  lowerOpen: n,
                  upperOpen: r
              }
          }
          function tn(e) {
              return {
                  type: 1,
                  lower: e,
                  upper: e
              }
          }
          class nn {
              get Collection() {
                  return this._ctx.table.db.Collection
              }
              between(e, t, n, r) {
                  n = !1 !== n,
                  r = !0 === r;
                  try {
                      return this._cmp(e, t) > 0 || 0 === this._cmp(e, t) && (n || r) && (!n || !r) ? Zt(this) : new this.Collection(this,(()=>en(e, t, !n, !r)))
                  } catch (e) {
                      return Xt(this, xt)
                  }
              }
              equals(e) {
                  return null == e ? Xt(this, xt) : new this.Collection(this,(()=>tn(e)))
              }
              above(e) {
                  return null == e ? Xt(this, xt) : new this.Collection(this,(()=>en(e, void 0, !0)))
              }
              aboveOrEqual(e) {
                  return null == e ? Xt(this, xt) : new this.Collection(this,(()=>en(e, void 0, !1)))
              }
              below(e) {
                  return null == e ? Xt(this, xt) : new this.Collection(this,(()=>en(void 0, e, !1, !0)))
              }
              belowOrEqual(e) {
                  return null == e ? Xt(this, xt) : new this.Collection(this,(()=>en(void 0, e)))
              }
              startsWith(e) {
                  return "string" != typeof e ? Xt(this, "String expected.") : this.between(e, e + _t, !0, !0)
              }
              startsWithIgnoreCase(e) {
                  return "" === e ? this.startsWith(e) : Jt(this, ((e,t)=>0 === e.indexOf(t[0])), [e], _t)
              }
              equalsIgnoreCase(e) {
                  return Jt(this, ((e,t)=>e === t[0]), [e], "")
              }
              anyOfIgnoreCase() {
                  var e = U.apply(q, arguments);
                  return 0 === e.length ? Zt(this) : Jt(this, ((e,t)=>-1 !== t.indexOf(e)), e, "")
              }
              startsWithAnyOfIgnoreCase() {
                  var e = U.apply(q, arguments);
                  return 0 === e.length ? Zt(this) : Jt(this, ((e,t)=>t.some((t=>0 === e.indexOf(t)))), e, _t)
              }
              anyOf() {
                  const e = U.apply(q, arguments);
                  let t = this._cmp;
                  try {
                      e.sort(t)
                  } catch (e) {
                      return Xt(this, xt)
                  }
                  if (0 === e.length)
                      return Zt(this);
                  const n = new this.Collection(this,(()=>en(e[0], e[e.length - 1])));
                  n._ondirectionchange = n=>{
                      t = "next" === n ? this._ascending : this._descending,
                      e.sort(t)
                  }
                  ;
                  let r = 0;
                  return n._addAlgorithm(((n,i,o)=>{
                      const a = n.key;
                      for (; t(a, e[r]) > 0; )
                          if (++r,
                          r === e.length)
                              return i(o),
                              !1;
                      return 0 === t(a, e[r]) || (i((()=>{
                          n.continue(e[r])
                      }
                      )),
                      !1)
                  }
                  )),
                  n
              }
              notEqual(e) {
                  return this.inAnyRange([[-1 / 0, e], [e, this.db._maxKey]], {
                      includeLowers: !1,
                      includeUppers: !1
                  })
              }
              noneOf() {
                  const e = U.apply(q, arguments);
                  if (0 === e.length)
                      return new this.Collection(this);
                  try {
                      e.sort(this._ascending)
                  } catch (e) {
                      return Xt(this, xt)
                  }
                  const t = e.reduce(((e,t)=>e ? e.concat([[e[e.length - 1][1], t]]) : [[-1 / 0, t]]), null);
                  return t.push([e[e.length - 1], this.db._maxKey]),
                  this.inAnyRange(t, {
                      includeLowers: !1,
                      includeUppers: !1
                  })
              }
              inAnyRange(e, t) {
                  const n = this._cmp
                    , r = this._ascending
                    , i = this._descending
                    , o = this._min
                    , a = this._max;
                  if (0 === e.length)
                      return Zt(this);
                  if (!e.every((e=>void 0 !== e[0] && void 0 !== e[1] && r(e[0], e[1]) <= 0)))
                      return Xt(this, "First argument to inAnyRange() must be an Array of two-value Arrays [lower,upper] where upper must not be lower than lower", se.InvalidArgument);
                  const s = !t || !1 !== t.includeLowers
                    , c = t && !0 === t.includeUppers;
                  let l, u = r;
                  function h(e, t) {
                      return u(e[0], t[0])
                  }
                  try {
                      l = e.reduce((function(e, t) {
                          let r = 0
                            , i = e.length;
                          for (; r < i; ++r) {
                              const i = e[r];
                              if (n(t[0], i[1]) < 0 && n(t[1], i[0]) > 0) {
                                  i[0] = o(i[0], t[0]),
                                  i[1] = a(i[1], t[1]);
                                  break
                              }
                          }
                          return r === i && e.push(t),
                          e
                      }
                      ), []),
                      l.sort(h)
                  } catch (e) {
                      return Xt(this, xt)
                  }
                  let d = 0;
                  const f = c ? e=>r(e, l[d][1]) > 0 : e=>r(e, l[d][1]) >= 0
                    , p = s ? e=>i(e, l[d][0]) > 0 : e=>i(e, l[d][0]) >= 0;
                  let m = f;
                  const y = new this.Collection(this,(()=>en(l[0][0], l[l.length - 1][1], !s, !c)));
                  return y._ondirectionchange = e=>{
                      "next" === e ? (m = f,
                      u = r) : (m = p,
                      u = i),
                      l.sort(h)
                  }
                  ,
                  y._addAlgorithm(((e,t,n)=>{
                      for (var i = e.key; m(i); )
                          if (++d,
                          d === l.length)
                              return t(n),
                              !1;
                      return !!function(e) {
                          return !f(e) && !p(e)
                      }(i) || (0 === this._cmp(i, l[d][1]) || 0 === this._cmp(i, l[d][0]) || t((()=>{
                          u === r ? e.continue(l[d][0]) : e.continue(l[d][1])
                      }
                      )),
                      !1)
                  }
                  )),
                  y
              }
              startsWithAnyOf() {
                  const e = U.apply(q, arguments);
                  return e.every((e=>"string" == typeof e)) ? 0 === e.length ? Zt(this) : this.inAnyRange(e.map((e=>[e, e + _t]))) : Xt(this, "startsWithAnyOf() only works with strings")
              }
          }
          function rn(e) {
              return tt((function(t) {
                  return on(t),
                  e(t.target.error),
                  !1
              }
              ))
          }
          function on(e) {
              e.stopPropagation && e.stopPropagation(),
              e.preventDefault && e.preventDefault()
          }
          const an = Nt(null, "storagemutated");
          class sn {
              _lock() {
                  return S(!je.global),
                  ++this._reculock,
                  1 !== this._reculock || je.global || (je.lockOwnerFor = this),
                  this
              }
              _unlock() {
                  if (S(!je.global),
                  0 == --this._reculock)
                      for (je.global || (je.lockOwnerFor = null); this._blockedFuncs.length > 0 && !this._locked(); ) {
                          var e = this._blockedFuncs.shift();
                          try {
                              yt(e[1], e[0])
                          } catch (e) {}
                      }
                  return this
              }
              _locked() {
                  return this._reculock && je.lockOwnerFor !== this
              }
              create(e) {
                  if (!this.mode)
                      return this;
                  const t = this.db.idbdb
                    , n = this.db._state.dbOpenError;
                  if (S(!this.idbtrans),
                  !e && !t)
                      switch (n && n.name) {
                      case "DatabaseClosedError":
                          throw new se.DatabaseClosed(n);
                      case "MissingAPIError":
                          throw new se.MissingAPI(n.message,n);
                      default:
                          throw new se.OpenFailed(n)
                      }
                  if (!this.active)
                      throw new se.TransactionInactive;
                  return S(null === this._completion._state),
                  (e = this.idbtrans = e || (this.db.core ? this.db.core.transaction(this.storeNames, this.mode, {
                      durability: this.chromeTransactionDurability
                  }) : t.transaction(this.storeNames, this.mode, {
                      durability: this.chromeTransactionDurability
                  }))).onerror = tt((t=>{
                      on(t),
                      this._reject(e.error)
                  }
                  )),
                  e.onabort = tt((t=>{
                      on(t),
                      this.active && this._reject(new se.Abort(e.error)),
                      this.active = !1,
                      this.on("abort").fire(t)
                  }
                  )),
                  e.oncomplete = tt((()=>{
                      this.active = !1,
                      this._resolve(),
                      "mutatedParts"in e && an.storagemutated.fire(e.mutatedParts)
                  }
                  )),
                  this
              }
              _promise(e, t, n) {
                  if ("readwrite" === e && "readwrite" !== this.mode)
                      return wt(new se.ReadOnly("Transaction is readonly"));
                  if (!this.active)
                      return wt(new se.TransactionInactive);
                  if (this._locked())
                      return new Ke(((r,i)=>{
                          this._blockedFuncs.push([()=>{
                              this._promise(e, t, n).then(r, i)
                          }
                          , je])
                      }
                      ));
                  if (n)
                      return ct((()=>{
                          var e = new Ke(((e,n)=>{
                              this._lock();
                              const r = t(e, n, this);
                              r && r.then && r.then(e, n)
                          }
                          ));
                          return e.finally((()=>this._unlock())),
                          e._lib = !0,
                          e
                      }
                      ));
                  var r = new Ke(((e,n)=>{
                      var r = t(e, n, this);
                      r && r.then && r.then(e, n)
                  }
                  ));
                  return r._lib = !0,
                  r
              }
              _root() {
                  return this.parent ? this.parent._root() : this
              }
              waitFor(e) {
                  var t = this._root();
                  const n = Ke.resolve(e);
                  if (t._waitingFor)
                      t._waitingFor = t._waitingFor.then((()=>n));
                  else {
                      t._waitingFor = n,
                      t._waitingQueue = [];
                      var r = t.idbtrans.objectStore(t.storeNames[0]);
                      !function e() {
                          for (++t._spinCount; t._waitingQueue.length; )
                              t._waitingQueue.shift()();
                          t._waitingFor && (r.get(-1 / 0).onsuccess = e)
                      }()
                  }
                  var i = t._waitingFor;
                  return new Ke(((e,r)=>{
                      n.then((n=>t._waitingQueue.push(tt(e.bind(null, n)))), (e=>t._waitingQueue.push(tt(r.bind(null, e))))).finally((()=>{
                          t._waitingFor === i && (t._waitingFor = null)
                      }
                      ))
                  }
                  ))
              }
              abort() {
                  this.active && (this.active = !1,
                  this.idbtrans && this.idbtrans.abort(),
                  this._reject(new se.Abort))
              }
              table(e) {
                  const t = this._memoizedTables || (this._memoizedTables = {});
                  if (m(t, e))
                      return t[e];
                  const n = this.schema[e];
                  if (!n)
                      throw new se.NotFound("Table " + e + " not part of transaction");
                  const r = new this.db.Table(e,n,this);
                  return r.core = this.db.core.table(e),
                  t[e] = r,
                  r
              }
          }
          function cn(e, t, n, r, i, o, a) {
              return {
                  name: e,
                  keyPath: t,
                  unique: n,
                  multi: r,
                  auto: i,
                  compound: o,
                  src: (n && !a ? "&" : "") + (r ? "*" : "") + (i ? "++" : "") + ln(t)
              }
          }
          function ln(e) {
              return "string" == typeof e ? e : e ? "[" + [].join.call(e, "+") + "]" : ""
          }
          function un(e, t, n) {
              return {
                  name: e,
                  primKey: t,
                  indexes: n,
                  mappedClass: null,
                  idxByName: P(n, (e=>[e.name, e]))
              }
          }
          let hn = e=>{
              try {
                  return e.only([[]]),
                  hn = ()=>[[]],
                  [[]]
              } catch (e) {
                  return hn = ()=>_t,
                  _t
              }
          }
          ;
          function dn(e) {
              return null == e ? ()=>{}
              : "string" == typeof e ? function(e) {
                  return 1 === e.split(".").length ? t=>t[e] : t=>k(t, e)
              }(e) : t=>k(t, e)
          }
          function fn(e) {
              return [].slice.call(e)
          }
          let pn = 0;
          function mn(e) {
              return null == e ? ":id" : "string" == typeof e ? e : `[${e.join("+")}]`
          }
          function yn(e, t, n) {
              function r(e) {
                  if (3 === e.type)
                      return null;
                  if (4 === e.type)
                      throw new Error("Cannot convert never type to IDBKeyRange");
                  const {lower: n, upper: r, lowerOpen: i, upperOpen: o} = e;
                  return void 0 === n ? void 0 === r ? null : t.upperBound(r, !!o) : void 0 === r ? t.lowerBound(n, !!i) : t.bound(n, r, !!i, !!o)
              }
              const {schema: i, hasGetAll: o} = function(e, t) {
                  const n = fn(e.objectStoreNames);
                  return {
                      schema: {
                          name: e.name,
                          tables: n.map((e=>t.objectStore(e))).map((e=>{
                              const {keyPath: t, autoIncrement: n} = e
                                , r = h(t)
                                , i = null == t
                                , o = {}
                                , a = {
                                  name: e.name,
                                  primaryKey: {
                                      name: null,
                                      isPrimaryKey: !0,
                                      outbound: i,
                                      compound: r,
                                      keyPath: t,
                                      autoIncrement: n,
                                      unique: !0,
                                      extractKey: dn(t)
                                  },
                                  indexes: fn(e.indexNames).map((t=>e.index(t))).map((e=>{
                                      const {name: t, unique: n, multiEntry: r, keyPath: i} = e
                                        , a = {
                                          name: t,
                                          compound: h(i),
                                          keyPath: i,
                                          unique: n,
                                          multiEntry: r,
                                          extractKey: dn(i)
                                      };
                                      return o[mn(i)] = a,
                                      a
                                  }
                                  )),
                                  getIndexByKeyPath: e=>o[mn(e)]
                              };
                              return o[":id"] = a.primaryKey,
                              null != t && (o[mn(t)] = a.primaryKey),
                              a
                          }
                          ))
                      },
                      hasGetAll: n.length > 0 && "getAll"in t.objectStore(n[0]) && !("undefined" != typeof navigator && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604)
                  }
              }(e, n)
                , a = i.tables.map((e=>function(e) {
                  const t = e.name;
                  return {
                      name: t,
                      schema: e,
                      mutate: function({trans: e, type: n, keys: i, values: o, range: a}) {
                          return new Promise(((s,c)=>{
                              s = tt(s);
                              const l = e.objectStore(t)
                                , u = null == l.keyPath
                                , h = "put" === n || "add" === n;
                              if (!h && "delete" !== n && "deleteRange" !== n)
                                  throw new Error("Invalid operation type: " + n);
                              const {length: d} = i || o || {
                                  length: 1
                              };
                              if (i && o && i.length !== o.length)
                                  throw new Error("Given keys array must have same length as given values array.");
                              if (0 === d)
                                  return s({
                                      numFailures: 0,
                                      failures: {},
                                      results: [],
                                      lastResult: void 0
                                  });
                              let f;
                              const p = []
                                , m = [];
                              let y = 0;
                              const g = e=>{
                                  ++y,
                                  on(e)
                              }
                              ;
                              if ("deleteRange" === n) {
                                  if (4 === a.type)
                                      return s({
                                          numFailures: y,
                                          failures: m,
                                          results: [],
                                          lastResult: void 0
                                      });
                                  3 === a.type ? p.push(f = l.clear()) : p.push(f = l.delete(r(a)))
                              } else {
                                  const [e,t] = h ? u ? [o, i] : [o, null] : [i, null];
                                  if (h)
                                      for (let r = 0; r < d; ++r)
                                          p.push(f = t && void 0 !== t[r] ? l[n](e[r], t[r]) : l[n](e[r])),
                                          f.onerror = g;
                                  else
                                      for (let t = 0; t < d; ++t)
                                          p.push(f = l[n](e[t])),
                                          f.onerror = g
                              }
                              const v = e=>{
                                  const t = e.target.result;
                                  p.forEach(((e,t)=>null != e.error && (m[t] = e.error))),
                                  s({
                                      numFailures: y,
                                      failures: m,
                                      results: "delete" === n ? i : p.map((e=>e.result)),
                                      lastResult: t
                                  })
                              }
                              ;
                              f.onerror = e=>{
                                  g(e),
                                  v(e)
                              }
                              ,
                              f.onsuccess = v
                          }
                          ))
                      },
                      getMany: ({trans: e, keys: n})=>new Promise(((r,i)=>{
                          r = tt(r);
                          const o = e.objectStore(t)
                            , a = n.length
                            , s = new Array(a);
                          let c, l = 0, u = 0;
                          const h = e=>{
                              const t = e.target;
                              s[t._pos] = t.result,
                              ++u === l && r(s)
                          }
                            , d = rn(i);
                          for (let e = 0; e < a; ++e)
                              null != n[e] && (c = o.get(n[e]),
                              c._pos = e,
                              c.onsuccess = h,
                              c.onerror = d,
                              ++l);
                          0 === l && r(s)
                      }
                      )),
                      get: ({trans: e, key: n})=>new Promise(((r,i)=>{
                          r = tt(r);
                          const o = e.objectStore(t).get(n);
                          o.onsuccess = e=>r(e.target.result),
                          o.onerror = rn(i)
                      }
                      )),
                      query: function(e) {
                          return n=>new Promise(((i,o)=>{
                              i = tt(i);
                              const {trans: a, values: s, limit: c, query: l} = n
                                , u = c === 1 / 0 ? void 0 : c
                                , {index: h, range: d} = l
                                , f = a.objectStore(t)
                                , p = h.isPrimaryKey ? f : f.index(h.name)
                                , m = r(d);
                              if (0 === c)
                                  return i({
                                      result: []
                                  });
                              if (e) {
                                  const e = s ? p.getAll(m, u) : p.getAllKeys(m, u);
                                  e.onsuccess = e=>i({
                                      result: e.target.result
                                  }),
                                  e.onerror = rn(o)
                              } else {
                                  let e = 0;
                                  const t = s || !("openKeyCursor"in p) ? p.openCursor(m) : p.openKeyCursor(m)
                                    , n = [];
                                  t.onsuccess = r=>{
                                      const o = t.result;
                                      return o ? (n.push(s ? o.value : o.primaryKey),
                                      ++e === c ? i({
                                          result: n
                                      }) : void o.continue()) : i({
                                          result: n
                                      })
                                  }
                                  ,
                                  t.onerror = rn(o)
                              }
                          }
                          ))
                      }(o),
                      openCursor: function({trans: e, values: n, query: i, reverse: o, unique: a}) {
                          return new Promise(((s,c)=>{
                              s = tt(s);
                              const {index: l, range: u} = i
                                , h = e.objectStore(t)
                                , d = l.isPrimaryKey ? h : h.index(l.name)
                                , f = o ? a ? "prevunique" : "prev" : a ? "nextunique" : "next"
                                , p = n || !("openKeyCursor"in d) ? d.openCursor(r(u), f) : d.openKeyCursor(r(u), f);
                              p.onerror = rn(c),
                              p.onsuccess = tt((t=>{
                                  const n = p.result;
                                  if (!n)
                                      return void s(null);
                                  n.___id = ++pn,
                                  n.done = !1;
                                  const r = n.continue.bind(n);
                                  let i = n.continuePrimaryKey;
                                  i && (i = i.bind(n));
                                  const o = n.advance.bind(n)
                                    , a = ()=>{
                                      throw new Error("Cursor not stopped")
                                  }
                                  ;
                                  n.trans = e,
                                  n.stop = n.continue = n.continuePrimaryKey = n.advance = ()=>{
                                      throw new Error("Cursor not started")
                                  }
                                  ,
                                  n.fail = tt(c),
                                  n.next = function() {
                                      let e = 1;
                                      return this.start((()=>e-- ? this.continue() : this.stop())).then((()=>this))
                                  }
                                  ,
                                  n.start = e=>{
                                      const t = new Promise(((e,t)=>{
                                          e = tt(e),
                                          p.onerror = rn(t),
                                          n.fail = t,
                                          n.stop = t=>{
                                              n.stop = n.continue = n.continuePrimaryKey = n.advance = a,
                                              e(t)
                                          }
                                      }
                                      ))
                                        , s = ()=>{
                                          if (p.result)
                                              try {
                                                  e()
                                              } catch (e) {
                                                  n.fail(e)
                                              }
                                          else
                                              n.done = !0,
                                              n.start = ()=>{
                                                  throw new Error("Cursor behind last entry")
                                              }
                                              ,
                                              n.stop()
                                      }
                                      ;
                                      return p.onsuccess = tt((e=>{
                                          p.onsuccess = s,
                                          s()
                                      }
                                      )),
                                      n.continue = r,
                                      n.continuePrimaryKey = i,
                                      n.advance = o,
                                      s(),
                                      t
                                  }
                                  ,
                                  s(n)
                              }
                              ), c)
                          }
                          ))
                      },
                      count({query: e, trans: n}) {
                          const {index: i, range: o} = e;
                          return new Promise(((e,a)=>{
                              const s = n.objectStore(t)
                                , c = i.isPrimaryKey ? s : s.index(i.name)
                                , l = r(o)
                                , u = l ? c.count(l) : c.count();
                              u.onsuccess = tt((t=>e(t.target.result))),
                              u.onerror = rn(a)
                          }
                          ))
                      }
                  }
              }(e)))
                , s = {};
              return a.forEach((e=>s[e.name] = e)),
              {
                  stack: "dbcore",
                  transaction: e.transaction.bind(e),
                  table(e) {
                      if (!s[e])
                          throw new Error(`Table '${e}' not found`);
                      return s[e]
                  },
                  MIN_KEY: -1 / 0,
                  MAX_KEY: hn(t),
                  schema: i
              }
          }
          function gn({_novip: e}, t) {
              const n = t.db
                , r = function(e, t, {IDBKeyRange: n, indexedDB: r}, i) {
                  const o = function(e, t) {
                      return t.reduce(((e,{create: t})=>({
                          ...e,
                          ...t(e)
                      })), e)
                  }(yn(t, n, i), e.dbcore);
                  return {
                      dbcore: o
                  }
              }(e._middlewares, n, e._deps, t);
              e.core = r.dbcore,
              e.tables.forEach((t=>{
                  const n = t.name;
                  e.core.schema.tables.some((e=>e.name === n)) && (t.core = e.core.table(n),
                  e[n]instanceof e.Table && (e[n].core = t.core))
              }
              ))
          }
          function vn({_novip: e}, t, n, r) {
              n.forEach((n=>{
                  const i = r[n];
                  t.forEach((t=>{
                      const r = w(t, n);
                      (!r || "value"in r && void 0 === r.value) && (t === e.Transaction.prototype || t instanceof e.Transaction ? v(t, n, {
                          get() {
                              return this.table(n)
                          },
                          set(e) {
                              g(this, n, {
                                  value: e,
                                  writable: !0,
                                  configurable: !0,
                                  enumerable: !0
                              })
                          }
                      }) : t[n] = new e.Table(n,i))
                  }
                  ))
              }
              ))
          }
          function En({_novip: e}, t) {
              t.forEach((t=>{
                  for (let n in t)
                      t[n]instanceof e.Table && delete t[n]
              }
              ))
          }
          function bn(e, t) {
              return e._cfg.version - t._cfg.version
          }
          function wn(e, t, n, r) {
              const i = e._dbSchema
                , o = e._createTransaction("readwrite", e._storeNames, i);
              o.create(n),
              o._completion.catch(r);
              const a = o._reject.bind(o)
                , s = je.transless || je;
              ct((()=>{
                  je.trans = o,
                  je.transless = s,
                  0 === t ? (u(i).forEach((e=>{
                      _n(n, e, i[e].primKey, i[e].indexes)
                  }
                  )),
                  gn(e, n),
                  Ke.follow((()=>e.on.populate.fire(o))).catch(a)) : function({_novip: e}, t, n, r) {
                      const i = []
                        , o = e._versions;
                      let a = e._dbSchema = Sn(e, e.idbdb, r)
                        , s = !1;
                      return o.filter((e=>e._cfg.version >= t)).forEach((o=>{
                          i.push((()=>{
                              const i = a
                                , c = o._cfg.dbschema;
                              Ln(e, i, r),
                              Ln(e, c, r),
                              a = e._dbSchema = c;
                              const l = On(i, c);
                              l.add.forEach((e=>{
                                  _n(r, e[0], e[1].primKey, e[1].indexes)
                              }
                              )),
                              l.change.forEach((e=>{
                                  if (e.recreate)
                                      throw new se.Upgrade("Not yet support for changing primary key");
                                  {
                                      const t = r.objectStore(e.name);
                                      e.add.forEach((e=>xn(t, e))),
                                      e.change.forEach((e=>{
                                          t.deleteIndex(e.name),
                                          xn(t, e)
                                      }
                                      )),
                                      e.del.forEach((e=>t.deleteIndex(e)))
                                  }
                              }
                              ));
                              const h = o._cfg.contentUpgrade;
                              if (h && o._cfg.version > t) {
                                  gn(e, r),
                                  n._memoizedTables = {},
                                  s = !0;
                                  let t = T(c);
                                  l.del.forEach((e=>{
                                      t[e] = i[e]
                                  }
                                  )),
                                  En(e, [e.Transaction.prototype]),
                                  vn(e, [e.Transaction.prototype], u(t), t),
                                  n.schema = t;
                                  const o = z(h);
                                  let a;
                                  o && lt();
                                  const d = Ke.follow((()=>{
                                      if (a = h(n),
                                      a && o) {
                                          var e = ut.bind(null, null);
                                          a.then(e, e)
                                      }
                                  }
                                  ));
                                  return a && "function" == typeof a.then ? Ke.resolve(a) : d.then((()=>a))
                              }
                          }
                          )),
                          i.push((t=>{
                              s && Pt || function(e, t) {
                                  [].slice.call(t.db.objectStoreNames).forEach((n=>null == e[n] && t.db.deleteObjectStore(n)))
                              }(o._cfg.dbschema, t),
                              En(e, [e.Transaction.prototype]),
                              vn(e, [e.Transaction.prototype], e._storeNames, e._dbSchema),
                              n.schema = e._dbSchema
                          }
                          ))
                      }
                      )),
                      function e() {
                          return i.length ? Ke.resolve(i.shift()(n.idbtrans)).then(e) : Ke.resolve()
                      }().then((()=>{
                          var e, t;
                          t = r,
                          u(e = a).forEach((n=>{
                              t.db.objectStoreNames.contains(n) || _n(t, n, e[n].primKey, e[n].indexes)
                          }
                          ))
                      }
                      ))
                  }(e, t, o, n).catch(a)
              }
              ))
          }
          function On(e, t) {
              const n = {
                  del: [],
                  add: [],
                  change: []
              };
              let r;
              for (r in e)
                  t[r] || n.del.push(r);
              for (r in t) {
                  const i = e[r]
                    , o = t[r];
                  if (i) {
                      const e = {
                          name: r,
                          def: o,
                          recreate: !1,
                          del: [],
                          add: [],
                          change: []
                      };
                      if ("" + (i.primKey.keyPath || "") != "" + (o.primKey.keyPath || "") || i.primKey.auto !== o.primKey.auto && !Lt)
                          e.recreate = !0,
                          n.change.push(e);
                      else {
                          const t = i.idxByName
                            , r = o.idxByName;
                          let a;
                          for (a in t)
                              r[a] || e.del.push(a);
                          for (a in r) {
                              const n = t[a]
                                , i = r[a];
                              n ? n.src !== i.src && e.change.push(i) : e.add.push(i)
                          }
                          (e.del.length > 0 || e.add.length > 0 || e.change.length > 0) && n.change.push(e)
                      }
                  } else
                      n.add.push([r, o])
              }
              return n
          }
          function _n(e, t, n, r) {
              const i = e.db.createObjectStore(t, n.keyPath ? {
                  keyPath: n.keyPath,
                  autoIncrement: n.auto
              } : {
                  autoIncrement: n.auto
              });
              return r.forEach((e=>xn(i, e))),
              i
          }
          function xn(e, t) {
              e.createIndex(t.name, t.keyPath, {
                  unique: t.unique,
                  multiEntry: t.multi
              })
          }
          function Sn(e, t, n) {
              const r = {};
              return _(t.objectStoreNames, 0).forEach((e=>{
                  const t = n.objectStore(e);
                  let i = t.keyPath;
                  const o = cn(ln(i), i || "", !1, !1, !!t.autoIncrement, i && "string" != typeof i, !0)
                    , a = [];
                  for (let e = 0; e < t.indexNames.length; ++e) {
                      const n = t.index(t.indexNames[e]);
                      i = n.keyPath;
                      var s = cn(n.name, i, !!n.unique, !!n.multiEntry, !1, i && "string" != typeof i, !1);
                      a.push(s)
                  }
                  r[e] = un(e, o, a)
              }
              )),
              r
          }
          function Ln({_novip: e}, t, n) {
              const r = n.db.objectStoreNames;
              for (let i = 0; i < r.length; ++i) {
                  const o = r[i]
                    , a = n.objectStore(o);
                  e._hasGetAll = "getAll"in a;
                  for (let e = 0; e < a.indexNames.length; ++e) {
                      const n = a.indexNames[e]
                        , r = a.index(n).keyPath
                        , i = "string" == typeof r ? r : "[" + _(r).join("+") + "]";
                      if (t[o]) {
                          const e = t[o].idxByName[i];
                          e && (e.name = n,
                          delete t[o].idxByName[i],
                          t[o].idxByName[n] = e)
                      }
                  }
              }
              "undefined" != typeof navigator && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && l.WorkerGlobalScope && l instanceof l.WorkerGlobalScope && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604 && (e._hasGetAll = !1)
          }
          class Pn {
              _parseStoresSpec(e, t) {
                  u(e).forEach((n=>{
                      if (null !== e[n]) {
                          var r = e[n].split(",").map(((e,t)=>{
                              const n = (e = e.trim()).replace(/([&*]|\+\+)/g, "")
                                , r = /^\[/.test(n) ? n.match(/^\[(.*)\]$/)[1].split("+") : n;
                              return cn(n, r || null, /\&/.test(e), /\*/.test(e), /\+\+/.test(e), h(r), 0 === t)
                          }
                          ))
                            , i = r.shift();
                          if (i.multi)
                              throw new se.Schema("Primary key cannot be multi-valued");
                          r.forEach((e=>{
                              if (e.auto)
                                  throw new se.Schema("Only primary key can be marked as autoIncrement (++)");
                              if (!e.keyPath)
                                  throw new se.Schema("Index must have a name and cannot be an empty string")
                          }
                          )),
                          t[n] = un(n, i, r)
                      }
                  }
                  ))
              }
              stores(e) {
                  const t = this.db;
                  this._cfg.storesSource = this._cfg.storesSource ? d(this._cfg.storesSource, e) : e;
                  const n = t._versions
                    , r = {};
                  let i = {};
                  return n.forEach((e=>{
                      d(r, e._cfg.storesSource),
                      i = e._cfg.dbschema = {},
                      e._parseStoresSpec(r, i)
                  }
                  )),
                  t._dbSchema = i,
                  En(t, [t._allTables, t, t.Transaction.prototype]),
                  vn(t, [t._allTables, t, t.Transaction.prototype, this._cfg.tables], u(i), i),
                  t._storeNames = u(i),
                  this
              }
              upgrade(e) {
                  return this._cfg.contentUpgrade = ve(this._cfg.contentUpgrade || ue, e),
                  this
              }
          }
          function kn(e, t) {
              let n = e._dbNamesDB;
              return n || (n = e._dbNamesDB = new Yn("__dbnames",{
                  addons: [],
                  indexedDB: e,
                  IDBKeyRange: t
              }),
              n.version(1).stores({
                  dbnames: "name"
              })),
              n.table("dbnames")
          }
          function Gn(e) {
              return e && "function" == typeof e.databases
          }
          function Tn(e) {
              return ct((function() {
                  return je.letThrough = !0,
                  e()
              }
              ))
          }
          function Dn() {
              var e;
              return !navigator.userAgentData && /Safari\//.test(navigator.userAgent) && !/Chrom(e|ium)\//.test(navigator.userAgent) && indexedDB.databases ? new Promise((function(t) {
                  var n = function() {
                      return indexedDB.databases().finally(t)
                  };
                  e = setInterval(n, 100),
                  n()
              }
              )).finally((function() {
                  return clearInterval(e)
              }
              )) : Promise.resolve()
          }
          function An(e) {
              var t = t=>e.next(t)
                , n = i(t)
                , r = i((t=>e.throw(t)));
              function i(e) {
                  return t=>{
                      var i = e(t)
                        , o = i.value;
                      return i.done ? o : o && "function" == typeof o.then ? o.then(n, r) : h(o) ? Promise.all(o).then(n, r) : n(o)
                  }
              }
              return i(t)()
          }
          function Cn(e, t, n) {
              var r = arguments.length;
              if (r < 2)
                  throw new se.InvalidArgument("Too few arguments");
              for (var i = new Array(r - 1); --r; )
                  i[r - 1] = arguments[r];
              n = i.pop();
              var o = A(i);
              return [e, o, n]
          }
          function Nn(e, t, n, r, i) {
              return Ke.resolve().then((()=>{
                  const o = je.transless || je
                    , a = e._createTransaction(t, n, e._dbSchema, r)
                    , s = {
                      trans: a,
                      transless: o
                  };
                  if (r)
                      a.idbtrans = r.idbtrans;
                  else
                      try {
                          a.create(),
                          e._state.PR1398_maxLoop = 3
                      } catch (r) {
                          return r.name === oe.InvalidState && e.isOpen() && --e._state.PR1398_maxLoop > 0 ? (console.warn("Dexie: Need to reopen db"),
                          e._close(),
                          e.open().then((()=>Nn(e, t, n, null, i)))) : wt(r)
                      }
                  const c = z(i);
                  let l;
                  c && lt();
                  const u = Ke.follow((()=>{
                      if (l = i.call(a, a),
                      l)
                          if (c) {
                              var e = ut.bind(null, null);
                              l.then(e, e)
                          } else
                              "function" == typeof l.next && "function" == typeof l.throw && (l = An(l))
                  }
                  ), s);
                  return (l && "function" == typeof l.then ? Ke.resolve(l).then((e=>a.active ? e : wt(new se.PrematureCommit("Transaction committed too early. See http://bit.ly/2kdckMn")))) : u.then((()=>l))).then((e=>(r && a._resolve(),
                  a._completion.then((()=>e))))).catch((e=>(a._reject(e),
                  wt(e))))
              }
              ))
          }
          function In(e, t, n) {
              const r = h(e) ? e.slice() : [e];
              for (let e = 0; e < n; ++e)
                  r.push(t);
              return r
          }
          const jn = {
              stack: "dbcore",
              name: "VirtualIndexMiddleware",
              level: 1,
              create: function(e) {
                  return {
                      ...e,
                      table(t) {
                          const n = e.table(t)
                            , {schema: r} = n
                            , i = {}
                            , o = [];
                          function a(e, t, n) {
                              const r = mn(e)
                                , s = i[r] = i[r] || []
                                , c = null == e ? 0 : "string" == typeof e ? 1 : e.length
                                , l = t > 0
                                , u = {
                                  ...n,
                                  isVirtual: l,
                                  keyTail: t,
                                  keyLength: c,
                                  extractKey: dn(e),
                                  unique: !l && n.unique
                              };
                              return s.push(u),
                              u.isPrimaryKey || o.push(u),
                              c > 1 && a(2 === c ? e[0] : e.slice(0, c - 1), t + 1, n),
                              s.sort(((e,t)=>e.keyTail - t.keyTail)),
                              u
                          }
                          const s = a(r.primaryKey.keyPath, 0, r.primaryKey);
                          i[":id"] = [s];
                          for (const e of r.indexes)
                              a(e.keyPath, 0, e);
                          function c(t) {
                              const n = t.query.index;
                              return n.isVirtual ? {
                                  ...t,
                                  query: {
                                      index: n,
                                      range: (r = t.query.range,
                                      i = n.keyTail,
                                      {
                                          type: 1 === r.type ? 2 : r.type,
                                          lower: In(r.lower, r.lowerOpen ? e.MAX_KEY : e.MIN_KEY, i),
                                          lowerOpen: !0,
                                          upper: In(r.upper, r.upperOpen ? e.MIN_KEY : e.MAX_KEY, i),
                                          upperOpen: !0
                                      })
                                  }
                              } : t;
                              var r, i
                          }
                          const l = {
                              ...n,
                              schema: {
                                  ...r,
                                  primaryKey: s,
                                  indexes: o,
                                  getIndexByKeyPath: function(e) {
                                      const t = i[mn(e)];
                                      return t && t[0]
                                  }
                              },
                              count: e=>n.count(c(e)),
                              query: e=>n.query(c(e)),
                              openCursor(t) {
                                  const {keyTail: r, isVirtual: i, keyLength: o} = t.query.index;
                                  return i ? n.openCursor(c(t)).then((n=>n && function(n) {
                                      const i = Object.create(n, {
                                          continue: {
                                              value: function(i) {
                                                  null != i ? n.continue(In(i, t.reverse ? e.MAX_KEY : e.MIN_KEY, r)) : t.unique ? n.continue(n.key.slice(0, o).concat(t.reverse ? e.MIN_KEY : e.MAX_KEY, r)) : n.continue()
                                              }
                                          },
                                          continuePrimaryKey: {
                                              value(t, i) {
                                                  n.continuePrimaryKey(In(t, e.MAX_KEY, r), i)
                                              }
                                          },
                                          primaryKey: {
                                              get: ()=>n.primaryKey
                                          },
                                          key: {
                                              get() {
                                                  const e = n.key;
                                                  return 1 === o ? e[0] : e.slice(0, o)
                                              }
                                          },
                                          value: {
                                              get: ()=>n.value
                                          }
                                      });
                                      return i
                                  }(n))) : n.openCursor(t)
                              }
                          };
                          return l
                      }
                  }
              }
          };
          function Rn(e, t, n, r) {
              return n = n || {},
              r = r || "",
              u(e).forEach((i=>{
                  if (m(t, i)) {
                      var o = e[i]
                        , a = t[i];
                      if ("object" == typeof o && "object" == typeof a && o && a) {
                          const e = B(o);
                          e !== B(a) ? n[r + i] = t[i] : "Object" === e ? Rn(o, a, n, r + i + ".") : o !== a && (n[r + i] = t[i])
                      } else
                          o !== a && (n[r + i] = t[i])
                  } else
                      n[r + i] = void 0
              }
              )),
              u(t).forEach((i=>{
                  m(e, i) || (n[r + i] = t[i])
              }
              )),
              n
          }
          const Mn = {
              stack: "dbcore",
              name: "HooksMiddleware",
              level: 2,
              create: e=>({
                  ...e,
                  table(t) {
                      const n = e.table(t)
                        , {primaryKey: r} = n.schema
                        , i = {
                          ...n,
                          mutate(e) {
                              const i = je.trans
                                , {deleting: o, creating: a, updating: s} = i.table(t).hook;
                              switch (e.type) {
                              case "add":
                                  if (a.fire === ue)
                                      break;
                                  return i._promise("readwrite", (()=>c(e)), !0);
                              case "put":
                                  if (a.fire === ue && s.fire === ue)
                                      break;
                                  return i._promise("readwrite", (()=>c(e)), !0);
                              case "delete":
                                  if (o.fire === ue)
                                      break;
                                  return i._promise("readwrite", (()=>c(e)), !0);
                              case "deleteRange":
                                  if (o.fire === ue)
                                      break;
                                  return i._promise("readwrite", (()=>function(e) {
                                      return l(e.trans, e.range, 1e4)
                                  }(e)), !0)
                              }
                              return n.mutate(e);
                              function c(e) {
                                  const t = je.trans
                                    , i = e.keys || function(e, t) {
                                      return "delete" === t.type ? t.keys : t.keys || t.values.map(e.extractKey)
                                  }(r, e);
                                  if (!i)
                                      throw new Error("Keys missing");
                                  return "delete" !== (e = "add" === e.type || "put" === e.type ? {
                                      ...e,
                                      keys: i
                                  } : {
                                      ...e
                                  }).type && (e.values = [...e.values]),
                                  e.keys && (e.keys = [...e.keys]),
                                  function(e, t, n) {
                                      return "add" === t.type ? Promise.resolve([]) : e.getMany({
                                          trans: t.trans,
                                          keys: n,
                                          cache: "immutable"
                                      })
                                  }(n, e, i).then((c=>{
                                      const l = i.map(((n,i)=>{
                                          const l = c[i]
                                            , u = {
                                              onerror: null,
                                              onsuccess: null
                                          };
                                          if ("delete" === e.type)
                                              o.fire.call(u, n, l, t);
                                          else if ("add" === e.type || void 0 === l) {
                                              const o = a.fire.call(u, n, e.values[i], t);
                                              null == n && null != o && (n = o,
                                              e.keys[i] = n,
                                              r.outbound || G(e.values[i], r.keyPath, n))
                                          } else {
                                              const r = Rn(l, e.values[i])
                                                , o = s.fire.call(u, r, n, l, t);
                                              if (o) {
                                                  const t = e.values[i];
                                                  Object.keys(o).forEach((e=>{
                                                      m(t, e) ? t[e] = o[e] : G(t, e, o[e])
                                                  }
                                                  ))
                                              }
                                          }
                                          return u
                                      }
                                      ));
                                      return n.mutate(e).then((({failures: t, results: n, numFailures: r, lastResult: o})=>{
                                          for (let r = 0; r < i.length; ++r) {
                                              const o = n ? n[r] : i[r]
                                                , a = l[r];
                                              null == o ? a.onerror && a.onerror(t[r]) : a.onsuccess && a.onsuccess("put" === e.type && c[r] ? e.values[r] : o)
                                          }
                                          return {
                                              failures: t,
                                              results: n,
                                              numFailures: r,
                                              lastResult: o
                                          }
                                      }
                                      )).catch((e=>(l.forEach((t=>t.onerror && t.onerror(e))),
                                      Promise.reject(e))))
                                  }
                                  ))
                              }
                              function l(e, t, i) {
                                  return n.query({
                                      trans: e,
                                      values: !1,
                                      query: {
                                          index: r,
                                          range: t
                                      },
                                      limit: i
                                  }).then((({result: n})=>c({
                                      type: "delete",
                                      keys: n,
                                      trans: e
                                  }).then((r=>r.numFailures > 0 ? Promise.reject(r.failures[0]) : n.length < i ? {
                                      failures: [],
                                      numFailures: 0,
                                      lastResult: void 0
                                  } : l(e, {
                                      ...t,
                                      lower: n[n.length - 1],
                                      lowerOpen: !0
                                  }, i)))))
                              }
                          }
                      };
                      return i
                  }
              })
          };
          function Bn(e, t, n) {
              try {
                  if (!t)
                      return null;
                  if (t.keys.length < e.length)
                      return null;
                  const r = [];
                  for (let i = 0, o = 0; i < t.keys.length && o < e.length; ++i)
                      0 === Ut(t.keys[i], e[o]) && (r.push(n ? j(t.values[i]) : t.values[i]),
                      ++o);
                  return r.length === e.length ? r : null
              } catch (e) {
                  return null
              }
          }
          const Kn = {
              stack: "dbcore",
              level: -1,
              create: e=>({
                  table: t=>{
                      const n = e.table(t);
                      return {
                          ...n,
                          getMany: e=>{
                              if (!e.cache)
                                  return n.getMany(e);
                              const t = Bn(e.keys, e.trans._cache, "clone" === e.cache);
                              return t ? Ke.resolve(t) : n.getMany(e).then((t=>(e.trans._cache = {
                                  keys: e.keys,
                                  values: "clone" === e.cache ? j(t) : t
                              },
                              t)))
                          }
                          ,
                          mutate: e=>("add" !== e.type && (e.trans._cache = null),
                          n.mutate(e))
                      }
                  }
              })
          };
          function Fn(e) {
              return !("from"in e)
          }
          const qn = function(e, t) {
              if (!this) {
                  const t = new qn;
                  return e && "d"in e && d(t, e),
                  t
              }
              d(this, arguments.length ? {
                  d: 1,
                  from: e,
                  to: arguments.length > 1 ? t : e
              } : {
                  d: 0
              })
          };
          function Un(e, t, n) {
              const r = Ut(t, n);
              if (isNaN(r))
                  return;
              if (r > 0)
                  throw RangeError();
              if (Fn(e))
                  return d(e, {
                      from: t,
                      to: n,
                      d: 1
                  });
              const i = e.l
                , o = e.r;
              if (Ut(n, e.from) < 0)
                  return i ? Un(i, t, n) : e.l = {
                      from: t,
                      to: n,
                      d: 1,
                      l: null,
                      r: null
                  },
                  Wn(e);
              if (Ut(t, e.to) > 0)
                  return o ? Un(o, t, n) : e.r = {
                      from: t,
                      to: n,
                      d: 1,
                      l: null,
                      r: null
                  },
                  Wn(e);
              Ut(t, e.from) < 0 && (e.from = t,
              e.l = null,
              e.d = o ? o.d + 1 : 1),
              Ut(n, e.to) > 0 && (e.to = n,
              e.r = null,
              e.d = e.l ? e.l.d + 1 : 1);
              const a = !e.r;
              i && !e.l && zn(e, i),
              o && a && zn(e, o)
          }
          function zn(e, t) {
              Fn(t) || function e(t, {from: n, to: r, l: i, r: o}) {
                  Un(t, n, r),
                  i && e(t, i),
                  o && e(t, o)
              }(e, t)
          }
          function $n(e) {
              let t = Fn(e) ? null : {
                  s: 0,
                  n: e
              };
              return {
                  next(e) {
                      const n = arguments.length > 0;
                      for (; t; )
                          switch (t.s) {
                          case 0:
                              if (t.s = 1,
                              n)
                                  for (; t.n.l && Ut(e, t.n.from) < 0; )
                                      t = {
                                          up: t,
                                          n: t.n.l,
                                          s: 1
                                      };
                              else
                                  for (; t.n.l; )
                                      t = {
                                          up: t,
                                          n: t.n.l,
                                          s: 1
                                      };
                          case 1:
                              if (t.s = 2,
                              !n || Ut(e, t.n.to) <= 0)
                                  return {
                                      value: t.n,
                                      done: !1
                                  };
                          case 2:
                              if (t.n.r) {
                                  t.s = 3,
                                  t = {
                                      up: t,
                                      n: t.n.r,
                                      s: 0
                                  };
                                  continue
                              }
                          case 3:
                              t = t.up
                          }
                      return {
                          done: !0
                      }
                  }
              }
          }
          function Wn(e) {
              var t, n;
              const r = ((null === (t = e.r) || void 0 === t ? void 0 : t.d) || 0) - ((null === (n = e.l) || void 0 === n ? void 0 : n.d) || 0)
                , i = r > 1 ? "r" : r < -1 ? "l" : "";
              if (i) {
                  const t = "r" === i ? "l" : "r"
                    , n = {
                      ...e
                  }
                    , r = e[i];
                  e.from = r.from,
                  e.to = r.to,
                  e[i] = r[i],
                  n[i] = r[t],
                  e[t] = n,
                  n.d = Hn(n)
              }
              e.d = Hn(e)
          }
          function Hn({r: e, l: t}) {
              return (e ? t ? Math.max(e.d, t.d) : e.d : t ? t.d : 0) + 1
          }
          y(qn.prototype, {
              add(e) {
                  return zn(this, e),
                  this
              },
              addKey(e) {
                  return Un(this, e, e),
                  this
              },
              addKeys(e) {
                  return e.forEach((e=>Un(this, e, e))),
                  this
              },
              [K]() {
                  return $n(this)
              }
          });
          const Vn = {
              stack: "dbcore",
              level: 0,
              create: e=>{
                  const t = e.schema.name
                    , n = new qn(e.MIN_KEY,e.MAX_KEY);
                  return {
                      ...e,
                      table: r=>{
                          const i = e.table(r)
                            , {schema: o} = i
                            , {primaryKey: a} = o
                            , {extractKey: s, outbound: c} = a
                            , l = {
                              ...i,
                              mutate: e=>{
                                  const a = e.trans
                                    , s = a.mutatedParts || (a.mutatedParts = {})
                                    , c = e=>{
                                      const n = `idb://${t}/${r}/${e}`;
                                      return s[n] || (s[n] = new qn)
                                  }
                                    , l = c("")
                                    , u = c(":dels")
                                    , {type: d} = e;
                                  let[f,p] = "deleteRange" === e.type ? [e.range] : "delete" === e.type ? [e.keys] : e.values.length < 50 ? [[], e.values] : [];
                                  const m = e.trans._cache;
                                  return i.mutate(e).then((e=>{
                                      if (h(f)) {
                                          "delete" !== d && (f = e.results),
                                          l.addKeys(f);
                                          const t = Bn(f, m);
                                          t || "add" === d || u.addKeys(f),
                                          (t || p) && function(e, t, n, r) {
                                              t.indexes.forEach((function(t) {
                                                  const i = e(t.name || "");
                                                  function o(e) {
                                                      return null != e ? t.extractKey(e) : null
                                                  }
                                                  const a = e=>t.multiEntry && h(e) ? e.forEach((e=>i.addKey(e))) : i.addKey(e);
                                                  (n || r).forEach(((e,t)=>{
                                                      const i = n && o(n[t])
                                                        , s = r && o(r[t]);
                                                      0 !== Ut(i, s) && (null != i && a(i),
                                                      null != s && a(s))
                                                  }
                                                  ))
                                              }
                                              ))
                                          }(c, o, t, p)
                                      } else if (f) {
                                          const e = {
                                              from: f.lower,
                                              to: f.upper
                                          };
                                          u.add(e),
                                          l.add(e)
                                      } else
                                          l.add(n),
                                          u.add(n),
                                          o.indexes.forEach((e=>c(e.name).add(n)));
                                      return e
                                  }
                                  ))
                              }
                          }
                            , d = ({query: {index: t, range: n}})=>{
                              var r, i;
                              return [t, new qn(null !== (r = n.lower) && void 0 !== r ? r : e.MIN_KEY,null !== (i = n.upper) && void 0 !== i ? i : e.MAX_KEY)]
                          }
                            , f = {
                              get: e=>[a, new qn(e.key)],
                              getMany: e=>[a, (new qn).addKeys(e.keys)],
                              count: d,
                              query: d,
                              openCursor: d
                          };
                          return u(f).forEach((e=>{
                              l[e] = function(o) {
                                  const {subscr: a} = je;
                                  if (a) {
                                      const l = e=>{
                                          const n = `idb://${t}/${r}/${e}`;
                                          return a[n] || (a[n] = new qn)
                                      }
                                        , u = l("")
                                        , h = l(":dels")
                                        , [d,p] = f[e](o);
                                      if (l(d.name || "").add(p),
                                      !d.isPrimaryKey) {
                                          if ("count" !== e) {
                                              const t = "query" === e && c && o.values && i.query({
                                                  ...o,
                                                  values: !1
                                              });
                                              return i[e].apply(this, arguments).then((n=>{
                                                  if ("query" === e) {
                                                      if (c && o.values)
                                                          return t.then((({result: e})=>(u.addKeys(e),
                                                          n)));
                                                      const e = o.values ? n.result.map(s) : n.result;
                                                      o.values ? u.addKeys(e) : h.addKeys(e)
                                                  } else if ("openCursor" === e) {
                                                      const e = n
                                                        , t = o.values;
                                                      return e && Object.create(e, {
                                                          key: {
                                                              get: ()=>(h.addKey(e.primaryKey),
                                                              e.key)
                                                          },
                                                          primaryKey: {
                                                              get() {
                                                                  const t = e.primaryKey;
                                                                  return h.addKey(t),
                                                                  t
                                                              }
                                                          },
                                                          value: {
                                                              get: ()=>(t && u.addKey(e.primaryKey),
                                                              e.value)
                                                          }
                                                      })
                                                  }
                                                  return n
                                              }
                                              ))
                                          }
                                          h.add(n)
                                      }
                                  }
                                  return i[e].apply(this, arguments)
                              }
                          }
                          )),
                          l
                      }
                  }
              }
          };
          class Yn {
              constructor(e, t) {
                  this._middlewares = {},
                  this.verno = 0;
                  const n = Yn.dependencies;
                  this._options = t = {
                      addons: Yn.addons,
                      autoOpen: !0,
                      indexedDB: n.indexedDB,
                      IDBKeyRange: n.IDBKeyRange,
                      ...t
                  },
                  this._deps = {
                      indexedDB: t.indexedDB,
                      IDBKeyRange: t.IDBKeyRange
                  };
                  const {addons: r} = t;
                  this._dbSchema = {},
                  this._versions = [],
                  this._storeNames = [],
                  this._allTables = {},
                  this.idbdb = null,
                  this._novip = this;
                  const i = {
                      dbOpenError: null,
                      isBeingOpened: !1,
                      onReadyBeingFired: null,
                      openComplete: !1,
                      dbReadyResolve: ue,
                      dbReadyPromise: null,
                      cancelOpen: ue,
                      openCanceller: null,
                      autoSchema: !0,
                      PR1398_maxLoop: 3
                  };
                  var o;
                  i.dbReadyPromise = new Ke((e=>{
                      i.dbReadyResolve = e
                  }
                  )),
                  i.openCanceller = new Ke(((e,t)=>{
                      i.cancelOpen = t
                  }
                  )),
                  this._state = i,
                  this.name = e,
                  this.on = Nt(this, "populate", "blocked", "versionchange", "close", {
                      ready: [ve, ue]
                  }),
                  this.on.ready.subscribe = x(this.on.ready.subscribe, (e=>(t,n)=>{
                      Yn.vip((()=>{
                          const r = this._state;
                          if (r.openComplete)
                              r.dbOpenError || Ke.resolve().then(t),
                              n && e(t);
                          else if (r.onReadyBeingFired)
                              r.onReadyBeingFired.push(t),
                              n && e(t);
                          else {
                              e(t);
                              const r = this;
                              n || e((function e() {
                                  r.on.ready.unsubscribe(t),
                                  r.on.ready.unsubscribe(e)
                              }
                              ))
                          }
                      }
                      ))
                  }
                  )),
                  this.Collection = (o = this,
                  It(Wt.prototype, (function(e, t) {
                      this.db = o;
                      let n = Dt
                        , r = null;
                      if (t)
                          try {
                              n = t()
                          } catch (e) {
                              r = e
                          }
                      const i = e._ctx
                        , a = i.table
                        , s = a.hook.reading.fire;
                      this._ctx = {
                          table: a,
                          index: i.index,
                          isPrimKey: !i.index || a.schema.primKey.keyPath && i.index === a.schema.primKey.name,
                          range: n,
                          keysOnly: !1,
                          dir: "next",
                          unique: "",
                          algorithm: null,
                          filter: null,
                          replayFilter: null,
                          justLimit: !0,
                          isMatch: null,
                          offset: 0,
                          limit: 1 / 0,
                          error: r,
                          or: i.or,
                          valueMapper: s !== he ? s : null
                      }
                  }
                  ))),
                  this.Table = function(e) {
                      return It(Ct.prototype, (function(t, n, r) {
                          this.db = e,
                          this._tx = r,
                          this.name = t,
                          this.schema = n,
                          this.hook = e._allTables[t] ? e._allTables[t].hook : Nt(null, {
                              creating: [pe, ue],
                              reading: [de, he],
                              updating: [ye, ue],
                              deleting: [me, ue]
                          })
                      }
                      ))
                  }(this),
                  this.Transaction = function(e) {
                      return It(sn.prototype, (function(t, n, r, i, o) {
                          this.db = e,
                          this.mode = t,
                          this.storeNames = n,
                          this.schema = r,
                          this.chromeTransactionDurability = i,
                          this.idbtrans = null,
                          this.on = Nt(this, "complete", "error", "abort"),
                          this.parent = o || null,
                          this.active = !0,
                          this._reculock = 0,
                          this._blockedFuncs = [],
                          this._resolve = null,
                          this._reject = null,
                          this._waitingFor = null,
                          this._waitingQueue = null,
                          this._spinCount = 0,
                          this._completion = new Ke(((e,t)=>{
                              this._resolve = e,
                              this._reject = t
                          }
                          )),
                          this._completion.then((()=>{
                              this.active = !1,
                              this.on.complete.fire()
                          }
                          ), (e=>{
                              var t = this.active;
                              return this.active = !1,
                              this.on.error.fire(e),
                              this.parent ? this.parent._reject(e) : t && this.idbtrans && this.idbtrans.abort(),
                              wt(e)
                          }
                          ))
                      }
                      ))
                  }(this),
                  this.Version = function(e) {
                      return It(Pn.prototype, (function(t) {
                          this.db = e,
                          this._cfg = {
                              version: t,
                              storesSource: null,
                              dbschema: {},
                              tables: {},
                              contentUpgrade: null
                          }
                      }
                      ))
                  }(this),
                  this.WhereClause = function(e) {
                      return It(nn.prototype, (function(t, n, r) {
                          this.db = e,
                          this._ctx = {
                              table: t,
                              index: ":id" === n ? null : n,
                              or: r
                          };
                          const i = e._deps.indexedDB;
                          if (!i)
                              throw new se.MissingAPI;
                          this._cmp = this._ascending = i.cmp.bind(i),
                          this._descending = (e,t)=>i.cmp(t, e),
                          this._max = (e,t)=>i.cmp(e, t) > 0 ? e : t,
                          this._min = (e,t)=>i.cmp(e, t) < 0 ? e : t,
                          this._IDBKeyRange = e._deps.IDBKeyRange
                      }
                      ))
                  }(this),
                  this.on("versionchange", (e=>{
                      e.newVersion > 0 ? console.warn(`Another connection wants to upgrade database '${this.name}'. Closing db now to resume the upgrade.`) : console.warn(`Another connection wants to delete database '${this.name}'. Closing db now to resume the delete request.`),
                      this.close()
                  }
                  )),
                  this.on("blocked", (e=>{
                      !e.newVersion || e.newVersion < e.oldVersion ? console.warn(`Dexie.delete('${this.name}') was blocked`) : console.warn(`Upgrade '${this.name}' blocked by other connection holding version ${e.oldVersion / 10}`)
                  }
                  )),
                  this._maxKey = hn(t.IDBKeyRange),
                  this._createTransaction = (e,t,n,r)=>new this.Transaction(e,t,n,this._options.chromeTransactionDurability,r),
                  this._fireOnBlocked = e=>{
                      this.on("blocked").fire(e),
                      St.filter((e=>e.name === this.name && e !== this && !e._state.vcFired)).map((t=>t.on("versionchange").fire(e)))
                  }
                  ,
                  this.use(jn),
                  this.use(Mn),
                  this.use(Vn),
                  this.use(Kn),
                  this.vip = Object.create(this, {
                      _vip: {
                          value: !0
                      }
                  }),
                  r.forEach((e=>e(this)))
              }
              version(e) {
                  if (isNaN(e) || e < .1)
                      throw new se.Type("Given version is not a positive number");
                  if (e = Math.round(10 * e) / 10,
                  this.idbdb || this._state.isBeingOpened)
                      throw new se.Schema("Cannot add version when database is open");
                  this.verno = Math.max(this.verno, e);
                  const t = this._versions;
                  var n = t.filter((t=>t._cfg.version === e))[0];
                  return n || (n = new this.Version(e),
                  t.push(n),
                  t.sort(bn),
                  n.stores({}),
                  this._state.autoSchema = !1,
                  n)
              }
              _whenReady(e) {
                  return this.idbdb && (this._state.openComplete || je.letThrough || this._vip) ? e() : new Ke(((e,t)=>{
                      if (this._state.openComplete)
                          return t(new se.DatabaseClosed(this._state.dbOpenError));
                      if (!this._state.isBeingOpened) {
                          if (!this._options.autoOpen)
                              return void t(new se.DatabaseClosed);
                          this.open().catch(ue)
                      }
                      this._state.dbReadyPromise.then(e, t)
                  }
                  )).then(e)
              }
              use({stack: e, create: t, level: n, name: r}) {
                  r && this.unuse({
                      stack: e,
                      name: r
                  });
                  const i = this._middlewares[e] || (this._middlewares[e] = []);
                  return i.push({
                      stack: e,
                      create: t,
                      level: null == n ? 10 : n,
                      name: r
                  }),
                  i.sort(((e,t)=>e.level - t.level)),
                  this
              }
              unuse({stack: e, name: t, create: n}) {
                  return e && this._middlewares[e] && (this._middlewares[e] = this._middlewares[e].filter((e=>n ? e.create !== n : !!t && e.name !== t))),
                  this
              }
              open() {
                  return function(e) {
                      const t = e._state
                        , {indexedDB: n} = e._deps;
                      if (t.isBeingOpened || e.idbdb)
                          return t.dbReadyPromise.then((()=>t.dbOpenError ? wt(t.dbOpenError) : e));
                      W && (t.openCanceller._stackHolder = X()),
                      t.isBeingOpened = !0,
                      t.dbOpenError = null,
                      t.openComplete = !1;
                      const r = t.openCanceller;
                      function i() {
                          if (t.openCanceller !== r)
                              throw new se.DatabaseClosed("db.open() was cancelled")
                      }
                      let o = t.dbReadyResolve
                        , a = null
                        , s = !1;
                      return Ke.race([r, ("undefined" == typeof navigator ? Ke.resolve() : Dn()).then((()=>new Ke(((r,o)=>{
                          if (i(),
                          !n)
                              throw new se.MissingAPI;
                          const c = e.name
                            , l = t.autoSchema ? n.open(c) : n.open(c, Math.round(10 * e.verno));
                          if (!l)
                              throw new se.MissingAPI;
                          l.onerror = rn(o),
                          l.onblocked = tt(e._fireOnBlocked),
                          l.onupgradeneeded = tt((r=>{
                              if (a = l.transaction,
                              t.autoSchema && !e._options.allowEmptyDB) {
                                  l.onerror = on,
                                  a.abort(),
                                  l.result.close();
                                  const e = n.deleteDatabase(c);
                                  e.onsuccess = e.onerror = tt((()=>{
                                      o(new se.NoSuchDatabase(`Database ${c} doesnt exist`))
                                  }
                                  ))
                              } else {
                                  a.onerror = rn(o);
                                  var i = r.oldVersion > Math.pow(2, 62) ? 0 : r.oldVersion;
                                  s = i < 1,
                                  e._novip.idbdb = l.result,
                                  wn(e, i / 10, a, o)
                              }
                          }
                          ), o),
                          l.onsuccess = tt((()=>{
                              a = null;
                              const n = e._novip.idbdb = l.result
                                , i = _(n.objectStoreNames);
                              if (i.length > 0)
                                  try {
                                      const r = n.transaction(1 === (o = i).length ? o[0] : o, "readonly");
                                      t.autoSchema ? function({_novip: e}, t, n) {
                                          e.verno = t.version / 10;
                                          const r = e._dbSchema = Sn(0, t, n);
                                          e._storeNames = _(t.objectStoreNames, 0),
                                          vn(e, [e._allTables], u(r), r)
                                      }(e, n, r) : (Ln(e, e._dbSchema, r),
                                      function(e, t) {
                                          const n = On(Sn(0, e.idbdb, t), e._dbSchema);
                                          return !(n.add.length || n.change.some((e=>e.add.length || e.change.length)))
                                      }(e, r) || console.warn("Dexie SchemaDiff: Schema was extended without increasing the number passed to db.version(). Some queries may fail.")),
                                      gn(e, r)
                                  } catch (e) {}
                              var o;
                              St.push(e),
                              n.onversionchange = tt((n=>{
                                  t.vcFired = !0,
                                  e.on("versionchange").fire(n)
                              }
                              )),
                              n.onclose = tt((t=>{
                                  e.on("close").fire(t)
                              }
                              )),
                              s && function({indexedDB: e, IDBKeyRange: t}, n) {
                                  !Gn(e) && "__dbnames" !== n && kn(e, t).put({
                                      name: n
                                  }).catch(ue)
                              }(e._deps, c),
                              r()
                          }
                          ), o)
                      }
                      ))))]).then((()=>(i(),
                      t.onReadyBeingFired = [],
                      Ke.resolve(Tn((()=>e.on.ready.fire(e.vip)))).then((function n() {
                          if (t.onReadyBeingFired.length > 0) {
                              let r = t.onReadyBeingFired.reduce(ve, ue);
                              return t.onReadyBeingFired = [],
                              Ke.resolve(Tn((()=>r(e.vip)))).then(n)
                          }
                      }
                      ))))).finally((()=>{
                          t.onReadyBeingFired = null,
                          t.isBeingOpened = !1
                      }
                      )).then((()=>e)).catch((n=>{
                          t.dbOpenError = n;
                          try {
                              a && a.abort()
                          } catch (e) {}
                          return r === t.openCanceller && e._close(),
                          wt(n)
                      }
                      )).finally((()=>{
                          t.openComplete = !0,
                          o()
                      }
                      ))
                  }(this)
              }
              _close() {
                  const e = this._state
                    , t = St.indexOf(this);
                  if (t >= 0 && St.splice(t, 1),
                  this.idbdb) {
                      try {
                          this.idbdb.close()
                      } catch (e) {}
                      this._novip.idbdb = null
                  }
                  e.dbReadyPromise = new Ke((t=>{
                      e.dbReadyResolve = t
                  }
                  )),
                  e.openCanceller = new Ke(((t,n)=>{
                      e.cancelOpen = n
                  }
                  ))
              }
              close() {
                  this._close();
                  const e = this._state;
                  this._options.autoOpen = !1,
                  e.dbOpenError = new se.DatabaseClosed,
                  e.isBeingOpened && e.cancelOpen(e.dbOpenError)
              }
              delete() {
                  const e = arguments.length > 0
                    , t = this._state;
                  return new Ke(((n,r)=>{
                      const i = ()=>{
                          this.close();
                          var e = this._deps.indexedDB.deleteDatabase(this.name);
                          e.onsuccess = tt((()=>{
                              !function({indexedDB: e, IDBKeyRange: t}, n) {
                                  !Gn(e) && "__dbnames" !== n && kn(e, t).delete(n).catch(ue)
                              }(this._deps, this.name),
                              n()
                          }
                          )),
                          e.onerror = rn(r),
                          e.onblocked = this._fireOnBlocked
                      }
                      ;
                      if (e)
                          throw new se.InvalidArgument("Arguments not allowed in db.delete()");
                      t.isBeingOpened ? t.dbReadyPromise.then(i) : i()
                  }
                  ))
              }
              backendDB() {
                  return this.idbdb
              }
              isOpen() {
                  return null !== this.idbdb
              }
              hasBeenClosed() {
                  const e = this._state.dbOpenError;
                  return e && "DatabaseClosed" === e.name
              }
              hasFailed() {
                  return null !== this._state.dbOpenError
              }
              dynamicallyOpened() {
                  return this._state.autoSchema
              }
              get tables() {
                  return u(this._allTables).map((e=>this._allTables[e]))
              }
              transaction() {
                  const e = Cn.apply(this, arguments);
                  return this._transaction.apply(this, e)
              }
              _transaction(e, t, n) {
                  let r = je.trans;
                  r && r.db === this && -1 === e.indexOf("!") || (r = null);
                  const i = -1 !== e.indexOf("?");
                  let o, a;
                  e = e.replace("!", "").replace("?", "");
                  try {
                      if (a = t.map((e=>{
                          var t = e instanceof this.Table ? e.name : e;
                          if ("string" != typeof t)
                              throw new TypeError("Invalid table argument to Dexie.transaction(). Only Table or String are allowed");
                          return t
                      }
                      )),
                      "r" == e || "readonly" === e)
                          o = "readonly";
                      else {
                          if ("rw" != e && "readwrite" != e)
                              throw new se.InvalidArgument("Invalid transaction mode: " + e);
                          o = "readwrite"
                      }
                      if (r) {
                          if ("readonly" === r.mode && "readwrite" === o) {
                              if (!i)
                                  throw new se.SubTransaction("Cannot enter a sub-transaction with READWRITE mode when parent transaction is READONLY");
                              r = null
                          }
                          r && a.forEach((e=>{
                              if (r && -1 === r.storeNames.indexOf(e)) {
                                  if (!i)
                                      throw new se.SubTransaction("Table " + e + " not included in parent transaction.");
                                  r = null
                              }
                          }
                          )),
                          i && r && !r.active && (r = null)
                      }
                  } catch (e) {
                      return r ? r._promise(null, ((t,n)=>{
                          n(e)
                      }
                      )) : wt(e)
                  }
                  const s = Nn.bind(null, this, o, a, r, n);
                  return r ? r._promise(o, s, "lock") : je.trans ? yt(je.transless, (()=>this._whenReady(s))) : this._whenReady(s)
              }
              table(e) {
                  if (!m(this._allTables, e))
                      throw new se.InvalidTable(`Table ${e} does not exist`);
                  return this._allTables[e]
              }
          }
          const Xn = "undefined" != typeof Symbol && "observable"in Symbol ? Symbol.observable : "@@observable";
          class Zn {
              constructor(e) {
                  this._subscribe = e
              }
              subscribe(e, t, n) {
                  return this._subscribe(e && "function" != typeof e ? e : {
                      next: e,
                      error: t,
                      complete: n
                  })
              }
              [Xn]() {
                  return this
              }
          }
          function Qn(e, t) {
              return u(t).forEach((n=>{
                  zn(e[n] || (e[n] = new qn), t[n])
              }
              )),
              e
          }
          let Jn;
          try {
              Jn = {
                  indexedDB: l.indexedDB || l.mozIndexedDB || l.webkitIndexedDB || l.msIndexedDB,
                  IDBKeyRange: l.IDBKeyRange || l.webkitIDBKeyRange
              }
          } catch (l) {
              Jn = {
                  indexedDB: null,
                  IDBKeyRange: null
              }
          }
          const er = Yn;
          function tr(e) {
              let t = nr;
              try {
                  nr = !0,
                  an.storagemutated.fire(e)
              } finally {
                  nr = t
              }
          }
          y(er, {
              ...le,
              delete: e=>new er(e,{
                  addons: []
              }).delete(),
              exists: e=>new er(e,{
                  addons: []
              }).open().then((e=>(e.close(),
              !0))).catch("NoSuchDatabaseError", (()=>!1)),
              getDatabaseNames(e) {
                  try {
                      return function({indexedDB: e, IDBKeyRange: t}) {
                          return Gn(e) ? Promise.resolve(e.databases()).then((e=>e.map((e=>e.name)).filter((e=>"__dbnames" !== e)))) : kn(e, t).toCollection().primaryKeys()
                      }(er.dependencies).then(e)
                  } catch (e) {
                      return wt(new se.MissingAPI)
                  }
              },
              defineClass: ()=>function(e) {
                  d(this, e)
              }
              ,
              ignoreTransaction: e=>je.trans ? yt(je.transless, e) : e(),
              vip: Tn,
              async: function(e) {
                  return function() {
                      try {
                          var t = An(e.apply(this, arguments));
                          return t && "function" == typeof t.then ? t : Ke.resolve(t)
                      } catch (e) {
                          return wt(e)
                      }
                  }
              },
              spawn: function(e, t, n) {
                  try {
                      var r = An(e.apply(n, t || []));
                      return r && "function" == typeof r.then ? r : Ke.resolve(r)
                  } catch (e) {
                      return wt(e)
                  }
              },
              currentTransaction: {
                  get: ()=>je.trans || null
              },
              waitFor: function(e, t) {
                  const n = Ke.resolve("function" == typeof e ? er.ignoreTransaction(e) : e).timeout(t || 6e4);
                  return je.trans ? je.trans.waitFor(n) : n
              },
              Promise: Ke,
              debug: {
                  get: ()=>W,
                  set: e=>{
                      H(e, "dexie" === e ? ()=>!0 : Gt)
                  }
              },
              derive: E,
              extend: d,
              props: y,
              override: x,
              Events: Nt,
              on: an,
              liveQuery: function(e) {
                  return new Zn((t=>{
                      const n = z(e);
                      let r = !1
                        , i = {}
                        , o = {};
                      const a = {
                          get closed() {
                              return r
                          },
                          unsubscribe: ()=>{
                              r = !0,
                              an.storagemutated.unsubscribe(h)
                          }
                      };
                      t.start && t.start(a);
                      let s = !1
                        , c = !1;
                      function l() {
                          return u(o).some((e=>i[e] && function(e, t) {
                              const n = $n(t);
                              let r = n.next();
                              if (r.done)
                                  return !1;
                              let i = r.value;
                              const o = $n(e);
                              let a = o.next(i.from)
                                , s = a.value;
                              for (; !r.done && !a.done; ) {
                                  if (Ut(s.from, i.to) <= 0 && Ut(s.to, i.from) >= 0)
                                      return !0;
                                  Ut(i.from, s.from) < 0 ? i = (r = n.next(s.from)).value : s = (a = o.next(i.from)).value
                              }
                              return !1
                          }(i[e], o[e])))
                      }
                      const h = e=>{
                          Qn(i, e),
                          l() && d()
                      }
                        , d = ()=>{
                          if (s || r)
                              return;
                          i = {};
                          const u = {}
                            , f = function(t) {
                              n && lt();
                              const r = ()=>ct(e, {
                                  subscr: t,
                                  trans: null
                              })
                                , i = je.trans ? yt(je.transless, r) : r();
                              return n && i.then(ut, ut),
                              i
                          }(u);
                          c || (an("storagemutated", h),
                          c = !0),
                          s = !0,
                          Promise.resolve(f).then((e=>{
                              s = !1,
                              r || (l() ? d() : (i = {},
                              o = u,
                              t.next && t.next(e)))
                          }
                          ), (e=>{
                              s = !1,
                              t.error && t.error(e),
                              a.unsubscribe()
                          }
                          ))
                      }
                      ;
                      return d(),
                      a
                  }
                  ))
              },
              extendObservabilitySet: Qn,
              getByKeyPath: k,
              setByKeyPath: G,
              delByKeyPath: function(e, t) {
                  "string" == typeof t ? G(e, t, void 0) : "length"in t && [].map.call(t, (function(t) {
                      G(e, t, void 0)
                  }
                  ))
              },
              shallowClone: T,
              deepClone: j,
              getObjectDiff: Rn,
              cmp: Ut,
              asap: L,
              minKey: -1 / 0,
              addons: [],
              connections: St,
              errnames: oe,
              dependencies: Jn,
              semVer: "3.2.2",
              version: "3.2.2".split(".").map((e=>parseInt(e))).reduce(((e,t,n)=>e + t / Math.pow(10, 2 * n)))
          }),
          er.maxKey = hn(er.dependencies.IDBKeyRange),
          "undefined" != typeof dispatchEvent && "undefined" != typeof addEventListener && (an("storagemutated", (e=>{
              if (!nr) {
                  let t;
                  Lt ? (t = document.createEvent("CustomEvent"),
                  t.initCustomEvent("x-storagemutated-1", !0, !0, e)) : t = new CustomEvent("x-storagemutated-1",{
                      detail: e
                  }),
                  nr = !0,
                  dispatchEvent(t),
                  nr = !1
              }
          }
          )),
          addEventListener("x-storagemutated-1", (({detail: e})=>{
              nr || tr(e)
          }
          )));
          let nr = !1;
          if ("undefined" != typeof BroadcastChannel) {
              const e = new BroadcastChannel("x-storagemutated-1");
              an("storagemutated", (t=>{
                  nr || e.postMessage(t)
              }
              )),
              e.onmessage = e=>{
                  e.data && tr(e.data)
              }
          } else if ("undefined" != typeof self && "undefined" != typeof navigator) {
              an("storagemutated", (e=>{
                  try {
                      nr || ("undefined" != typeof localStorage && localStorage.setItem("x-storagemutated-1", JSON.stringify({
                          trig: Math.random(),
                          changedParts: e
                      })),
                      "object" == typeof self.clients && [...self.clients.matchAll({
                          includeUncontrolled: !0
                      })].forEach((t=>t.postMessage({
                          type: "x-storagemutated-1",
                          changedParts: e
                      }))))
                  } catch (e) {}
              }
              )),
              "undefined" != typeof addEventListener && addEventListener("storage", (e=>{
                  if ("x-storagemutated-1" === e.key) {
                      const t = JSON.parse(e.newValue);
                      t && tr(t.changedParts)
                  }
              }
              ));
              const e = self.document && navigator.serviceWorker;
              e && e.addEventListener("message", (function({data: e}) {
                  e && "x-storagemutated-1" === e.type && tr(e.changedParts)
              }
              ))
          }
          Ke.rejectionMapper = function(e, t) {
              if (!e || e instanceof te || e instanceof TypeError || e instanceof SyntaxError || !e.name || !ce[e.name])
                  return e;
              var n = new ce[e.name](t || e.message,e);
              return "stack"in e && v(n, "stack", {
                  get: function() {
                      return this.inner.stack
                  }
              }),
              n
          }
          ,
          H(W, Gt);
          var rr = n(214)
            , ir = n.n(rr);
          const or = new class extends Yn {
              constructor() {
                  super("translate"),
                  this.version(.1).stores({
                      message: "id,text,translation"
                  })
              }
          }
            , ar = e=>ir()(e).toString();
          var sr, cr, lr, ur = n(298);
          !function(e) {
              e.SHOW_BROWSER_VIEW = "show-browser-view",
              e.HIDE_BROWSER_VIEW = "hide-browser-view",
              e.CLOSE_BROWSER_VIEW = "close-browser-view",
              e.CLOSE_ALL_BROWSER_VIEW = "close-all-browser-view",
              e.POST_MESSAGE_WEBVIEW = "post-message-webview",
              e.MESSAGE_PROXY = "message-proxy",
              e.CHECK_REQUEST_PROXY = "check-request-proxy",
              e.MENU_COLLAPSED_CHANGE = "menu-collapsed-change",
              e.SESSION_SETTING_COLLAPSED_CHANGE = "session-setting-collapsed-change",
              e.GET_VERSION = "get-version",
              e.CHECK_IS_MAC = "check-is-mac",
              e.WINDOW_MIN = "window-min",
              e.WINDOW_MAX = "window-max",
              e.WINDOW_CLOSE = "window-close",
              e.WINDOW_QUIT = "window-quit",
              e.WINDOW_EXIT = "window-exit",
              e.WINDOW_ALWAYS_ON_TOP = "window-always-on-top",
              e.BROWSER_VIEW_FINISH_LOAD = "browser-view-finish-load",
              e.SAVE_FILE = "save-file",
              e.SET_SYSTEM_MUTE = "set-system-mute",
              e.MOUSE_MOVE = "mouse-move",
              e.SHOW_SESSION_SETTING = "show-session-setting",
              e.HIDE_SESSION_SETTING = "hide-session-setting",
              e.UPDATE_DOWNLOAD_PROGRESS = "update-download-progress",
              e.UPDATE_BADGE = "update-badge"
          }(sr || (sr = {})),
          function(e) {
              e.CHANGE_TRANSLATE_LANGUAGE = "change-translate-language",
              e.GET_TRANSLATE_LANGUAGE = "get-translate-language",
              e.GET_SYSTEM_SETTING = "get-system-setting",
              e.SEND_UNREAD_MESSAGE_NUM = "send-unread-message-num",
              e.INIT_PAGE_DATA = "init-page-data",
              e.SEND_UPDATE_WORDS_NUM = "send-update-words-num",
              e.CHANGE_ALLOW_TRANSLATE_STATE = "change-allow-translate-state",
              e.SEND_ACCOUNT_INFO = "send-account-info",
              e.SEND_CONTACT_INFO = "send-contact-info",
              e.RELOAD_PAGE = "reload-page",
              e.SET_SESSION_SETTING = "set-session-setting",
              e.GET_SESSION_SETTING = "get-session-setting",
              e.GET_SESSION_CONTACT_INFO_LIST = "get-session-contact-info-list",
              e.SET_SESSION_CONTACT_INFO_LIST = "set-session-contact-info-list",
              e.GET_SESSION_CONTACT_INFO = "get-session-contact-info",
              e.SET_SESSION_CONTACT_INFO = "set-session-contact-info",
              e.FAST_REPLY_CLICK = "fast-reply-click"
          }(cr || (cr = {})),
          function(e) {
              e.SET_LOCAL_SESSION_SETTING = "set-local-session-setting"
          }(lr || (lr = {}));
          let hr = {};
          const dr = e=>{
              hr = e
          }
            , fr = ()=>hr;
          let pr = {};
          const mr = e=>{
              pr = e
          }
            , yr = ()=>pr
            , gr = e=>{
              const t = yr()?.translate || {};
              if (!e)
                  return t;
              const n = yr()?.singleContactTranslate?.[e];
              return n?.singleContactTranslateOpen ? n : t
          }
          ;
          let vr = {};
          const Er = ()=>vr
            , br = ()=>gr(window.utils?.getActiveContactId?.())?.sendTranslateAuto;
          let wr = {};
          const Or = e=>{
              wr = e || {}
          }
            , _r = ()=>wr;
          let xr = {};
          let Sr = !0;
          const Lr = ()=>Sr
            , Pr = (e,t=200)=>{
              let n = null;
              return function(...r) {
                  n && clearTimeout(n),
                  n = setTimeout((()=>{
                      e.apply(this, r)
                  }
                  ), t)
              }
          }
            , kr = ()=>{
              br() ? (o(void 0).html('<svg t="1669009215219" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1417" width="30" height="30"><path d="M388.1 642.4h53.8c3.9 0 6.7-3.8 5.5-7.6l-26.8-82.6c-1.7-5.3-9.3-5.4-11 0l-27 82.6c-1.3 3.8 1.5 7.6 5.5 7.6z" fill="#64B5F6" p-id="1418"></path><path d="M553.3 413.3H276.2c-29 0-52.8 23.8-52.8 52.8V774c0 29 23.8 52.8 52.8 52.8h277.1c29 0 52.8-23.8 52.8-52.8V466.1c0-29.1-23.7-52.8-52.8-52.8zM520 759c-2.9 3.5-6.9 5.9-11.7 6.9-1.7 0.4-3.4 0.5-5 0.5-2.9 0-5.6-0.5-8.2-1.6-6.6-2.8-8.9-7.5-9.7-11.2l-23.3-72.2c-1.2-3.7-4.7-6.3-8.6-6.3h-79.3c-2.9 0-5.4 1.8-6.3 4.5l-24.2 73.9c-2.1 4.5-5.5 8-10.2 10.3-4.8 2.3-9.5 3-14.1 1.9-6.8-1.3-10.3-5.3-11.9-8.3-1.8-3.1-3.3-8.6 0.5-16.4l79.4-242.8c5.1-12.9 14.6-19.5 27.7-19.5h0.2c12.6 0.3 22.2 6.8 27.7 18.8l0.3 0.7L522.4 744c1.9 5.6 1 10.9-2.4 15z" fill="#64B5F6" p-id="1419"></path><path d="M761.7 224.1h-254c-35.4 0-64.3 28.9-64.3 64.3V367c0 6.4 5.2 11.5 11.5 11.5h68.8c9.7 0 19.1 1.2 28.2 3.6-2.8-9.3-5.3-18.8-7.5-28.6h-34.6c-7.5-0.8-11.6-6.8-12.3-17.9 0.7-11 4.8-17 12.3-17.9H617c-3.7-11-6-20.4-6.7-28.1-1.5-9.3 1.9-15.7 10.1-19.1 9.7-2.6 16.8 0 21.2 7.7 1.5 5.1 3.7 12.8 6.7 23 2.2 7.7 3.7 13.2 4.5 16.6h89.4c9.7 0.9 14.9 6.8 15.6 17.9 0 11.1-4.9 17-14.5 17.9H721c-3 0-4.5 0.4-4.5 1.3-10.4 52.8-29.4 96.5-57 131.4 22.3 17.9 50.6 33.6 84.9 47.2 9.7 3.4 13 11 10.1 23-3.7 9.3-11.2 12.3-22.3 8.9-35.2-12.3-66.9-28.6-95.1-48.8v109.6c0 6.4 5.2 11.5 11.5 11.5h113.3c35.4 0 64.3-28.9 64.3-64.3v-285c-0.1-35.4-29.1-64.3-64.5-64.3z" fill="#1E88E5" p-id="1420"></path><path d="M674.9 353.5h-88.7c-3.7 0-6.4 3.5-5.5 7 4.1 15.3 9.4 30.1 15.9 44.3 0.3 0.7 0.8 1.3 1.4 1.9 14.3 12.5 25.5 28.6 32.1 46.8 6.5 0.8 3.7 0.5 10.2 1.3 19.5-29.9 32.8-61.4 40-94.4 0.8-3.6-1.9-6.9-5.4-6.9z" fill="#1E88E5" p-id="1421"></path></svg>'),
              o(".real-time-tranlate-text").text("")) : (o(void 0).html('<svg t="1669008497299" class="close-icon icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2680" data-spm-anchor-id="a313x.7781069.0.i0" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20"><path d="M544.448 499.2l284.576-284.576a32 32 0 0 0-45.248-45.248L499.2 453.952 214.624 169.376a32 32 0 0 0-45.248 45.248l284.576 284.576-284.576 284.576a32 32 0 0 0 45.248 45.248l284.576-284.576 284.576 284.576a31.904 31.904 0 0 0 45.248 0 32 32 0 0 0 0-45.248L544.448 499.2z" p-id="2681" data-spm-anchor-id="a313x.7781069.0.i1" class="selected"></path></svg>'),
              o(".real-time-tranlate-text").text("..."))
          }
          ;
          new WeakSet;
          window.utils = {
              getActiveContactId: ()=>{
                  try {
                      const e = window.Store?.Presence?._models?.find((e=>e.chatActive));
                      return e?.__x_id.user
                  } catch (e) {
                      return
                  }
              }
          };
          const Gr = e=>{
              const t = fr();
              ur.ipcRenderer.send(sr.MESSAGE_PROXY, [cr.GET_SESSION_CONTACT_INFO, {
                  ...t,
                  data: {
                      id: e
                  }
              }])
          }
            , Tr = async e=>{
              const t = fr()
                , n = await (async()=>{
                  const e = await fetch("https://ip234.in/ip.json", {
                      method: "GET"
                  })
                    , t = await e.json()
                    , {ip: n, country: r, continent: i, region: o} = t;
                  return {
                      ip: n,
                      address: `${r} | ${o}`
                  }
              }
              )();
              ur.ipcRenderer.send(sr.MESSAGE_PROXY, [cr.SEND_ACCOUNT_INFO, {
                  ...t,
                  accountInfo: {
                      ...e,
                      ...n
                  }
              }])
          }
            , Dr = async t=>{
              ur.ipcRenderer.on(cr.RELOAD_PAGE, ((e,t)=>{
                  window.location.reload()
              }
              )),
              ur.ipcRenderer.send(sr.MESSAGE_PROXY, [cr.GET_TRANSLATE_LANGUAGE]),
              ur.ipcRenderer.on(cr.GET_TRANSLATE_LANGUAGE, ((e,t)=>{
                  (e=>{
                      vr = e
                  }
                  )(t[0])
              }
              )),
              ur.ipcRenderer.send(sr.MESSAGE_PROXY, [cr.GET_SYSTEM_SETTING]),
              ur.ipcRenderer.on(cr.GET_SYSTEM_SETTING, ((e,t)=>{
                  (e=>{
                      xr = e
                  }
                  )(t[0])
              }
              )),
              ur.ipcRenderer.on(cr.INIT_PAGE_DATA, ((e,t)=>{
                  dr(t)
              }
              )),
              ur.ipcRenderer.on(cr.CHANGE_ALLOW_TRANSLATE_STATE, ((e,t)=>{
                  (e=>{
                      Sr = e
                  }
                  )(t)
              }
              )),
              ur.ipcRenderer.send(sr.MESSAGE_PROXY, [cr.GET_SESSION_SETTING]),
              ur.ipcRenderer.on(cr.SET_SESSION_SETTING, ((e,[t])=>{
                  const n = {
                      ...yr(),
                      ...t
                  };
                  (e=>{
                      const t = window.utils?.getActiveContactId?.()
                        , n = br()
                        , r = e?.singleContactTranslate?.[t];
                      let i = e?.translate?.sendTranslateAuto;
                      r?.singleContactTranslateOpen && (i = r?.sendTranslateAuto),
                      n !== i && kr()
                  }
                  )(n),
                  mr(n)
              }
              )),
              ur.ipcRenderer.send(sr.MESSAGE_PROXY, [cr.GET_SESSION_CONTACT_INFO_LIST]),
              ur.ipcRenderer.on(cr.SET_SESSION_CONTACT_INFO_LIST, ((e,[t])=>{
                  Or(t)
              }
              )),
              ur.ipcRenderer.on(cr.SET_SESSION_CONTACT_INFO, ((t,[n])=>{
                  const r = _r();
                  r[n.id] = n.data,
                  Or(r);
                  fr().appType === e.WHATSAPP && (e=>{
                      const t = window?.Store.Contact._models
                        , n = {};
                      t.forEach((e=>{
                          n[e.id.user] = e
                      }
                      )),
                      Object.values(e)?.forEach((e=>{
                          n[e.id] && (n[e.id].name = e.nickName)
                      }
                      ))
                  }
                  )({
                      [n.id]: n
                  })
              }
              ))
          }
            , Ar = n(129)
            , Cr = n(267)
            , Nr = n(280);
          const Ir = async function(e, t, n) {
              let r;
              if ("object" != typeof t && (t = {}),
              e = String(e),
              [t.from, t.to].forEach((e=>{
                  e && !Cr.isSupported(e) && (r = new Error,
                  r.code = 400,
                  r.message = `The language '${e}' is not supported.`)
              }
              )),
              r)
                  throw r;
              Object.prototype.hasOwnProperty.call(t, "from") || (t.from = "auto"),
              Object.prototype.hasOwnProperty.call(t, "to") || (t.to = "en"),
              t.raw = Boolean(t.raw),
              t.from = Cr.getISOCode(t.from),
              t.to = Cr.getISOCode(t.to);
              let i, a = await Nr.generate(e), s = {
                  client: "gtx",
                  sl: t.from,
                  tl: t.to,
                  hl: t.to,
                  dt: ["at", "bd", "ex", "ld", "md", "qca", "rw", "rm", "ss", "t"],
                  ie: "UTF-8",
                  oe: "UTF-8",
                  otf: 1,
                  ssel: 0,
                  tsel: 0,
                  kc: 7,
                  q: e,
                  [a.name]: a.value
              }, c = `${n}?${Ar.stringify(s, {
                  arrayFormat: "repeat"
              })}`;
              c.length > 2048 ? (delete s.q,
              i = [{
                  url: `${n}?${Ar.stringify(s, {
                      arrayFormat: "repeat"
                  })}`,
                  type: "POST",
                  data: new URLSearchParams({
                      q: e
                  }).toString(),
                  headers: {
                      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
                  }
              }]) : i = [{
                  url: c,
                  type: "GET"
              }];
              let l = await (e=>new Promise(((t,n)=>{
                  o.ajax({
                      ...e,
                      success: e=>{
                          t(e)
                      }
                      ,
                      error: (e,t)=>{
                          n()
                      }
                  })
              }
              )))(...i)
                , u = {
                  text: "",
                  from: {
                      language: {
                          didYouMean: !1,
                          iso: ""
                      },
                      text: {
                          autoCorrected: !1,
                          value: "",
                          didYouMean: !1
                      }
                  },
                  raw: ""
              };
              if (t.raw && (u.raw = l),
              l[0].forEach((e=>{
                  e[0] && (u.text += e[0])
              }
              )),
              l[2] === l[8][0][0] ? u.from.language.iso = l[2] : (u.from.language.didYouMean = !0,
              u.from.language.iso = l[8][0][0]),
              l[7] && l[7][0]) {
                  let e = l[7][0];
                  e = e.replace(/<b><i>/g, "["),
                  e = e.replace(/<\/i><\/b>/g, "]"),
                  u.from.text.value = e,
                  !0 === l[7][5] ? u.from.text.autoCorrected = !0 : u.from.text.didYouMean = !0
              }
              return u
          }
            , jr = {
              auto: {
                  [a.GOOGLE]: "auto",
                  [a.DEEPL]: "auto"
              },
              af: {
                  [a.GOOGLE]: "af",
                  [a.DEEPL]: ""
              },
              am: {
                  [a.GOOGLE]: "am",
                  [a.DEEPL]: ""
              },
              ar: {
                  [a.GOOGLE]: "ar",
                  [a.DEEPL]: ""
              },
              as: {
                  [a.GOOGLE]: "as",
                  [a.DEEPL]: ""
              },
              ay: {
                  [a.GOOGLE]: "ay",
                  [a.DEEPL]: ""
              },
              az: {
                  [a.GOOGLE]: "az",
                  [a.DEEPL]: ""
              },
              ak: {
                  [a.GOOGLE]: "ak",
                  [a.DEEPL]: ""
              },
              bm: {
                  [a.GOOGLE]: "bm",
                  [a.DEEPL]: ""
              },
              be: {
                  [a.GOOGLE]: "be",
                  [a.DEEPL]: ""
              },
              bn: {
                  [a.GOOGLE]: "bn",
                  [a.DEEPL]: ""
              },
              bho: {
                  [a.GOOGLE]: "bho",
                  [a.DEEPL]: ""
              },
              bs: {
                  [a.GOOGLE]: "bs",
                  [a.DEEPL]: ""
              },
              bg: {
                  [a.GOOGLE]: "bg",
                  [a.DEEPL]: "bg"
              },
              ca: {
                  [a.GOOGLE]: "ca",
                  [a.DEEPL]: ""
              },
              ceb: {
                  [a.GOOGLE]: "ceb",
                  [a.DEEPL]: ""
              },
              co: {
                  [a.GOOGLE]: "co",
                  [a.DEEPL]: ""
              },
              cs: {
                  [a.GOOGLE]: "cs",
                  [a.DEEPL]: "cs"
              },
              ckb: {
                  [a.GOOGLE]: "ckb",
                  [a.DEEPL]: ""
              },
              cy: {
                  [a.GOOGLE]: "cy",
                  [a.DEEPL]: ""
              },
              da: {
                  [a.GOOGLE]: "da",
                  [a.DEEPL]: "da"
              },
              dv: {
                  [a.GOOGLE]: "dv",
                  [a.DEEPL]: ""
              },
              doi: {
                  [a.GOOGLE]: "doi",
                  [a.DEEPL]: ""
              },
              de: {
                  [a.GOOGLE]: "de",
                  [a.DEEPL]: "de"
              },
              eu: {
                  [a.GOOGLE]: "eu",
                  [a.DEEPL]: ""
              },
              en: {
                  [a.GOOGLE]: "en",
                  [a.DEEPL]: "en"
              },
              eo: {
                  [a.GOOGLE]: "eo",
                  [a.DEEPL]: ""
              },
              et: {
                  [a.GOOGLE]: "et",
                  [a.DEEPL]: "et"
              },
              ee: {
                  [a.GOOGLE]: "ee",
                  [a.DEEPL]: ""
              },
              el: {
                  [a.GOOGLE]: "el",
                  [a.DEEPL]: "el"
              },
              es: {
                  [a.GOOGLE]: "es",
                  [a.DEEPL]: "es"
              },
              fil: {
                  [a.GOOGLE]: "fil",
                  [a.DEEPL]: ""
              },
              fi: {
                  [a.GOOGLE]: "fi",
                  [a.DEEPL]: "fi"
              },
              fr: {
                  [a.GOOGLE]: "fr",
                  [a.DEEPL]: "fr"
              },
              fy: {
                  [a.GOOGLE]: "fy",
                  [a.DEEPL]: ""
              },
              fa: {
                  [a.GOOGLE]: "fa",
                  [a.DEEPL]: ""
              },
              gl: {
                  [a.GOOGLE]: "gl",
                  [a.DEEPL]: ""
              },
              gn: {
                  [a.GOOGLE]: "gn",
                  [a.DEEPL]: ""
              },
              gu: {
                  [a.GOOGLE]: "gu",
                  [a.DEEPL]: ""
              },
              ga: {
                  [a.GOOGLE]: "ga",
                  [a.DEEPL]: ""
              },
              gom: {
                  [a.GOOGLE]: "gom",
                  [a.DEEPL]: ""
              },
              gd: {
                  [a.GOOGLE]: "gd",
                  [a.DEEPL]: ""
              },
              hy: {
                  [a.GOOGLE]: "hy",
                  [a.DEEPL]: ""
              },
              hr: {
                  [a.GOOGLE]: "hr",
                  [a.DEEPL]: ""
              },
              ht: {
                  [a.GOOGLE]: "ht",
                  [a.DEEPL]: ""
              },
              ha: {
                  [a.GOOGLE]: "ha",
                  [a.DEEPL]: ""
              },
              haw: {
                  [a.GOOGLE]: "haw",
                  [a.DEEPL]: ""
              },
              he: {
                  [a.GOOGLE]: "he",
                  [a.DEEPL]: ""
              },
              hi: {
                  [a.GOOGLE]: "hi",
                  [a.DEEPL]: ""
              },
              hmn: {
                  [a.GOOGLE]: "hmn",
                  [a.DEEPL]: ""
              },
              hu: {
                  [a.GOOGLE]: "hu",
                  [a.DEEPL]: "hu"
              },
              is: {
                  [a.GOOGLE]: "is",
                  [a.DEEPL]: ""
              },
              ig: {
                  [a.GOOGLE]: "ig",
                  [a.DEEPL]: ""
              },
              ilo: {
                  [a.GOOGLE]: "ilo",
                  [a.DEEPL]: ""
              },
              id: {
                  [a.GOOGLE]: "id",
                  [a.DEEPL]: "id"
              },
              it: {
                  [a.GOOGLE]: "it",
                  [a.DEEPL]: "it"
              },
              ja: {
                  [a.GOOGLE]: "ja",
                  [a.DEEPL]: "ja"
              },
              jv: {
                  [a.GOOGLE]: "jv",
                  [a.DEEPL]: ""
              },
              ka: {
                  [a.GOOGLE]: "ka",
                  [a.DEEPL]: ""
              },
              kn: {
                  [a.GOOGLE]: "kn",
                  [a.DEEPL]: ""
              },
              kk: {
                  [a.GOOGLE]: "kk",
                  [a.DEEPL]: ""
              },
              km: {
                  [a.GOOGLE]: "km",
                  [a.DEEPL]: ""
              },
              ko: {
                  [a.GOOGLE]: "ko",
                  [a.DEEPL]: "ko"
              },
              kri: {
                  [a.GOOGLE]: "kri",
                  [a.DEEPL]: ""
              },
              ku: {
                  [a.GOOGLE]: "ku",
                  [a.DEEPL]: ""
              },
              ky: {
                  [a.GOOGLE]: "ky",
                  [a.DEEPL]: ""
              },
              lo: {
                  [a.GOOGLE]: "lo",
                  [a.DEEPL]: ""
              },
              la: {
                  [a.GOOGLE]: "la",
                  [a.DEEPL]: ""
              },
              lv: {
                  [a.GOOGLE]: "lv",
                  [a.DEEPL]: "lv"
              },
              ln: {
                  [a.GOOGLE]: "ln",
                  [a.DEEPL]: ""
              },
              lt: {
                  [a.GOOGLE]: "lt",
                  [a.DEEPL]: "lt"
              },
              lg: {
                  [a.GOOGLE]: "lg",
                  [a.DEEPL]: ""
              },
              lb: {
                  [a.GOOGLE]: "lb",
                  [a.DEEPL]: ""
              },
              lus: {
                  [a.GOOGLE]: "lus",
                  [a.DEEPL]: ""
              },
              mk: {
                  [a.GOOGLE]: "mk",
                  [a.DEEPL]: ""
              },
              mai: {
                  [a.GOOGLE]: "mai",
                  [a.DEEPL]: ""
              },
              mg: {
                  [a.GOOGLE]: "mg",
                  [a.DEEPL]: ""
              },
              ms: {
                  [a.GOOGLE]: "ms",
                  [a.DEEPL]: ""
              },
              ml: {
                  [a.GOOGLE]: "ml",
                  [a.DEEPL]: ""
              },
              mt: {
                  [a.GOOGLE]: "mt",
                  [a.DEEPL]: ""
              },
              mi: {
                  [a.GOOGLE]: "mi",
                  [a.DEEPL]: ""
              },
              mr: {
                  [a.GOOGLE]: "mr",
                  [a.DEEPL]: ""
              },
              "mni-Mtei": {
                  [a.GOOGLE]: "mni-Mtei",
                  [a.DEEPL]: ""
              },
              mn: {
                  [a.GOOGLE]: "mn",
                  [a.DEEPL]: ""
              },
              my: {
                  [a.GOOGLE]: "my",
                  [a.DEEPL]: ""
              },
              nl: {
                  [a.GOOGLE]: "nl",
                  [a.DEEPL]: "nl"
              },
              ne: {
                  [a.GOOGLE]: "ne",
                  [a.DEEPL]: ""
              },
              no: {
                  [a.GOOGLE]: "no",
                  [a.DEEPL]: "nb"
              },
              ny: {
                  [a.GOOGLE]: "ny",
                  [a.DEEPL]: ""
              },
              nso: {
                  [a.GOOGLE]: "nso",
                  [a.DEEPL]: ""
              },
              or: {
                  [a.GOOGLE]: "or",
                  [a.DEEPL]: ""
              },
              om: {
                  [a.GOOGLE]: "om",
                  [a.DEEPL]: ""
              },
              ps: {
                  [a.GOOGLE]: "ps",
                  [a.DEEPL]: ""
              },
              pl: {
                  [a.GOOGLE]: "pl",
                  [a.DEEPL]: "pl"
              },
              pt: {
                  [a.GOOGLE]: "pt",
                  [a.DEEPL]: "pt"
              },
              pa: {
                  [a.GOOGLE]: "pa",
                  [a.DEEPL]: ""
              },
              qu: {
                  [a.GOOGLE]: "qu",
                  [a.DEEPL]: ""
              },
              rw: {
                  [a.GOOGLE]: "rw",
                  [a.DEEPL]: ""
              },
              ro: {
                  [a.GOOGLE]: "ro",
                  [a.DEEPL]: ""
              },
              ru: {
                  [a.GOOGLE]: "ru",
                  [a.DEEPL]: "ru"
              },
              sq: {
                  [a.GOOGLE]: "sq",
                  [a.DEEPL]: "sq"
              },
              sm: {
                  [a.GOOGLE]: "sm",
                  [a.DEEPL]: ""
              },
              sa: {
                  [a.GOOGLE]: "sa",
                  [a.DEEPL]: ""
              },
              sr: {
                  [a.GOOGLE]: "sr",
                  [a.DEEPL]: ""
              },
              st: {
                  [a.GOOGLE]: "st",
                  [a.DEEPL]: ""
              },
              sn: {
                  [a.GOOGLE]: "sn",
                  [a.DEEPL]: ""
              },
              sd: {
                  [a.GOOGLE]: "sd",
                  [a.DEEPL]: ""
              },
              si: {
                  [a.GOOGLE]: "si",
                  [a.DEEPL]: ""
              },
              sk: {
                  [a.GOOGLE]: "sk",
                  [a.DEEPL]: "sk"
              },
              sl: {
                  [a.GOOGLE]: "sl",
                  [a.DEEPL]: "sl"
              },
              so: {
                  [a.GOOGLE]: "so",
                  [a.DEEPL]: ""
              },
              su: {
                  [a.GOOGLE]: "su",
                  [a.DEEPL]: ""
              },
              sw: {
                  [a.GOOGLE]: "sw",
                  [a.DEEPL]: ""
              },
              sv: {
                  [a.GOOGLE]: "sv",
                  [a.DEEPL]: "sv"
              },
              tl: {
                  [a.GOOGLE]: "tl",
                  [a.DEEPL]: ""
              },
              tg: {
                  [a.GOOGLE]: "tg",
                  [a.DEEPL]: ""
              },
              ta: {
                  [a.GOOGLE]: "ta",
                  [a.DEEPL]: ""
              },
              tt: {
                  [a.GOOGLE]: "tt",
                  [a.DEEPL]: ""
              },
              te: {
                  [a.GOOGLE]: "te",
                  [a.DEEPL]: ""
              },
              th: {
                  [a.GOOGLE]: "th",
                  [a.DEEPL]: ""
              },
              ti: {
                  [a.GOOGLE]: "ti",
                  [a.DEEPL]: ""
              },
              ts: {
                  [a.GOOGLE]: "ts",
                  [a.DEEPL]: ""
              },
              tr: {
                  [a.GOOGLE]: "tr",
                  [a.DEEPL]: "tr"
              },
              tk: {
                  [a.GOOGLE]: "tk",
                  [a.DEEPL]: ""
              },
              uk: {
                  [a.GOOGLE]: "uk",
                  [a.DEEPL]: "uk"
              },
              ur: {
                  [a.GOOGLE]: "ur",
                  [a.DEEPL]: ""
              },
              ug: {
                  [a.GOOGLE]: "ug",
                  [a.DEEPL]: ""
              },
              uz: {
                  [a.GOOGLE]: "uz",
                  [a.DEEPL]: ""
              },
              vi: {
                  [a.GOOGLE]: "vi",
                  [a.DEEPL]: ""
              },
              xh: {
                  [a.GOOGLE]: "xh",
                  [a.DEEPL]: ""
              },
              yi: {
                  [a.GOOGLE]: "yi",
                  [a.DEEPL]: ""
              },
              yo: {
                  [a.GOOGLE]: "yo",
                  [a.DEEPL]: ""
              },
              "zh-CN": {
                  [a.GOOGLE]: "zh-cn",
                  [a.DEEPL]: "zh"
              },
              "zh-TW": {
                  [a.GOOGLE]: "zh-tw",
                  [a.DEEPL]: ""
              },
              zu: {
                  [a.GOOGLE]: "zu",
                  [a.DEEPL]: ""
              }
          };
          const Rr = n(129);
          function Mr(e) {
              return Buffer.from(e, "utf-8").toString("base64")
          }
          async function Br(e, t="auto", n="auto", r) {
              try {
                  const s = (i = a.DEEPL,
                  o = n,
                  jr[o][i]).toUpperCase();
                  if (!s)
                      return "Deepl暂不支持该国家语言翻译";
                  const c = {
                      source_lang_computed: t.toUpperCase(),
                      target_lang: s,
                      text: Mr(Mr(e))
                  }
                    , l = await fetch(`${r}?${Rr.stringify(c)}`, {
                      method: "GET"
                  });
                  return (await l.json()).result.translations[0].beams[0].sentences[0].text
              } catch (e) {
                  throw new Error(e)
              }
              var i, o
          }
          var Kr;
          !function(e) {
              e.SEND = "send",
              e.RECIEVE = "receive"
          }(Kr || (Kr = {}));
          const Fr = async(e,t,n)=>{
              const r = s.find((e=>e.value === n)).url;
              return await Br(e, "auto", t, r)
          }
            , qr = async(e,t,n)=>{
              const r = s.find((e=>e.value === n)).url;
              return (await Ir(e, {
                  to: t,
                  raw: !1
              }, r)).text
          }
            , Ur = async(e,t,n)=>{
              if ("" === e?.trim() || !e)
                  return e;
              if (!((e,t)=>{
                  const n = gr(t);
                  return !(e !== Kr.SEND || !n.sendTranslateAuto) || !(e !== Kr.RECIEVE || !n.receiveTranslateAuto)
              }
              )(t, n))
                  return e;
              const r = Er()
                , i = ((e,t)=>{
                  const n = gr(t);
                  return e === Kr.SEND ? n.sendTargetLanguage : e === Kr.RECIEVE ? n.receiveTargetLanguage : ""
              }
              )(t, n)
                , o = c[r.route] === a.DEEPL ? Fr : qr
                , s = await (async(e,t)=>{
                  const n = ar(e + t);
                  return await or.message.get(n)
              }
              )(e, i);
              if (!s || s.translationType !== i) {
                  if (!Lr())
                      return "字符数不足";
                  try {
                      const t = await o(e, i, r.route);
                      return (async(e,t,n)=>{
                          try {
                              await or.message.add({
                                  id: ar(e + n),
                                  text: e,
                                  translation: t,
                                  translationType: n
                              })
                          } catch (e) {}
                      }
                      )(e, t, i),
                      l = (e=>{
                          let t = e.length;
                          for (let n = t; n--; )
                              e.charCodeAt(n) > 255 && t++;
                          return t
                      }
                      )(e),
                      ur.ipcRenderer.send(sr.MESSAGE_PROXY, [cr.SEND_UPDATE_WORDS_NUM, {
                          nums: l
                      }]),
                      t
                  } catch (e) {
                      return "翻译error 切换翻译线路或海外网络重试..."
                  }
              }
              var l;
              return s.translation
          }
            , zr = ()=>{
              try {
                  return o('[class*="friendlist-module__list"] [class*="friendlistItem-module__item"][aria-current="true"]').attr("data-mid")
              } catch (e) {
                  return
              }
          }
            , $r = e=>{
              switch (e) {
              case 0:
                  return "用户ID";
              case 1:
                  return "手机号";
              case 2:
                  return "邮箱";
              case 3:
              default:
                  return "用户名";
              case 5:
                  return "群组";
              case 7:
                  return "二维码";
              case 8:
                  return "机器人"
              }
          }
          ;
          window.utils = {
              getActiveContactId: zr
          };
          n(861);
          const Wr = ()=>document.querySelector('[class*="chatroomEditor-module"] textarea-ex')
            , Hr = ()=>document.querySelector('[class*="chatroomEditor-module"] textarea-ex').shadowRoot.querySelector("textarea")
            , Vr = e.LINE;
          Dr(Vr),
          dr({
              appType: Vr
          });
          let Yr = !1;
          const Xr = async(e,t,n)=>{
              if (null === t || "" === t.trim())
                  return void o(e).text("...");
              const r = await Ur(t, n, zr());
              o(e).text(r),
              o(e).css("white-space", "pre-line"),
              Yr && n === Kr.RECIEVE && o('div[class*="message-module__message"]')[0].scrollIntoView()
          }
            , Zr = ()=>{
              o('div[class*="message-module__message"]').forEach((e=>{
                  if (o(e).has(".message-translate-content").length > 0)
                      return;
                  const t = `<div class="message-translate-content" style="line-height:1.23;${(()=>{
                      const e = xr?.translateText || {};
                      return `font-weight:${e.fontWeight || 400};font-size:${e.fontSize || 12}px;color:${e.color || "#008000"};border-top:1px dashed #333;margin-top:4px;padding-top:4px;`
                  }
                  )()}"></div>`;
                  o(t).insertAfter(o(e).find('pre[class*="textMessageContent-module__text"]'));
                  const n = o(e).find('pre[class*="textMessageContent-module__text"]').text();
                  Xr(o(e).find(".message-translate-content"), n, Kr.RECIEVE)
              }
              ))
          }
            , Qr = ()=>{
              o('div[class*="chatroomEditor-module__editor_area"]').has(".real-time-tranlate-content").length > 0 || (({parent: e, css: t="font-size:12px;padding:10px 20px 10px 0;display:flex;display:flex;align-items:center;"})=>{
                  const n = Er()
                    , r = br()
                    , i = s.find((e=>e.value === n.route))?.label;
                  o(e).before(`<div class="real-time-tranlate-content" style="${t}">\n        <div style="border-left:2px solid rgb(34,165,81);padding-left:20px;word-break: break-word;width: 100%;">\n          <div style="color:rgb(34,165,81)">${i}实时翻译</div>\n          <div class="real-time-tranlate-text" style="max-height:100px;overflow:auto;">${r ? "..." : ""}</div>\n        </div>\n      </div>`)
              }
              )({
                  parent: 'div[class*="chatroomEditor-module__editor_area"] textarea-ex',
                  css: "border-bottom:1px solid #f0f1f4;font-size:12px;padding:10px 20px 10px 0;display:flex;display:flex;align-items:center;"
              })
          }
            , Jr = (e=o(".real-time-tranlate-text").text())=>{
              Wr().value = [e];
              const t = document.createEvent("HTMLEvents");
              t.initEvent("input", !0, !0),
              Wr().dispatchEvent(t)
          }
            , ei = ()=>{
              (e=>{
                  const t = fr();
                  ur.ipcRenderer.send(sr.MESSAGE_PROXY, [cr.SEND_UNREAD_MESSAGE_NUM, {
                      ...t,
                      messageNum: e
                  }])
              }
              )(o('div[class*="badge-module__badge"]').reduce(((e,t)=>e + (parseInt(t.innerText) || 0)), 0))
          }
            , ti = ()=>{
              const e = new KeyboardEvent("keydown",{
                  key: "Enter",
                  code: "Enter",
                  which: 13,
                  keyCode: 13,
                  bubbles: !0,
                  cancelable: !0
              });
              Wr().dispatchEvent(e)
          }
          ;
          let ni = {};
          window.addContact = e=>{
              const t = {};
              Object.values(e).forEach((e=>{
                  void 0 !== e.contact.type && (t[e.contact.mid] = e.contact)
              }
              )),
              console.log(e, "contactList", t),
              ni = {
                  ...t,
                  ...ni
              }
          }
          ;
          let ri = [];
          window.fetchAllContactFinish = e=>{
              console.log(e, "fetchAllContactFinish"),
              ri = e
          }
          ,
          window.onload = ()=>{
              setInterval((()=>{
                  Er().translateAuto && Zr(),
                  Qr(),
                  ei()
              }
              ), 1e3),
              o("body").on("click", ".chatList", (function() {
                  Yr = !0,
                  o("#_chat_message_area").on("mousewheel", (e=>{
                      (()=>{
                          const e = o(".MessageList").scrollTop()
                            , t = o(".MessageList").height()
                            , n = o(".messages-container").height();
                          Yr = e + t >= n - 10
                      }
                      )()
                  }
                  ))
              }
              )),
              o("body").on("click", '[class*="friendlist-module__list"] [class*="friendlistItem-module__item"]', (function() {
                  const e = zr();
                  Gr(e)
              }
              )),
              o("body").on("keydown", '[class*="chatroomEditor-module"]', (function(e) {
                  o(this).hasClass("hasAddEvent") || (o(this).addClass("hasAddEvent"),
                  this.addEventListener("keydown", (function(e) {
                      13 === e.keyCode && !e.shiftKey && e.isTrusted && (e.stopPropagation(),
                      e.preventDefault(),
                      (()=>{
                          const e = br()
                            , t = Lr();
                          e && t && "..." === o(".real-time-tranlate-text").text() && "..." !== Hr().value || (e && t && Jr(),
                          setTimeout((()=>{
                              ti(),
                              e && t && o(".real-time-tranlate-text").text("...")
                          }
                          ), 50))
                      }
                      )())
                  }
                  ), !0))
              }
              )),
              o("body").on("input", '[class*="chatroomEditor-module"]', Pr((function(e) {
                  if (e.isTrusted) {
                      br() && Xr(o(".real-time-tranlate-text"), Hr().value, Kr.SEND)
                  }
              }
              ))),
              (async e=>{
                  ur.ipcRenderer.on(cr.FAST_REPLY_CLICK, ((t,n)=>{
                      const {content: r, immediatelySend: i} = n[0];
                      e(r, i)
                  }
                  ))
              }
              )(((e,t)=>{
                  Jr(e),
                  t && setTimeout((()=>{
                      ti()
                  }
                  ), 10)
              }
              )),
              (async e=>{
                  ur.ipcRenderer.on(cr.GET_SESSION_CONTACT_INFO, ((t,n)=>{
                      e && Gr(e())
                  }
                  ))
              }
              )(zr);
              let e = !1;
              const n = async()=>{
                  const n = JSON.parse(localStorage?.getItem("userInfo") || "{}").mid;
                  if (!n)
                      return void (ni = {});
                  const r = JSON.parse(localStorage?.getItem(`cache-contact-list-${n}`) || "{}")
                    , i = Object.values(r).length;
                  if (console.log(e, ri.length, Object.values(ni).length, i),
                  e || !(0 === ri.length || Object.values(ni).length < ri.length)) {
                      if (e = !0,
                      console.log("联系人数据", Object.values(ni).length, ri.length, i),
                      Object.values(ni).length > 0) {
                          const e = [];
                          Object.values(ni)?.forEach((t=>{
                              r[t.mid] || (e.push(t),
                              r[t.mid] = t)
                          }
                          )),
                          e.length > 0 && 0 !== i && (e=>{
                              const t = fr();
                              ur.ipcRenderer.send(sr.MESSAGE_PROXY, [cr.SEND_CONTACT_INFO, {
                                  ...t,
                                  contactInfoList: e
                              }])
                          }
                          )(e.map((e=>({
                              appId: t[Vr].serverId,
                              userId: e.mid,
                              userName: e.mid,
                              headImg: `https://profile.line-scdn.net${e.picturePath}`,
                              nickName: e.displayName,
                              contactType: $r(e.type)
                          }))))
                      }
                      ni = {},
                      localStorage?.setItem(`cache-contact-list-${n}`, JSON.stringify(r))
                  }
              }
                , r = ()=>{
                  Er().counter && setInterval((()=>{
                      n()
                  }
                  ), 3e4)
              }
              ;
              let i = 0;
              i = setInterval((()=>{
                  (()=>{
                      const e = JSON.parse(localStorage?.getItem("userInfo") || "{}");
                      if (e?.mid && o("div[class^=gnb-module]").length > 0) {
                          const n = {
                              appId: t[Vr].serverId,
                              userId: e?.mid,
                              userName: e?.userid || e?.mid,
                              headImg: `https://profile.line-scdn.net${e.picturePath}`,
                              nickName: e.displayName
                          };
                          Tr(n),
                          clearInterval(i),
                          r()
                      }
                  }
                  )()
              }
              ), 1e3)
          }
      }
      )(),
      r
  }
  )()));
}
)
