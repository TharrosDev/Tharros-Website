/**
 * Run with: node lib/commerce/regions.test.ts
 *
 * No framework and no dependency — Node strips the types itself. This covers
 * the one piece of real logic in the address layer: the postal patterns, which
 * are the guard that stopped "1" being an accepted postal code and "zz" an
 * accepted province.
 */
import assert from "node:assert/strict";
import { getCountry, isValidPostal, regionName, COUNTRIES } from "./regions.ts";

// Canadian postal codes, in the several shapes people actually type them.
assert.equal(isValidPostal("CA", "K1A 0B1"), true, "spaced");
assert.equal(isValidPostal("CA", "K1A0B1"), true, "unspaced");
assert.equal(isValidPostal("CA", "k1a 0b1"), true, "lower case");
assert.equal(isValidPostal("CA", "1"), false, "the hole this closed");
assert.equal(isValidPostal("CA", "K1A 0B"), false, "too short");
// D, F, I, O, Q and U never open a Canadian postal code.
assert.equal(isValidPostal("CA", "D1A 0B1"), false, "excluded leading letter");
assert.equal(isValidPostal("CA", "12345"), false, "a ZIP is not a postal code");

// US ZIPs, five and nine digit.
assert.equal(isValidPostal("US", "97201"), true, "five digit");
assert.equal(isValidPostal("US", "97201-1234"), true, "zip+4");
assert.equal(isValidPostal("US", "9720"), false, "too short");
assert.equal(isValidPostal("US", "K1A 0B1"), false, "a postal code is not a ZIP");

// Empty is "missing", not "malformed" — the required check owns that message,
// and reporting both at once told someone their blank field was badly formatted.
assert.equal(isValidPostal("CA", ""), true, "empty defers to the required check");
assert.equal(isValidPostal("CA", "   "), true, "whitespace defers too");

// An unknown country falls back rather than throwing, because `form.country`
// can outlive the list that named it once it has been through localStorage.
assert.equal(getCountry("ZZ").code, "CA", "unknown country falls back");

// Subdivision codes only mean something inside their own country.
assert.equal(regionName("CA", "ON"), "Ontario");
assert.equal(regionName("US", "OR"), "Oregon");
assert.equal(regionName("US", "ON"), "ON", "unknown code renders as itself");

// Every country the shipping rates cover offers a non-empty closed list, or the
// select would render as an empty dropdown nobody can satisfy.
for (const country of COUNTRIES) {
  assert.ok(country.regions.length > 0, `${country.code} has subdivisions`);
}

console.log(`regions: ok (${COUNTRIES.length} countries)`);
