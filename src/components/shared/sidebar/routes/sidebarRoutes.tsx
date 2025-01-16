import { AboutIcon, AnaliticIcon, CategoryIcon, IntegrationIcon, ManageIcon, OrderIcon, ProductIcon, RatingIcon, SettingsIcon, TransactionIcon, UserIcon } from "assets/svgs";
import { ISidebarRoute } from "../sidebar.types";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import DashboardIcon from "@mui/icons-material/Dashboard";

export const sidebarRoutes: ISidebarRoute[] = [
  {
    path: "/order",
    translate: "order",
    role: "order",
    icon: <OrderIcon />,
  },
  {
    path: "/customer",
    translate: "customer",
    role: "customer",
    icon: <UserIcon />,

  },
  {
    path: "/product",
    role: "product",
    translate: "product",
    icon: <ProductIcon />,

  },
  {
    path: "/category",
    role: "category",
    translate: "category",
    icon: <CategoryIcon/>,

  },
  {
    path: "/about",
    role: "_id",
    translate: "about",
    icon: <AboutIcon />,

  },
  {
    translate: "control",
    icon: <ManageIcon />,
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
    icon: <DashboardIcon style={{color: "#3E5089"}} />,
  },
  {
    path: "/news",
    role: "news", 
    translate: "news",
    icon: <NewspaperIcon style={{color: "#3E5089"}} />,
  },
  {
    path: "/rating",
    translate: "rating", 
    role: "rateComment", 
    icon: <RatingIcon />,
  },
  {
    path: "/transaction",
    translate: "transaction",
    role: "transaction",
    icon: <TransactionIcon/>
  },
  {
    path: "/integration",
    role: "integration",
    translate: "integration",
    icon: <IntegrationIcon />,
  },
  {
    icon: <AnaliticIcon/>,
    translate: "analytics",
    role: "report",
    items: [
      {
        path: "/analytics_courier",
        role: "report",
        translate: "courier_analytics",
      },
      {
        path: "/analytics_customer",
        role: "report",
        translate: "customer_analytics",
      },
      {
        path: "/analytics_product",
        role: "report",
        translate: "product_analytics",
      },
      {
        path: "/abc_product",
        role: "report",
        translate: "abc_analytics",
      },
    ]
  },
  {
    icon: <SettingsIcon/>,
    path: "/settings",
    translate: "settings",
    role: "settings",
  },
];
