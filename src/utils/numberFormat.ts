export const numberFormat = (number: any) => {
  if (number || number === 0) {
    // Floating-point xatoliklarni oldini olish
    const rounded = Math.round((number + Number.EPSILON) * 100) / 100;

    return rounded
      .toLocaleString("en-US", {
        minimumFractionDigits: 0, // Har doim 2 kasr
        maximumFractionDigits: 0, // Kasr 2 dan oshmaydi
      })
      .replaceAll(",", " "); // Minglik ajratgich
  }
  return "";
};
