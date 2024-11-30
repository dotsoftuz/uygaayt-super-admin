function currencyFormatter(x) {
  let str = String(x)?.replace(/[^\d.-]/g, "");
  let parts = str.split(".");
  parts[0] = parts[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, "$& ");
  if (typeof parts[1] === "string") {
    parts[1] = parts[1].slice(0, 3);
    return parts.join(".");
  }
  return parts[0];
}

export default currencyFormatter;
