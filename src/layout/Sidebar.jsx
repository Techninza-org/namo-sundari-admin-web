import { NavLink } from "react-router-dom";
import {
  Card,
  Typography,
  List,
  ListItemPrefix,
} from "@material-tailwind/react";
import PropTypes from "prop-types";
import {
  BuildingOfficeIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  UserIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
// import Cookies from "js-cookie";

function Sidebar({ routes, isOpen }) {
  const [openDropdown, setOpenDropdown] = useState(null);
  // const [accessTo, setAccessTo] = useState([]);

  // const user = Cookies.get("user");
  // const role = JSON.parse(user)?.role || "";

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const permissions = Cookies.get("permissions");
  //     if (permissions) {
  //       try {
  //         const accessArray = JSON.parse(permissions);
  //         setAccessTo(accessArray);
  //         // console.log("Updated Permissions:", accessArray); // Debugging line
  //       } catch (error) {
  //         console.error("Error parsing permissions:", error);
  //       }
  //     }
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, []);

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };
  return (
    <div
      className={`fixed md:relative inset-y-0 left-0 z-50 transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0`}>
      <Card
        className="h-[100vh] w-72 border border-blue-100 bg-gradient-to-br from-gray-800 to-gray-900"
        style={{
          background:
            "linear-gradient(to bottom right, #2d3748, #1a202c), #2d3748", // Fallback for older browsers
        }}>
        <div className="mb-4 flex items-center gap-4 p-4">
          {/* <div className="h-10 w-10 rounded-lg flex items-center justify-center">
            <img
              src="https://sooprs.com/assets/images/sooprs_white_logo.webp"
              alt="brand"
              className="h-full w-full object-cover"
            />
          </div> */}
          <Typography variant="h5" color="white">
            NamohSundari Admin
          </Typography>
        </div>
        <List>
          {routes.map(({ layout, pages }) =>
            layout === "dashboard"
              ? pages.map(({ name, path, icon, subPages }) => (
                  <div key={path}>
                    <NavLink
                      to={subPages ? "#" : path} // Prevents navigation for "All Users"
                      className={({ isActive }) =>
                        `flex items-center px-4 py-2 rounded-lg transition-colors ${
                          isActive && !subPages
                            ? "bg-blue-500 text-white"
                            : "text-white hover:bg-gray-700"
                        }`
                      }
                      onClick={(e) => {
                        if (subPages) {
                          e.preventDefault(); // Prevents navigation
                          toggleDropdown(name); // Only toggles dropdown
                        }
                      }}>
                      <ListItemPrefix className="mr-2">{icon}</ListItemPrefix>
                      <Typography
                        color="blue-gray"
                        className="mr-auto font-normal">
                        {name}
                      </Typography>

                      {subPages &&
                        (openDropdown === name ? (
                          <ChevronUpIcon className="w-4 h-4" />
                        ) : (
                          <ChevronDownIcon className="w-4 h-4" />
                        ))}
                    </NavLink>

                    {/* Render subPages if available */}
                    <AnimatePresence>
                      {subPages && openDropdown === name && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="ml-6 overflow-hidden mt-2">
                          {subPages.map(({ name, path }) => (
                            <NavLink
                              key={path}
                              to={path}
                              className={({ isActive }) =>
                                `flex items-center px-4 py-2 rounded-lg transition-colors ${
                                  isActive
                                    ? "bg-blue-400 text-white"
                                    : "text-white hover:bg-gray-700"
                                }`
                              }>
                              {/* Add icons for subcategories */}
                              <ListItemPrefix className="mr-2">
                                {name === "Users" && (
                                  <UserIcon className="w-4 h-4" />
                                )}
                                {name === "Professional" && (
                                  <UserIcon className="w-4 h-4" />
                                )}
                                {name === "Client" && (
                                  <UsersIcon className="w-4 h-4" />
                                )}
                                {name === "Agency" && (
                                  <BuildingOfficeIcon className="w-4 h-4" />
                                )}
                              </ListItemPrefix>
                              <Typography
                                color="blue-gray"
                                className="mr-auto font-normal">
                                {name}
                              </Typography>
                            </NavLink>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))
              : null
          )}
        </List>
      </Card>
    </div>
  );
}

Sidebar.propTypes = {
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      layout: PropTypes.string.isRequired,
      pages: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          path: PropTypes.string.isRequired,
          icon: PropTypes.node.isRequired,
          subPages: PropTypes.array,
        })
      ).isRequired,
    })
  ).isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default Sidebar;
