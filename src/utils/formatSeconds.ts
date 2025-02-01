export const formatSeconds = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
  
    if (hrs > 0) return `${hrs} soat ${mins} daqiqa`;
    if (mins > 0) return `${mins} daqiqa ${secs} sekund`;
    return `${secs} sekund`;
  };
  