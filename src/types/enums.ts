import { useTranslation } from "react-i18next";
import { IRoleData } from "store/reducers/LoginSlice";


export const PAYMENT_TYPES = [
  {
    _id: "cash",
    name: "Naqd",
    trans_key: "cash",
  },
  // {
  //   _id: "card",
  //   name: "Karta",
  //   trans_key: "card",
  // },
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
    name: "functionality",
    key: "functionality",
    role: "role",  // o'zgartirish kere measure
  },
  {
    name: "discounts",
    key: "discountOrder",
    role: "role",  // o'zgartirish kere 
  },
  {
    name: "bonus",
    key: "bonusOrder",
    role: "role",  // o'zgartirish kere 
  },
  {
    name: "premium_discounts",
    key: "premiumDiscountOrder",
    role: "role",  // o'zgartirish kere 
  },
  {
    name: "main_address",
    key: "mainAddress",
    role: "role",  // o'zgartirish kere measure
  },
  {
    name: "website_conditions",
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