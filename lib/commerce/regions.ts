/**
 * Where the label ships, and what a valid address there looks like.
 *
 * The checkout used to validate an address by presence alone: `region` and
 * `postal` were free text, checked with `.trim()`, so "zz" and "1" were an
 * accepted province and postal code. Only the email had a format test. An
 * address that cannot be delivered to is not caught anywhere downstream either,
 * because there is no downstream — no provider is connected — so the form is the
 * only place it can be caught at all.
 *
 * Subdivisions are a closed list per country rather than a text box, which is
 * error prevention rather than error reporting: a select cannot be wrong. The
 * postal patterns are deliberately loose about spacing and case — a Canadian
 * postal code is written five different ways by five different people and all of
 * them are the same code.
 *
 * PLACEHOLDER SCOPE: two countries, matching `lib/commerce/shipping.ts`, which
 * quotes rates for exactly these. Adding a third means adding it in both places.
 */
export type Region = { code: string; name: string };

export type Country = {
  code: string;
  name: string;
  /** What this country calls its subdivisions. */
  regionLabel: string;
  postalLabel: string;
  /** Loose on spacing and case; strict on shape. */
  postal: RegExp;
  postalHint: string;
  regions: Region[];
};

export const COUNTRIES: Country[] = [
  {
    code: "CA",
    name: "Canada",
    regionLabel: "Province",
    postalLabel: "Postal code",
    postal: /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ ]?\d[ABCEGHJ-NPRSTV-Z]\d$/i,
    postalHint: "Enter a postal code in the format A1A 1A1.",
    regions: [
      { code: "AB", name: "Alberta" },
      { code: "BC", name: "British Columbia" },
      { code: "MB", name: "Manitoba" },
      { code: "NB", name: "New Brunswick" },
      { code: "NL", name: "Newfoundland and Labrador" },
      { code: "NS", name: "Nova Scotia" },
      { code: "NT", name: "Northwest Territories" },
      { code: "NU", name: "Nunavut" },
      { code: "ON", name: "Ontario" },
      { code: "PE", name: "Prince Edward Island" },
      { code: "QC", name: "Quebec" },
      { code: "SK", name: "Saskatchewan" },
      { code: "YT", name: "Yukon" },
    ],
  },
  {
    code: "US",
    name: "United States",
    regionLabel: "State",
    postalLabel: "ZIP code",
    postal: /^\d{5}(-\d{4})?$/,
    postalHint: "Enter a ZIP code in the format 12345 or 12345-6789.",
    regions: [
      { code: "AL", name: "Alabama" },
      { code: "AK", name: "Alaska" },
      { code: "AZ", name: "Arizona" },
      { code: "AR", name: "Arkansas" },
      { code: "CA", name: "California" },
      { code: "CO", name: "Colorado" },
      { code: "CT", name: "Connecticut" },
      { code: "DE", name: "Delaware" },
      { code: "DC", name: "District of Columbia" },
      { code: "FL", name: "Florida" },
      { code: "GA", name: "Georgia" },
      { code: "HI", name: "Hawaii" },
      { code: "ID", name: "Idaho" },
      { code: "IL", name: "Illinois" },
      { code: "IN", name: "Indiana" },
      { code: "IA", name: "Iowa" },
      { code: "KS", name: "Kansas" },
      { code: "KY", name: "Kentucky" },
      { code: "LA", name: "Louisiana" },
      { code: "ME", name: "Maine" },
      { code: "MD", name: "Maryland" },
      { code: "MA", name: "Massachusetts" },
      { code: "MI", name: "Michigan" },
      { code: "MN", name: "Minnesota" },
      { code: "MS", name: "Mississippi" },
      { code: "MO", name: "Missouri" },
      { code: "MT", name: "Montana" },
      { code: "NE", name: "Nebraska" },
      { code: "NV", name: "Nevada" },
      { code: "NH", name: "New Hampshire" },
      { code: "NJ", name: "New Jersey" },
      { code: "NM", name: "New Mexico" },
      { code: "NY", name: "New York" },
      { code: "NC", name: "North Carolina" },
      { code: "ND", name: "North Dakota" },
      { code: "OH", name: "Ohio" },
      { code: "OK", name: "Oklahoma" },
      { code: "OR", name: "Oregon" },
      { code: "PA", name: "Pennsylvania" },
      { code: "RI", name: "Rhode Island" },
      { code: "SC", name: "South Carolina" },
      { code: "SD", name: "South Dakota" },
      { code: "TN", name: "Tennessee" },
      { code: "TX", name: "Texas" },
      { code: "UT", name: "Utah" },
      { code: "VT", name: "Vermont" },
      { code: "VA", name: "Virginia" },
      { code: "WA", name: "Washington" },
      { code: "WV", name: "West Virginia" },
      { code: "WI", name: "Wisconsin" },
      { code: "WY", name: "Wyoming" },
    ],
  },
];

export const DEFAULT_COUNTRY = COUNTRIES[0];

export function getCountry(code: string): Country {
  return COUNTRIES.find((entry) => entry.code === code) ?? DEFAULT_COUNTRY;
}

export function regionName(countryCode: string, regionCode: string): string {
  const region = getCountry(countryCode).regions.find(
    (entry) => entry.code === regionCode,
  );
  return region?.name ?? regionCode;
}

/** Empty is "missing", not "malformed" — the required check owns that message. */
export function isValidPostal(countryCode: string, postal: string): boolean {
  const value = postal.trim();
  if (!value) return true;
  return getCountry(countryCode).postal.test(value);
}
