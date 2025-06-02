import React, { useEffect, useState } from "react";
import { Typography } from "@material-tailwind/react";
import { ArrowUpIcon } from "@heroicons/react/24/outline";
import {
  // BanknotesIcon,
  UserPlusIcon,
  UsersIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid";
import axios from "axios";
import Cookies from "js-cookie";
import { StatisticsCard } from "@/widgets/cards";
// import { StatisticsChart } from "@/widgets/charts";

export function Home() {
  const token = Cookies.get("token");
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/admin/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        // console.log(response.data.data, "response.data.data");
        setDashboardData(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (token) {
      fetchData();
    } else {
      // navigate("/login");
    }
  }, [token]);

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Typography variant="h5" color="blue-gray">
          Loading Dashboard...
        </Typography>
      </div>
    );
  }

  const statisticsCardsData = [
    {
      color: "gray",
      icon: UsersIcon,
      title: "Users",
      value: dashboardData.userCount,
      footer: {
        color: "text-green-500",
        value: "+5%",
        label: "than last month",
      },
    },
    {
      color: "gray",
      icon: ArrowUpIcon,
      title: "Vendors",
      value: dashboardData.vendorCount,
      footer: {
        color: "text-green-500",
        value: "+2%",
        label: "than last month",
      },
    },
    {
      color: "gray",
      icon: UserPlusIcon,
      title: "Unverified Vendors",
      value: dashboardData.unVerifiedVendorCount,
      footer: {
        color: "text-red-500",
        value: "-1%",
        label: "than last month",
      },
    },
    {
      color: "gray",
      icon: ChartBarIcon,
      title: "Orders",
      value: dashboardData.orderCount,
      footer: {
        color: "text-green-500",
        value: "+7%",
        label: "than last month",
      },
    },
  ];

  // const statisticsChartsData = dashboardData ? [
  //   {
  //     color: "blue",
  //     title: "User Growth",
  //     description: "Monthly new users",
  //     chart: {
  //       labels: ["Jan", "Feb", "Mar", "Apr", "May"],
  //       datasets: [{ label: "Users", data: [5, 10, 7, 8, dashboardData.userCount] }],
  //     },
  //     footer: "updated 1 minute ago",
  //   },
  //   {
  //     color: "green",
  //     title: "Order Growth",
  //     description: "Monthly new orders",
  //     chart: {
  //       labels: ["Jan", "Feb", "Mar", "Apr", "May"],
  //       datasets: [{ label: "Orders", data: [2, 3, 4, 5, dashboardData.orderCount] }],
  //     },
  //     footer: "updated 1 minute ago",
  //   },
  //   {
  //     color: "red",
  //     title: "Vendor Verification",
  //     description: "Vendors verified",
  //     chart: {
  //       labels: ["Jan", "Feb", "Mar", "Apr", "May"],
  //       datasets: [{ label: "Unverified", data: [1, 2, 2, 3, dashboardData.unVerifiedVendorCount] }],
  //     },
  //     footer: "updated 1 minute ago",
  //   },
  // ] : [];
  

  return (
    <div className="mt-12">
      {/* Statistics Cards */}
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        {statisticsCardsData.map(({ color, icon, title, footer, value }, index) => (
          <StatisticsCard
            key={index}
            title={title}
            value={value}
            color={color}
            icon={React.createElement(icon, {
              className: "w-6 h-6 text-white",
            })}
            footer={
              <Typography className="font-normal text-blue-gray-600">
                <strong className={footer.color}>{footer.value}</strong>
                &nbsp;{footer.label}
              </Typography>
            }
          />
        ))}
      </div>

      {/* Charts */}
      {/* <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
        {statisticsChartsData.map((props) => (
          <StatisticsChart
            key={props.title}
            {...props}
            footer={
              <Typography
                variant="small"
                className="flex items-center font-normal text-blue-gray-600"
              >
                <ClockIcon strokeWidth={2} className="h-4 w-4 text-blue-gray-400" />
                &nbsp;{props.footer}
              </Typography>
            }
          />
        ))}
      </div> */}

      {/* Projects and Orders Section */}
      <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Your existing Projects and Orders code */}
      </div>
    </div>
  );
}

export default Home;
