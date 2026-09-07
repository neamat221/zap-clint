import { createBrowserRouter } from "react-router";
import Layout from "../Layouts/Layout";
import Home from "../Pages/Home/Home";
import BeARider from "../Pages/BeARider/BeARider";
import PricingCalculator from "../Pages/PricingCalculator/PricingCalculator";
import AboutUs from "../Pages/AboutUs/AboutUs";
import TakeOrder from "../Pages/TakeOrder/TakeOrder";
import SendAParcelPage from "../Pages/SendAParcel/SendAParcelPage";
import CoverageDistrictsPage from "../Pages/CoverageDistricts/CoverageDistrictsPage";
import AssignRiderPage from "../Pages/AssignRider/AssignRiderPage";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
import Error404 from "../Pages/Error404/Error404";
import PrivateRouter from "../PrivateRouter/PrivateRouter";
import { dashboardRoute } from "../Pages/Dashboard/Dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        element: <PrivateRouter />,
        children: [
          {
            path: "be-a-rider",
            Component: BeARider,
          },
          {
            path: "pricing",
            Component: PricingCalculator,
          },
          {
            path: "take-order",
            Component: TakeOrder,
          },
          {
            path: "send-a-parcel",
            Component: SendAParcelPage,
          },
          {
            path: "assign-rider",
            Component: AssignRiderPage,
          },
        ],
      },
      {
        path: "about",
        Component: AboutUs,
      },
      {
        path: "coverage-districts",
        Component: CoverageDistrictsPage,
      },
      {
        path: "login",
        Component: Login,
      },
      {
        path: "register",
        Component: Register,
      },
      {
        path: "*",
        Component: Error404,
      },
    ],
  },
  dashboardRoute,
]);
