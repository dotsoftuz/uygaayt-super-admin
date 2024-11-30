import { IRoleData } from "store/reducers/LoginSlice";

export const PAYMENT_TYPES = [
  {
    _id: "cash",
    name: "Naqd",
    trans_key: "cash",
  },
  {
    _id: "card",
    name: "Karta",
    trans_key: "card",
  },
];

export const DISCOUNT_TYPES = [
  {
    _id: "percent",
    name: "Foiz",
    trans_key: "percent",
  },
  {
    _id: "amount",
    name: "Miqdor",
    trans_key: "amount",
  },
];

interface ISettingsTabs {
  name: string;
  key: string;
  role: keyof IRoleData;
}

export const SETTINGS_TABS: ISettingsTabs[] = [
  {
    name: "Funksionallik",
    key: "functionality",
    role: "role",  // o'zgartirish kere measure
  },
  {
    name: "Chegirmalar",
    key: "clientSettings",
    role: "role",  // o'zgartirish kere 
  },
  {
    name: "Asosiy manzil radiusi",
    key: "mainAddress",
    role: "role",  // o'zgartirish kere measure
  },
  {
    name: "Veb-sayt shartlari",
    key: "websiteConditions",
    role: "role", // o'zgartirish kere siteSettings
  },
  // {
  //   name: "Shaharlar",
  //   key: "cities",
  //   role: "city",
  // },
];

export const MINIMUM_ORDER_OPTIONS = [
  {
    _id: "percent",
    name: "Foiz",
    trans_key: "percent",
  },
  {
    _id: "amount",
    name: "Miqdor",
    trans_key: "amount",
  },
];


export const RATINGS = [
  {
    rate: 5,
  },
  {
    rate: 4,
  },
  {
    rate: 3,
  },
  {
    rate: 2,
  },
  {
    rate: 1,
  },
];