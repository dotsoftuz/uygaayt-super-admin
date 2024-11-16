export const numberFormat = (number: any) => {
  // if (number?.toString()?.includes(".")) {
  //   return number?.toString();
  // }
  if (number || number == 0) {
    return number.toLocaleString().replaceAll(",", " ");
  }
  return "";
};
