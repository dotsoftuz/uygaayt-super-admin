import { lazy } from "react";
import { Navigate, RouteObject } from "react-router-dom";
import { IRoleData } from "store/reducers/LoginSlice";

const BLACK_PAGE = lazy(() => import("pages/black_page"));
const Order = lazy(() => import("pages/order"));
const Customer = lazy(() => import("pages/customer"));
const Product = lazy(() => import("pages/product"));
const Category = lazy(() => import("pages/category"));
const About = lazy(() => import("pages/about"));
const Employee = lazy(() => import("pages/employee"));
const Role = lazy(() => import("pages/role"));
const Transaction = lazy(() => import("pages/transaction"));
const Integration = lazy(() => import("pages/integration"));
const Settings = lazy(() => import("pages/settings"));
const Banner = lazy(() => import("pages/banner"));
const Measure = lazy(() => import("pages/measure"));
const Courier = lazy(() => import("pages/courier"));
const Rating = lazy(() => import("pages/rating"));

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
    element: <Order />,
    path: "order/*",
    role: "order",
  },
  {
    element: <Customer />,
    path: "customer",
    role: "customer",
  },
  {
    element: <Product />,
    path: "product",
    role: "product",
  },
  {
    element: <Category />,
    path: "category",
    role: "storeProductCategory",
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
    role: "role", // o'zgartirish kerak banner
  },
  {
    element: <Measure />,
    path: "measure",
    role: "role", // o'zgartirish kerak measure
  },
  {
    element: <Courier />,
    path: "courier",
    role: "role", // o'zgartirish kerak courier
  },
  {
    element: <Rating />,
    path: "/rating",
    role: "role", // o'zgartirish kerak rateComment
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
    role: "_id",
  },
];

export default privateRoutes;
