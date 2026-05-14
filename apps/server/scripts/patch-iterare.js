const fs = require('fs');
const path = require('path');

const zipContent = `"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZipIterator = void 0;
var ZipIterator = (function () {
    function ZipIterator(a, b) {
        this.a = a;
        this.b = b;
    }
    ZipIterator.prototype.next = function () {
        var aNext = this.a.next();
        var bNext = this.b.next();
        if (aNext.done || bNext.done) {
            return { done: true, value: void 0 };
        }
        return { done: false, value: [aNext.value, bNext.value] };
    };
    return ZipIterator;
}());
exports.ZipIterator = ZipIterator;
`;

try {
  const existing = require.resolve('iterare/lib/zip');
  const existingContent = fs.readFileSync(existing, 'utf8');
  if (existingContent.includes('ZipIterator')) {
    process.exit(0);
  }
} catch {}

const iteratePath = require.resolve('iterare/lib/iterate');
const zipFile = path.join(path.dirname(iteratePath), 'zip.js');
fs.writeFileSync(zipFile, zipContent);
console.log('✓ Patched iterare: missing zip.js created with ZipIterator');
