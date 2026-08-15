export type StorePeriod = [string, string];

export type StoreSchedule = Record<number, StorePeriod[]>;

export type StoreClosure = {
  from: string;
  to: string;
  reason: string;
};

export type StoreScheduleOverride = {
  from: string;
  to: string;
  schedule: StoreSchedule;
  label: string;
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

// Temporary timetables that replace the normal weekly schedule for a date range.
export const scheduleOverrides: StoreScheduleOverride[] = [
  {
    from: "2026-08-01",
    to: "2026-08-31",
    label: "Horario de agosto",
    schedule: {
      0: [],
      1: [],
      2: [],
      3: [["17:00", "21:00"]],
      4: [["17:00", "21:00"]],
      5: [["17:00", "21:00"]],
      6: [],
    },
  },
];

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

// Add planned full closures here. Dates are inclusive.
export const closures: StoreClosure[] = [
  // { from: "2026-12-24", to: "2026-12-24", reason: "Cerrado por inventario" },
];

// Use this for isolated days with a different timetable.
export const specialOpenings: SpecialOpening[] = [
  // {
  //   date: "2026-12-20",
  //   periods: [["10:00", "14:00"]],
  //   reason: "Apertura especial Navidad",
  // },
];
