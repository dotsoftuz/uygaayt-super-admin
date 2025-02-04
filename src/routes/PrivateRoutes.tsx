import { lazy } from "react";
import { Navigate, RouteObject } from "react-router-dom";
import { IRoleData } from "store/reducers/LoginSlice";

const BLACK_PAGE = lazy(() => import("pages/black_page"));
const Dashboard = lazy(() => import("pages/dashboard"));
const Order = lazy(() => import("pages/order"));
const Customer = lazy(() => import("pages/customer"));
const Product = lazy(() => import("pages/product"));
const Category = lazy(() => import("pages/category"));
const CategoryChild = lazy(() => import("pages/category/info/CategoryChild"));
const About = lazy(() => import("pages/about"));
const Employee = lazy(() => import("pages/employee"));
const Role = lazy(() => import("pages/role"));
const Transaction = lazy(() => import("pages/transaction"));
const Integration = lazy(() => import("pages/integration"));
const Settings = lazy(() => import("pages/settings"));
const Banner = lazy(() => import("pages/banner"));
const News = lazy(() => import("pages/news"));
const Measure = lazy(() => import("pages/measure"));
const Courier = lazy(() => import("pages/courier"));
const Rating = lazy(() => import("pages/rating"));
const PromoCode = lazy(() => import("pages/promo_code"));
const Attribute = lazy(() => import("pages/attribute"));

const CourierAnalytics = lazy(() => import("pages/courier_analytics"));
const CustomerAnalytics = lazy(() => import("pages/customer_analytics"));
const ProductAnalytics = lazy(() => import("pages/product_analytics"));
const AbcAnalytics = lazy(() => import("pages/abc_analytics"));


const privateRoutes: (RouteObject & { role: keyof IRoleData })[] = [
  {
    element: <Navigate to="home" replace />,
    path: "*",
    role: "_id",
  },
  {
    element: <Navigate to="home" replace />,
    path: "/",
    role: "_id",
  },
  {
    element: <BLACK_PAGE />,
    path: "home",
    role: "_id",
  },
  {
    element: <Dashboard />,
    path: "dashboard",
    role: "_id", // must change
  },
  {
    element: <Order />,
    path: "order/*",
    role: "order",
  },
  {
    element: <Customer />,
    path: "customer/*",
    role: "customer",
  },
  {
    element: <Product />,
    path: "product",
    role: "product",
  },
  {
    element: <Category />,
    path: "category/*",
    role: "category",
  },
  {
    element: <CategoryChild />,
    path: "category_child",
    role: "employee",
  },
  {
    element: <About />,
    path: "about",
    role: "_id",
  },
  {
    element: <Employee />,
    path: "employee",
    role: "employee",
  },
  {
    element: <Role />,
    path: "role",
    role: "role",
  },
  {
    element: <Banner />,
    path: "banner",
    role: "banner",
  },
  {
    element: <News />,
    path: "news",
    role: "news", 
  },
  {
    element: <Attribute />,
    path: "attribute",
    role: "_id", // must change 
  },
  {
    element: <Measure />,
    path: "measure",
    role: "measure",
  },
  {
    element: <Courier />,
    path: "courier/*",
    role: "courier",
  },
  {
    element: <Rating />,
    path: "/rating",
    role: "rateComment",
  },
   {
    element: <PromoCode />,
    path: "/promo_code",
    role: "_id", // must change
  },
  {
    element: <Transaction />,
    path: "transaction",
    role: "transaction",
  },
  {
    element: <Integration />,
    path: "integration",
    role: "integration",
  },
  {
    element: <Settings />,
    path: "settings",
    role: "settings",
  },
  {
    element: <CourierAnalytics />,
    path: "analytics_courier",
    role: "report",
  },
  {
    element: <CustomerAnalytics />,
    path: "analytics_customer",
    role: "report",
  },
  {
    element: <ProductAnalytics />,
    path: "analytics_product",
    role: "report",
  },
  {
    element: <AbcAnalytics />,
    path: "abc_product",
    role: "report",
  },
];

export default privateRoutes;
