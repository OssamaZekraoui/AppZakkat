import { LUNAR_YEAR_DAYS } from "./schools";
import { ZakatValidationError } from "./validation";

const DAY_MS = 24 * 60 * 60 * 1000;

function utcDay(value: string | Date): Date {
  const date = value instanceof Date ? new Date(value) : new Date(value);
  if (!Number.isFinite(date.getTime())) {
    throw new ZakatValidationError("Invalid Hawl date");
  }
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export interface HawlStatus {
  start: Date;
  end: Date;
  completed: boolean;
  elapsedDays: number;
  daysUntilCompletion: number;
}

export function getHawlStatus(
  hawlStart: string,
  asOf: string | Date = new Date()
): HawlStatus {
  const start = utcDay(hawlStart);
  const calculationDay = utcDay(asOf);
  const elapsedDays = Math.floor((calculationDay.getTime() - start.getTime()) / DAY_MS);

  if (elapsedDays < 0) {
    throw new ZakatValidationError("Hawl start date cannot be in the future");
  }

  const end = new Date(start.getTime() + LUNAR_YEAR_DAYS * DAY_MS);
  const completed = elapsedDays >= LUNAR_YEAR_DAYS;

  return {
    start,
    end,
    completed,
    elapsedDays,
    daysUntilCompletion: completed ? 0 : LUNAR_YEAR_DAYS - elapsedDays,
  };
}
