import { useState, useEffect, useCallback } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  IconButton,
  Spinner,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";
import Cookies from "js-cookie";
import CustomTable from "../../../components/CustomTable";

function Transaction() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const token = Cookies.get("token");

  const fetchTransactions = useCallback(
    async (page) => {
      if (!token) return;
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${
            import.meta.env.VITE_BASE_URL
          }/admin/get-all-transactions?limit=10&page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        console.log("transactions", data.data);
        setTransactions(data.data);
        // Calculate total pages assuming API doesn't send pagination info
        setTotalPages(Math.ceil(data.data.length / 10) || 1);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    if (token) fetchTransactions(currentPage);
  }, [token, currentPage, fetchTransactions]);

  // Status color helper
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "success":
        return "text-green-500";
      case "pending":
        return "text-yellow-500";
      case "failed":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const columns = [
    {
      key: "sno",
      label: "S.No.",
      render: (row) =>
        (currentPage - 1) * 10 +
        transactions.findIndex((t) => t.id === row.id) +
        1,
      width: "w-20",
    },
    {
      key: "order_id",
      label: "Order ID",
      render: (row) => <div>{row.order_id}</div>,
      width: "w-40",
    },
    {
      key: "amount",
      label: "Amount",
      render: (row) => <div>₹{row.amount}</div>,
      width: "w-32",
    },
    {
      key: "payment_id",
      label: "Payment ID",
      render: (row) => <div className="truncate">{row.payment_id}</div>,
      width: "w-40",
    },
    {
      key: "product_id",
      label: "Product ID",
      render: (row) => <div>{row.product_id}</div>,
      width: "w-32",
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <div
          className={`font-semibold capitalize ${getStatusColor(row.status)}`}>
          {row.status}
        </div>
      ),
      width: "w-32",
    },
    {
      key: "createdAt",
      label: "Created At",
      render: (row) => <div>{new Date(row.createdAt).toLocaleString()}</div>,
      width: "w-60",
    },
  ];

  return (
    <Card>
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h5" color="blue-gray">
              Transaction List
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              View all transactions
            </Typography>
          </div>
        </div>
      </CardHeader>

      <CardBody>
        {loading ? (
          <div className="flex justify-center items-center">
            <Spinner className="h-8 w-8 text-blue-500" />
          </div>
        ) : (
          <CustomTable columns={columns} data={transactions} />
        )}
      </CardBody>

      <CardFooter className="flex justify-between">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}>
          Previous
        </Button>

        <div className="flex items-center gap-2">
          {currentPage > 3 && (
            <>
              <IconButton
                variant="text"
                size="sm"
                onClick={() => setCurrentPage(1)}>
                1
              </IconButton>
              {currentPage > 4 && <p>...</p>}
            </>
          )}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const page = Math.max(1, currentPage - 2) + i;
            if (page > totalPages) return null;
            return (
              <IconButton
                key={page}
                variant="text"
                size="sm"
                onClick={() => setCurrentPage(page)}
                disabled={currentPage === page}>
                {page}
              </IconButton>
            );
          })}
          {currentPage < totalPages - 2 && (
            <>
              {currentPage < totalPages - 3 && <p>...</p>}
              <IconButton
                variant="text"
                size="sm"
                onClick={() => setCurrentPage(totalPages)}>
                {totalPages}
              </IconButton>
            </>
          )}
        </div>

        <Button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}>
          Next
        </Button>
      </CardFooter>
    </Card>
  );
}

export default Transaction;
