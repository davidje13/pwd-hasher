!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("pwd-hasher",[],t):"object"==typeof exports?exports["pwd-hasher"]=t():e["pwd-hasher"]=t()}(global,function(){return function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=3)}([function(e,t){e.exports=require("bcrypt")},function(e,t){e.exports=require("crypto")},function(e,t){e.exports=require("util")},function(e,t,r){e.exports=r(4)},function(e,t,r){"use strict";r.r(t);var n=r(1),o=r.n(n),u=r(0),c=r.n(u),i=r(2);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}const s="01234567".split(""),f=Object(i.promisify)(o.a.randomBytes);function p(e,t,r){const n=o.a.createHash("sha512");return n.update(`${e}${r}${t}`),n.digest("base64")}t.default=class{constructor({secretPepper:e="",workFactor:t=10}={}){a(this,"secretPepper",void 0),a(this,"workFactor",void 0),this.secretPepper=e,this.workFactor=t}async hash(e){const t=await async function(){const e=(await f(1))[0]%s.length;return s[e]}();return c.a.hash(p(e,this.secretPepper,t),this.workFactor)}async compare(e,t){const r=function(e){const t=e.slice();for(let e=t.length-1;e>0;e-=1){const r=Math.floor(Math.random()*(e+1)),n=t[e];t[e]=t[r],t[r]=n}return t}(s);for(let n=0;n<r.length;n+=1){if(await c.a.compare(p(e,this.secretPepper,r[n]),t))return!0}return!1}needsRegenerate(e){return c.a.getRounds(e)<this.workFactor}}}])});
//# sourceMappingURL=index.js.map