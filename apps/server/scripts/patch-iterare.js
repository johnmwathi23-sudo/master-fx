const fs = require('fs');
const path = require('path');

try {
  const zipPath = require.resolve('iterare/lib/zip');
} catch {
  const iteratePath = require.resolve('iterare/lib/iterate');
  const zipFile = path.join(path.dirname(iteratePath), 'zip.js');
  const content = `"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zip = zip;
function zip() {
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
  if (args.length === 0) return function () { return []; }();
  var iterators = args.map(function (it) { return it[Symbol.iterator](); });
  return _zip(iterators);
}
function _zip(iterators) {
  return _a();
  function _a() {
    var results = iterators.map(function (it) { return it.next(); });
    if (results.some(function (r) { return r.done; })) {
      return { done: true, value: undefined };
    }
    return { done: false, value: results.map(function (r) { return r.value; }) };
  }
}
`;
  fs.writeFileSync(zipFile, content);
  console.log('✓ Patched iterare: missing zip.js created');
}
