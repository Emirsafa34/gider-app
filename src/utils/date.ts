// src/utils/date.ts
import dayjs from "dayjs";

export function todayISO() {
  return dayjs().format("YYYY-MM-DD");
}

export function thisMonth() {
  return dayjs().format("YYYY-MM");
}
