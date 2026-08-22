/**
 * Run with: node lib/format.test.ts
 *
 * Same shape as regions.test.ts — no framework, Node strips the types. This
 * covers the one rule in the money path that is easy to get wrong: whole
 * dollars drop their cents, and everything else keeps both digits.
 */
import assert from "node:assert/strict";
import { formatPrice } from "./format.ts";

assert.equal(formatPrice(12000), "$120", "whole dollars drop the cents");
assert.equal(formatPrice(9500), "$95", "whole dollars drop the cents");
// The hole this closed: minimumFractionDigits: 0 rendered these as "$120.5"
// and "$1.2" — one digit of cents, which reads as a typo on a price tag.
assert.equal(formatPrice(12050), "$120.50", "half a dollar keeps both digits");
assert.equal(formatPrice(120), "$1.20", "and so does a trailing zero");
assert.equal(formatPrice(12099), "$120.99", "two digits are left alone");
assert.equal(formatPrice(0), "$0", "a free line is not blank");
assert.equal(formatPrice(7), "$0.07", "cents below a dollar survive");

console.log("format: ok");
