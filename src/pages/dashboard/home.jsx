import React, { useEffect, useState } from "react";
import { Typography } from "@material-tailwind/react";
import { ArrowUpIcon } from "@heroicons/react/24/outline";
import {
  UserPlusIcon,
  UsersIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid";
import axios from "axios";
import Cookies from "js-cookie";

// Fallback if StatisticsCard not working
const StatisticsCard = ({ title, value, icon, footer, color }) => (
  <div className={`rounded-xl p-4 shadow-md bg-${color}-100`}>
    <div className="flex items-center gap-4">
      <div className="p-2 bg-black rounded-md">{icon}</div>
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
        {footer}
      </div>
    </div>
  </div>
);

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
        setDashboardData(response.data.data);
      } catch (error) {
        console.error("API error, loading dummy data.");
        // fallback dummy data
        setDashboardData({
          userCount: 10,
          vendorCount: 5,
          unVerifiedVendorCount: 2,
          orderCount: 20,
          categoriesCount: 6,
          subCategoriesCount: 12,
        });
      }
    };

    if (token) {
      fetchData();
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
      value: dashboardData.userCount ?? 0,
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
      value: dashboardData.vendorCount ?? 0,
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
      value: dashboardData.unVerifiedVendorCount ?? 0,
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
      value: dashboardData.orderCount ?? 0,
      footer: {
        color: "text-green-500",
        value: "+7%",
        label: "than last month",
      },
    },
    {
      color: "gray",
      icon: UsersIcon,
      title: "Categories",
      value: dashboardData.categoriesCount ?? 0,
      footer: {
        color: "text-green-500",
        value: "+4%",
        label: "than last month",
      },
    },
    {
      color: "gray",
      icon: ChartBarIcon,
      title: "SubCategories",
      value: dashboardData.subCategoriesCount ?? 0,
      footer: {
        color: "text-green-500",
        value: "+3%",
        label: "than last month",
      },
    },
  ];

  return (
    <div className="mt-12 px-6">
      <div className="mb-12 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {statisticsCardsData.map(
          ({ color, icon, title, footer, value }, index) => (
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
          )
        )}
      </div>
    </div>
  );
}

export default Home;
