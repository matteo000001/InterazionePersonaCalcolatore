

const toDateOnly = (date: Date) => date.toISOString().slice(0, 10);

export const today = toDateOnly(new Date());

export const addDays = (date: string, amount: number) => {
  const next = new Date(`${date}T00:00:00.000Z`);
  next.setUTCDate(next.getUTCDate() + amount);
  return toDateOnly(next);
};

export const isWeekend = (date: string) => {
  const day = new Date(`${date}T00:00:00.000Z`).getUTCDay();
  return day === 0 || day === 6;
};

export const isHoliday = (date: string, holidays: string[]) =>
  holidays.includes(date);

export const isDateBetween = (date: string, start: string, end: string) =>
  date >= start && date <= end;

export const enumerateDates = (start: string, end: string) => {
  const dates: string[] = [];
  let cursor = start;

  while (cursor <= end) {
    dates.push(cursor);
    cursor = addDays(cursor, 1);
  }

  return dates;
};

