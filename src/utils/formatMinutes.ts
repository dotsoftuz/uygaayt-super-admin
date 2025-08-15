export const formatMinutes = (minutes: number): string => {
  if (!minutes || minutes <= 0) return '0 daqiqa';

  const totalMinutes = Math.round(minutes); // round to nearest integer
  const hrs = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  if (hrs > 0) return `${hrs} soat ${mins} daqiqa`;
  return `${mins} daqiqa`;
};
