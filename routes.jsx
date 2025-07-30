import {
  HomeIcon,
  ArchiveBoxArrowDownIcon,
  UsersIcon,
  TagIcon,
} from "@heroicons/react/24/solid";
import Home from "./src/pages/dashboard/home"; // Fixed path
import Leads from "./src/pages/dashboard/users/Users"; // Fixed path
import PrivateRoute from "@/components/PrivateRoute";
import MainCetogory from "@/pages/dashboard/urban-cetogory/Main-cetogory";
import SubCategory from "@/pages/dashboard/urban-cetogory/SubCetogory";
import SubSubCategory from "@/pages/dashboard/urban-cetogory/Sub-Sub-category";
import AddProduct from "@/pages/dashboard/urban-addProduct/AddProduct";
import BannerManager from "@/pages/dashboard/BannerManager";
import Vendors from "@/pages/dashboard/vendor/Vendor";
import PandingVendors from "@/pages/dashboard/panding-vendor/PandingVendor";
import Order from "@/pages/dashboard/orders/Order";
import { TicketIcon } from "lucide-react";
import Transaction from "@/pages/dashboard/transaction/Transaction";
import BannerPage from "@/pages/dashboard/banners/BannerPage";
import ContactUsQueries from "@/pages/dashboard/Query/query"

const iconClass = "w-5 h-5 text-inherit";

export const routes = [
  {
    layout: "dashboard",

    pages: [
      {
        icon: <HomeIcon className={iconClass} />,
        name: "Dashboard",
        path: "/home", // Fixed path
        element: (
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        ),
      },

      {
        icon: <ArchiveBoxArrowDownIcon className={iconClass} />,
        name: "All Customers",
        path: "/all-users", // Fixed path
        element: (
          <PrivateRoute>
            <Leads />
          </PrivateRoute>
        ),
      },

      // {
      //   icon: <UsersIcon className={iconClass} />,
      //   name: "All Vendors",
      //   path: "/vendor", // Main path for "All Users" without any element
      //   subPages: [
      //     {
      //       name: "Active Vendors",
      //       path: "/vendor/all",
      //       element: (
      //         <PrivateRoute>
      //           {" "}
      //           <Vendors />
      //         </PrivateRoute>
      //       ),
      //     },
      //     {
      //       name: "Panding Vendors",
      //       path: "/vendor/panding",
      //       element: (
      //         <PrivateRoute>
      //           {" "}
      //           <PandingVendors />
      //         </PrivateRoute>
      //       ),
      //     },
      //   ],
      // },

      {
        icon: <UsersIcon className={iconClass} />,
        name: "All Orders",
        path: "/order", // Main path for "All Users" without any element
        subPages: [
          {
            name: "Orders",
            path: "/order/all",
            element: (
              <PrivateRoute>
                {" "}
                <Order />
              </PrivateRoute>
            ),
          },
        ],
      },
      {
        icon: <ArchiveBoxArrowDownIcon className={iconClass} />,
        name: "Create Banner",
        path: "/creare-banner", // Fixed path
        element: (
          <PrivateRoute>
            <BannerPage />
          </PrivateRoute>
        ),
      },

      {
        icon: <TagIcon className={iconClass} />,
        name: "Category",
        path: "/category", // Main path for "All Users" without any element
        subPages: [
          {
            name: "Category",
            path: "/category/main",
            element: <MainCetogory />,
          },
          {
            name: "Sub Category",
            path: "/category/sub",
            element: <SubCategory />,
          },
          // {
          //   name: "Sub Sub Category",
          //   path: "/category/sub-sub",
          //   element: <SubSubCategory />,
          // },
          // {
          //   name: "Create Products",
          //   path: "/products/create",
          //   element: (
          //     <PrivateRoute>
          //       {" "}

          //     </PrivateRoute>
          //   ),
          // },
        ],
      },

      {
        icon: <TicketIcon className={iconClass} />,
        name: "Products",
        path: "/products", // Fixed path
        element: (
          <PrivateRoute>
            {" "}
            <AddProduct />{" "}
          </PrivateRoute>
        ),
      },

        {
        icon: <ArchiveBoxArrowDownIcon className={iconClass} />,
        name: "Queries",
        path: "/queries", // Fixed path
        element: (
          <PrivateRoute>
            <ContactUsQueries />
          </PrivateRoute>
        ),
      },
      {
        icon: <TicketIcon className={iconClass} />,
        name: "Transaction",
        path: "/transaction", // Fixed path
        element: (
          <PrivateRoute>
            {" "}
            <Transaction />
          </PrivateRoute>
        ),
      },
      {
        icon: <TicketIcon className={iconClass} />,
        name: "Setting",
        path: "/setting", // Fixed path
        element: (
          <PrivateRoute>
            {" "}
            <Transaction />
          </PrivateRoute>
        ),
      },
    ],
  },
];

export default routes;
