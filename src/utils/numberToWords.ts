export function numberToWords(num: number) {
  const units = [
    "",
    "bir",
    "ikki",
    "uch",
    "to'rt",
    "besh",
    "olti",
    "yetti",
    "sakkiz",
    "to'qqiz",
  ];
  const tens = [
    "",
    "o'n",
    "yigirma",
    "o'ttiz",
    "qirq",
    "ellik",
    "oltmish",
    "yetmish",
    "sakson",
    "to'qson",
  ];

  if (num === 0) {
    return "zero";
  }

  let words = "";

  if (num >= 1000000000) {
    words += numberToWords(Math.floor(num / 1000000000)) + " milliard ";
    num %= 1000000000;
  }

  if (num >= 1000000) {
    words += numberToWords(Math.floor(num / 1000000)) + " million ";
    num %= 1000000;
  }

  if (num >= 1000) {
    words += numberToWords(Math.floor(num / 1000)) + " ming ";
    num %= 1000;
  }

  if (num >= 100) {
    words += numberToWords(Math.floor(num / 100)) + " yuz ";
    num %= 100;
  }

  if (num > 0) {
    if (num < 10) {
      words += units[num];
    } else {
      words += tens[Math.floor(num / 10)];
      if (num % 10 > 0) {
        words += " " + units[num % 10];
      }
    }
  }
  return words.trim();
}
//   console.log(numberToWords(123456789)); // Output: "yuz yigirma uch million to'rt yuz ellik besh ming yetti yuz sakkiz"
