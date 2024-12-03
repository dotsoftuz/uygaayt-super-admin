import { ISidebarRoute } from "../sidebar.types";

export const sidebarRoutes: ISidebarRoute[] = [
  {
    path: "/order",
    translate: "order",
    role: "order",
  },
  {
    path: "/customer",
    translate: "customer",
    role: "customer",
  },
  {
    path: "/product",
    role: "product",
    translate: "product",
  },
  {
    path: "/category",
    role: "category",
    translate: "category",
  },
  {
    path: "/about",
    role: "_id",
    translate: "about",
  },
  {
    translate: "control",
    items: [
      {
        path: "/employee",
        role: "employee",
        translate: "employee",
      },
      {
        path: "/role",
        role: "role",
        translate: "role",
      },
      {
        path: "/courier",
        role: "courier",
        translate: "courier",
      },
    ]
  },
  // {
  //   path: "/measure",
  //   role: "role", // o'zgartirish kerak measure
  //   translate: "measure",
  // },
  {
    path: "/banner",
    role: "banner", 
    translate: "banner",
  },
  {
    path: "/news",
    role: "news", 
    translate: "news",
  },
  {
    path: "/rating",
    translate: "rating", 
    role: "rateComment", 
  },
  {
    path: "/transaction",
    translate: "transaction",
    role: "transaction",
  },
  // {
  //   path: "/integration",
  //   role: "integration",
  //   translate: "integration",
  // },
  {
    path: "/settings",
    translate: "settings",
    role: "settings",
  },
];
