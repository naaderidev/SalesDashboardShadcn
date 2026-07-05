// Minimal Jalali (Persian) -> Gregorian calendar conversion.
// Algorithm: public-domain Jalaali <-> Gregorian conversion (jalaali.js).
// We only need month-level precision (day is fixed to 1) for labeling
// monthly chart data pulled from a Persian-calendar spreadsheet.

function jalaliToGregorian(jy: number, jm: number, jd: number): Date {
  let gy = jy <= 979 ? 621 : 1600;
  jy -= jy <= 979 ? 0 : 979;

  let days =
    365 * jy +
    Math.floor(jy / 33) * 8 +
    Math.floor(((jy % 33) + 3) / 4) +
    78 +
    jd +
    (jm < 7 ? (jm - 1) * 31 : (jm - 7) * 30 + 186);

  gy += 400 * Math.floor(days / 146097);
  days %= 146097;

  let leap = true;
  if (days >= 36525) {
    days -= 1;
    gy += 100 * Math.floor(days / 36524);
    days %= 36524;
    if (days >= 365) days += 1;
    else leap = false;
  }

  gy += 4 * Math.floor(days / 1461);
  days %= 1461;

  if (days >= 366) {
    leap = false;
    days -= 1;
    gy += Math.floor(days / 365);
    days %= 365;
  }

  const monthDays = [
    31,
    leap ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];

  let gm = 0;
  let gd = days + 1;
  for (gm = 0; gm < 12 && gd > monthDays[gm]; gm++) {
    gd -= monthDays[gm];
  }

  return new Date(gy, gm, gd);
}

/**
 * Parses a "YYYY/MM" Jalali string (as exported from a Persian Excel sheet)
 * and returns the corresponding Gregorian Date (day fixed to the 1st).
 */
export function parseJalaliMonth(jalaliMonth: string): Date {
  const [jy, jm] = jalaliMonth.split("/").map(Number);
  return jalaliToGregorian(jy, jm, 1);
}

/** "1402/09" -> "Nov 2023" */
export function formatJalaliMonthLabel(jalaliMonth: string): string {
  const date = parseJalaliMonth(jalaliMonth);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(date);
}

/** Sortable key so chronological ordering matches the Jalali source order. */
export function jalaliSortKey(jalaliMonth: string): number {
  const [jy, jm] = jalaliMonth.split("/").map(Number);
  return jy * 100 + jm;
}
