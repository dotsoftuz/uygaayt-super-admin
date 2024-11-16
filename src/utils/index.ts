import dayjs from "dayjs";
import { IFormNames, IErrors, IOption } from "types/form.types";
import { ISidebarRoute } from "components/shared/sidebar/sidebar.types";

export function get<T>(
  object: { [key: string]: any } | undefined,
  path: string,
  defaultValue: any
): T | typeof defaultValue {
  const paths = Array.isArray(path) ? path : path.split(".");

  let index = 0;
  let len = paths.length;
  let obj = object;

  while (obj != null && index < len) {
    obj = obj[String(paths[index])];
    index++;
  }

  const value = index && index === len ? obj : undefined;

  return value !== undefined ? value : defaultValue;
}

export function hasChildPaths(item: ISidebarRoute) {
  const { items: children } = item;

  if (children === undefined) {
    return false;
  }

  if (children.constructor !== Array) {
    return false;
  }

  if (children.length === 0) {
    return false;
  }

  return true;
}

export function getLastUrl<T>(pathName: string): T {
  return pathName.substring(pathName.lastIndexOf("/") + 1) as T;
}

export const firstErrorField = (FORM_NAMES: IFormNames, errors: IErrors) => {
  return Object.keys(FORM_NAMES).find((formName: string) =>
    Object.keys(errors).find((errorName: string) => errorName === formName)
  );
};

export const moneyFormat = (
  moneyAmount: number | string | undefined,
  config = {
    toFixed: 2,
  }
) => {
  if (typeof moneyAmount === "number") {
    if (moneyAmount.toString().length > 6) {
      // const fixedNumber = Number(moneyAmount);

      // const roundedNumber = Math.round(fixedNumber / 1000) * 1000;

      // return Number(fixedNumber)?.toLocaleString("fr-FR", {
      //   minimumFractionDigits: 2,
      //   maximumFractionDigits: 2,
      // });

      return Number(moneyAmount.toFixed(0))?.toLocaleString("fr-FR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    } else {
      return Number(moneyAmount.toFixed(0))?.toLocaleString("fr-FR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
  }

  if (typeof moneyAmount === "bigint") {
    return BigInt(moneyAmount)?.toString();
  }
  if (!isNaN(Number(moneyAmount))) {
    return Number(moneyAmount).toLocaleString();
  }
  return 0;
};
export const formatUnixDate = (
  date: number | string | undefined,
  format: string = "DD.MM.YYYY | HH:mm"
) =>
  typeof date === "number"
    ? dayjs.unix(date).format(format)
    : dayjs(date).format(format);
export const getRandomColor = () => {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const getRandomNumber = (length: number = 6) => {
  // Get the current timestamp in milliseconds and extract the last 10 digits
  const timestamp = Date.now() % 10000000000;

  // Generate a random number using the timestamp as a seed
  const seed = timestamp;
  const random = Math.floor(Math.random() * Math.floor(seed));

  return random;
};
export const clearFalsyProps = <T>(object: Record<string, any>): T =>
  // @ts-ignore
  Object.fromEntries(
    Object.entries(object).filter(([key, value]) =>
      value === 0 ? 0 : Boolean(value)
    )
  );

export const findDuplicateValues = <T>(
  data: T[],
  prop1: keyof T,
  prop2: keyof T
) => {
  const duplicates = [];
  for (let i = 0; i < data.length - 1; i++) {
    for (let j = i + 1; j < data.length; j++) {
      if (
        data[i][prop1] === data[j][prop1] &&
        data[i][prop2] === data[j][prop2]
      ) {
        duplicates.push(data[i]);
        break;
      }
    }
  }
  return duplicates;
};
export const removeDuplicateOptions = (data: IOption[]) => {
  return data?.filter(
    (value, index, self) =>
      index === self?.findIndex((t) => t?._id === value?._id)
  );
};
