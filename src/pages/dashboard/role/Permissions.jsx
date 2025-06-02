import {
  Card,
  CardBody,
  Input,
  Button,
  Spinner,
  Typography,
  Tooltip,
  Alert,
} from "@material-tailwind/react";
import axios from "axios";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import CustomTable from "../../../components/CustomTable";
import { TrashIcon } from "@heroicons/react/24/solid";

const Permissions = () => {
  const [permissions, setPermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const token = Cookies.get("token");

  useEffect(() => {
    axios
      .get("http://103.189.172.154:3004/api/get-all-permissions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setPermissions(res.data?.data || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, [token]);

  const [permission, setPermission] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(
        "http://103.189.172.154:3004/api/add-permission",
        { permission },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setPermission("");
        setPermissions((prev) => [...prev, res.data?.data || {}]);
        setAlert({
          type: "success",
          message: "Permission added successfully!",
        });
      })
      .then(() => {
        axios
          .get("http://103.189.172.154:3004/api/get-all-permissions", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            setPermissions(res.data?.data || []);
            setIsLoading(false);
          })
          .catch((err) => {
            console.error(err);
            setIsLoading(false);
          });
      })
      .catch((err) => {
        console.error(err);
        setAlert({ type: "error", message: "Failed to add permission." });
      });
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://103.189.172.154:3004/api/delete-permission/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setPermissions((prev) => prev.filter((item) => item.id !== id));
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const permissionsColumns = [
    {
      key: "name",
      label: "Permission",
      render: (data) => <div title={data.name}>{data.name}</div>,
      width: "w-50",
    },
    {
      key: "delete",
      label: "Delete",
      render: (row) => (
        <div className="px-4 py-2 flex gap-2">
          <Tooltip content="Delete">
            <button onClick={() => handleDelete(row.id)}>
              <TrashIcon className="h-5 w-5 text-red-500" />
            </button>
          </Tooltip>
        </div>
      ),
      width: "w-20",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto mt-5 px-4">
      <Card
        color="transparent"
        shadow={false}
        className="p-6 border border-gray-300 shadow-sm rounded-2xl"
      >
        <Typography variant="h4" color="blue-gray">
          Add New Permission
        </Typography>
        <form onSubmit={handleSubmit} className="mt-4 gap-4 w-full">
          {alert && (
            <Alert
              color={alert.type === "success" ? "green" : "red"}
              className="mb-4"
            >
              {alert.message}
            </Alert>
          )}
          <div className="flex flex-col justify-center w-full">
            <Typography variant="h6">Permission</Typography>
            <Input
              type="text"
              name="permission"
              value={permission}
              onChange={(e) => setPermission(e.target.value)}
              className="border border-gray-500 px-3 py-2 focus:outline-none w-2xl"
            />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <Button
              type="submit"
              className="mt-4 w-full md:w-auto bg-blue-500 hover:bg-blue-700"
            >
              Submit
            </Button>
          </div>
        </form>
      </Card>
      <div className="mt-8">
        <Typography variant="h5" color="blue-gray">
          Permissions Table
        </Typography>
      </div>
      <CardBody className="border rounded-2xl border-gray-300">
        {isLoading ? (
          <div className="flex justify-center items-center">
            <Spinner className="h-8 w-8 text-blue-500" />
          </div>
        ) : (
          <CustomTable columns={permissionsColumns} data={permissions || []} />
        )}
      </CardBody>
    </div>
  );
};

export default Permissions;
