import ArticleIcon from "@mui/icons-material/Article";
import DashboardIcon from "@mui/icons-material/Dashboard";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import RateReviewIcon from "@mui/icons-material/RateReview";
import StoreIcon from "@mui/icons-material/Store";
import ViewCarouselIcon from "@mui/icons-material/ViewCarousel";
import {
  AboutIcon,
  AnaliticIcon,
  CategoryIcon,
  DashboardIconMain,
  IntegrationIcon,
  ManageIcon,
  OrderIcon,
  PaymentType,
  ProductIcon,
  SettingsIcon,
  TransactionIcon,
  UserIcon,
} from "assets/svgs";
import { ISidebarRoute } from "../sidebar.types";

export const sidebarRoutes: ISidebarRoute[] = [
  {
    path: "/dashboard",
    translate: "dashboard",
    role: "_id", // must change
    icon: <DashboardIconMain />,
  },
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
    icon: <CategoryIcon />,
  },
  {
    path: "/stores_restaurants",
    role: "_id",
    translate: "stores_restaurants",
    icon: <StoreIcon style={{ color: "#EB5B00" }} />,
  },
  // {
  //   path: "/settings?tab=about",
  //   role: "_id",
  //   translate: "about",
  //   icon: <AboutIcon />,
  // },
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
    ],
  },
  {
    path: "/banner",
    role: "banner",
    translate: "banner",
    icon: <ViewCarouselIcon className="text-[#fff]" />,
  },
  {
    path: "/news",
    role: "news",
    translate: "news",
    icon: <NewspaperIcon style={{ color: "#EB5B00" }} />,
  },
  {
    path: "/promo_code",
    role: "_id", // must change
    translate: "promo_code",
    icon: <DashboardIcon style={{ color: "#EB5B00" }} />,
  },
  {
    path: "/attribute",
    role: "_id", // must change
    translate: "attribute",
    icon: <ArticleIcon style={{ color: "#EB5B00" }} />,
  },
  // {
  //   path: "/rating",
  //   translate: "rating",
  //   role: "rateComment",
  //   icon: <RatingIcon />,
  // },
  {
    path: "/review",
    translate: "review",
    role: "employee",
    icon: <RateReviewIcon style={{ color: "#EB5B00" }} />,
  },
  {
    path: "/transaction",
    translate: "transaction",
    role: "transaction",
    icon: <TransactionIcon />,
  },
  // {
  //   path: "/integration",
  //   role: "integration",
  //   translate: "integration",
  //   icon: <IntegrationIcon />,
  // },
  {
    path: "/payment-method",
    role: "_id", // must change
    translate: "payment_method",
    icon: <PaymentType />,
  },
  {
    icon: <AnaliticIcon />,
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
      {
        path: "/analytics_constructor",
        role: "report",
        translate: "constructor_analytics",
      },
    ],
  },
  {
    icon: <SettingsIcon />,
    path: "/settings",
    translate: "settings",
    role: "settings",
  },
];
