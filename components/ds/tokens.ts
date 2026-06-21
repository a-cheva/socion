/** Airbnb-inspired Design Tokens for SocioN */

export const colors = {
  // Brand
  rausch:           "#ff385c",
  rauschActive:     "#e00b41",
  rauschDisabled:   "#ffd1da",
  rauschError:      "#c13515",
  luxe:             "#460479",
  plus:             "#92174d",

  // Text
  ink:              "#222222",
  bodyText:         "#3f3f3f",
  mutedText:        "#6a6a6a",
  mutedSoft:        "#929292",
  onPrimary:        "#ffffff",
  onDark:           "#ffffff",
  legalLink:        "#428bff",

  // Surface
  canvas:           "#ffffff",
  surfaceSoft:      "#f7f7f7",
  surfaceCard:      "#ffffff",
  surfaceStrong:    "#f2f2f2",

  // Borders
  hairline:         "#dddddd",
  hairlineSoft:     "#ebebeb",
  borderStrong:     "#c1c1c1",

  // Scrim
  scrim:            "#000000",
} as const

export const radius = {
  none: "0px",
  xs:   "4px",
  sm:   "8px",
  md:   "14px",
  lg:   "20px",
  xl:   "32px",
  full: "9999px",
} as const

export const spacing = {
  xxs:     "2px",
  xs:      "4px",
  sm:      "8px",
  md:      "12px",
  base:    "16px",
  lg:      "24px",
  xl:      "32px",
  xxl:     "48px",
  section: "64px",
} as const

export const typography = {
  displayXl:  { fontSize: "28px", fontWeight: 700, lineHeight: 1.43, letterSpacing: "0" },
  displayLg:  { fontSize: "22px", fontWeight: 500, lineHeight: 1.18, letterSpacing: "-0.44px" },
  displayMd:  { fontSize: "21px", fontWeight: 700, lineHeight: 1.43, letterSpacing: "0" },
  displaySm:  { fontSize: "20px", fontWeight: 600, lineHeight: 1.20, letterSpacing: "-0.18px" },
  titleMd:    { fontSize: "16px", fontWeight: 600, lineHeight: 1.25, letterSpacing: "0" },
  titleSm:    { fontSize: "16px", fontWeight: 500, lineHeight: 1.25, letterSpacing: "0" },
  bodyMd:     { fontSize: "16px", fontWeight: 400, lineHeight: 1.5,  letterSpacing: "0" },
  bodySm:     { fontSize: "14px", fontWeight: 400, lineHeight: 1.43, letterSpacing: "0" },
  caption:    { fontSize: "14px", fontWeight: 500, lineHeight: 1.29, letterSpacing: "0" },
  captionSm:  { fontSize: "13px", fontWeight: 400, lineHeight: 1.23, letterSpacing: "0" },
  badge:      { fontSize: "11px", fontWeight: 600, lineHeight: 1.18, letterSpacing: "0" },
  microLabel: { fontSize: "12px", fontWeight: 700, lineHeight: 1.33, letterSpacing: "0" },
  navLink:    { fontSize: "16px", fontWeight: 600, lineHeight: 1.25, letterSpacing: "0" },
  buttonMd:   { fontSize: "16px", fontWeight: 500, lineHeight: 1.25, letterSpacing: "0" },
  buttonSm:   { fontSize: "14px", fontWeight: 500, lineHeight: 1.29, letterSpacing: "0" },
  ratingDisplay: { fontSize: "64px", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-1px" },
  newTag:     { fontSize: "8px",  fontWeight: 700, lineHeight: 1.25, letterSpacing: "0.32px", textTransform: "uppercase" as const },
} as const

export const shadows = {
  card: "rgba(0,0,0,0.02) 0 0 0 1px, rgba(0,0,0,0.04) 0 2px 6px 0, rgba(0,0,0,0.1) 0 4px 8px 0",
  none: "none",
} as const
