export const formatMinutes = (minutes: number): string => {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hrs > 0) return `${hrs} soat ${mins} daqiqa`;
  return `${mins} daqiqa`;
};
