import { GridColumns } from "@mui/x-data-grid";

export interface ITable<TData extends { _id: string }> {
  title?: React.ReactNode | string;
  dataUrl: string;
  exQueryParams?: object;
  deleteUrl?: string;
  columns: GridColumns<TData>;
  tableHeight?: number; //? ViewportHeight measure
  addButtonTitle?: any;

  deletable?: boolean;
  searchable?: boolean;
  selection?: boolean;
  isGetAll?: boolean;
  numerate?: boolean;
  hasPagination?: boolean;
  noRerender?: boolean;
  getUniqueId?: any;

  // onRowClick?: (row: TData) => void;
  onAddButton?: () => void;
  onEditColumn?: (row: TData) => void;
  onDeleteColumn?: (row: TData) => void;
  onDeleteSuccess?: () => void;
  onDataChange?: (data: TData[]) => void;
  getAllData?: (data: any) => void;
  mapData?: (data: TData[]) => TData[];
  onRowClick?: (row: TData) => void;
  onSeenClick?: (row: TData) => void;
  isRowSelectable?: (row: TData) => boolean;
  processingParams?: (params: Record<string, any>) => Record<string, any>;

  headerChildren?: React.ReactNode;
  headerChildrenSecondRow?: React.ReactNode;
  // it is useful when something additional in bottom of table
  // FooterComponent?: React.JSXElementConstructor<ITableFooter<any>>;
  // it is useful when there is another data instead of table
  insteadOfTable?: React.ReactNode;
}

export interface ApiResponse {
  data: {
    data: any[];
    total: number;
  };
}

export interface ITableData {
  data: any;
  total: number;
}
export interface IQueryParams {
  limit: any;
  page: any;
  search?: string;
}

export interface ITableFooter<T extends any> {
  tableData: T[];
}
export const cyrillicLetters = [
  "а",
  "б",
  "в",
  "г",
  "д",
  "е",
  "ё",
  "ж",
  "з",
  "и",
  "й",
  "к",
  "л",
  "м",
  "н",
  "о",
  "п",
  "р",
  "с",
  "т",
  "у",
  "ф",
  "х",
  "ц",
  "ч",
  "ш",
  "щ",
  "ъ",
  "ы",
  "ь",
  "э",
  "ю",
  "я",
];

export function cyrillicToLatin(cyrillicText: string) {
  let latinText = "";
  let conversionMap: any = {
    а: "a",
    б: "b",
    в: "v",
    г: "g",
    д: "d",
    е: "e",
    ё: "yo",
    ж: "zh",
    з: "z",
    и: "i",
    й: "y",
    к: "k",
    л: "l",
    м: "m",
    н: "n",
    о: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    у: "u",
    ф: "f",
    х: "h",
    ц: "ts",
    ч: "ch",
    ш: "sh",
    щ: "shch",
    ъ: "ie",
    ы: "y",
    ь: "'",
    э: "e",
    ю: "yu",
    я: "ya",
    // additional mappings if needed
  };

  for (var i = 0; i < cyrillicText.length; i++) {
    var char = cyrillicText[i].toLowerCase();
    if (conversionMap.hasOwnProperty(char)) {
      latinText += conversionMap[char];
    } else {
      latinText += char;
    }
  }

  return latinText;
}
