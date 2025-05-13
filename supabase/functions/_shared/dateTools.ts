export const equalWithFuzziness = (
  date1: Date | undefined,
  date2: Date | undefined,
  fuzzinessInMinutes: number,
) => {
  if (!date1 && !date2) return true;
  if (!date1 || !date2) return false;
  const timeDifference = Math.abs(date1.getTime() - date2.getTime());
  const fuzzinessInMilliseconds = fuzzinessInMinutes * 60 * 1000;

  return timeDifference <= fuzzinessInMilliseconds;
};
