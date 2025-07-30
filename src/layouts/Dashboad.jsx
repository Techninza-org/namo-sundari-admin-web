import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../layout/Sidebar";
import routes from "../../routes";
import DashboardNavbar from "../layout/dashboard-navbar";
import { useState } from "react";
import AddDescription from "@/pages/dashboard/urban-addProduct/DescriptionProduct";
import PrivateRoute from "@/components/PrivateRoute";
import OrderDetail from "@/pages/dashboard/urban-addProduct/OrderDetail";
import ViewProductDetails from "@/pages/dashboard/urban-addProduct/VIewProductDetails";
import UserDetail from "@/pages/dashboard/users/UserDetail";
import VendorDetailsTable from "@/pages/dashboard/vendor/VendorDetail";
import PandingVendorDetailsTable from "@/pages/dashboard/panding-vendor/PandingVendorDetail";
import ProductOrderDetail from "@/pages/dashboard/orders/orderDetails/ProductOrderDetail";
import UsersOrder from "@/pages/dashboard/users/userOrder";
import VendorOrder from "@/pages/dashboard/vendor/VendorOrder";
import Setting from "@/pages/dashboard/Setting";
import EditProductPage from "@/pages/dashboard/urban-addProduct/EditProduct"

const Dashboard = () => {
  // Local state for toggling sidebar visibility on mobile
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-blue-gray-50/50">
      {/* Sidebar */}
      <div
        className={`transition-all duration-300 ${
          isOpen ? "w-72" : "w-0"
        } md:w-72`}
      >
        <Sidebar routes={routes} isOpen={isOpen} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 md:ml-4 h-screen overflow-y-auto transition-all duration-300">
        <DashboardNavbar isOpen={isOpen} setIsOpen={setIsOpen} />
        <Routes>
          {/* Redirect /dashboard to /dashboard/home */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/user-detail/:id" element={<UserDetail />} />
          <Route path="/vendor-detail/:id" element={<VendorDetailsTable />} />
          <Route path="/panding-vendor-detail/:id" element={<PandingVendorDetailsTable />} />
          <Route path="/product-order-detail/:id" element={<ProductOrderDetail />} />
          <Route path="/user-order/:id" element={<UsersOrder />} />
          <Route path="/vendor-order/:id" element={<VendorOrder />} />
          <Route path="/edit-product/:id" element={<EditProductPage />} />

        
          <Route
            path="/order-detail/:id"
            element={
              <PrivateRoute>
                {" "}
                <OrderDetail />
              </PrivateRoute>
            }
          />
          <Route path="/add-description/:id" element={<AddDescription />} />
           <Route path="/setting" element={<Setting />} />
          <Route
            path="/view-product-detail/:id"
            element={<ViewProductDetails />}
          />
          {routes.map(({ layout, pages }) =>
            layout === "dashboard"
              ? pages.map(({ path, element, subPages }) => (
                  <>
                    <Route
                      key={path}
                      path={path.replace("/", "")}
                      element={element}
                    />
                    {/* Handle subpages routing */}
                    {subPages?.map((subPage) => (
                      <Route
                        key={subPage.path}
                        path={subPage.path}
                        element={subPage.element || <div>Not Implemented</div>}
                      />
                    ))}
                  </>
                ))
              : null
          )}
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
