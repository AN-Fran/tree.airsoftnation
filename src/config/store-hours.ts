export type StorePeriod = [string, string];

export type StoreSchedule = Record<number, StorePeriod[]>;

export type StoreClosure = {
  from: string;
  to: string;
  reason: string;
};

export type SpecialOpening = {
  date: string;
  periods: StorePeriod[];
  reason?: string;
};

export const weeklySchedule: StoreSchedule = {
  0: [],
  1: [["11:00", "14:00"], ["16:00", "20:00"]],
  2: [["11:00", "14:00"], ["16:00", "20:00"]],
  3: [["11:00", "14:00"], ["16:00", "20:00"]],
  4: [["11:00", "14:00"], ["16:00", "20:00"]],
  5: [["11:00", "14:00"], ["16:00", "21:00"]],
  6: [],
};

export const holidays = [
  "2026-01-01",
  "2026-01-06",
  "2026-05-01",
  "2026-08-15",
  "2026-10-12",
  "2026-11-01",
  "2026-12-06",
  "2026-12-08",
  "2026-12-25",
];

// Add planned closures here. Dates are inclusive.
export const closures: StoreClosure[] = [
  // { from: "2026-08-24", to: "2026-08-30", reason: "Vacaciones" },
];

// Use this for Sundays, holidays or days with a different timetable.
export const specialOpenings: SpecialOpening[] = [
  // {
  //   date: "2026-12-20",
  //   periods: [["10:00", "14:00"]],
  //   reason: "Apertura especial Navidad",
  // },
];
