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
import { TrashIcon, PencilIcon } from "@heroicons/react/24/solid";

const Role = () => {
  const [role, setRole] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const token = Cookies.get("token");

  const handleAssignPermissions = (roleId, permissions) => {
    console.log("Role ID:", roleId);
    console.log("Permissions:", permissions);

    axios
      .post(
        `${import.meta.env.VITE_BASE_URL}/assign-permissions`,
        { role_id: roleId, permissions },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        setAlert({
          type: "success",
          message: "Permissions assigned successfully!",
        });
        closeModal();
      })
      .catch((err) => {
        console.error(err);
        setAlert({ type: "error", message: "Failed to assign permissions." });
      });
  };

  const handleAssignPermissionsSubmit = (e) => {
    e.preventDefault();
    if (!selectedRoleId || selectedPermissions.length === 0) {
      setAlert({
        type: "error",
        message: "Please select a role and at least one permission.",
      });
      return;
    }
    handleAssignPermissions(selectedRoleId, selectedPermissions);
  };

  const handlePermissionChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedPermissions((prev) => [...prev, Number(value)]);
    } else {
      setSelectedPermissions((prev) =>
        prev.filter((id) => id !== Number(value))
      );
    }
  };

  const openModal = (roleId) => {
    setSelectedRoleId(roleId);
    const modal = document.getElementById("edit-role-modal");
    if (modal) {
      modal.style.position = "fixed";
      modal.style.top = "50%";
      modal.style.left = "65%";
      modal.style.transform = "translate(-65%, -50%)";
      modal.style.display = "flex";
      modal.style.width = "40%";
      modal.style.maxWidth = "500px";
      modal.style.backgroundColor = "white";
      modal.style.padding = "20px";
      modal.style.borderRadius = "5px";
      modal.style.boxShadow = "0 2px 4px 0 rgba(0,0,0,0.2)";
    }
  };

  const closeModal = () => {
    const modal = document.getElementById("edit-role-modal");
    if (modal) {
      modal.style.display = "none";
    }
    setSelectedRoleId(null);
    setSelectedPermissions([]);
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/get-all-roles`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setRole(res.data?.data || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, [token]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/get-all-permissions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setPermissions(res.data?.data || []);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [token]);

  const [newRole, setNewRole] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(
        `${import.meta.env.VITE_BASE_URL}/add-role`,
        { role: newRole },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setNewRole("");
        setRole((prev) => [...prev, res.data?.data || {}]);
        setAlert({
          type: "success",
          message: "Role added successfully!",
        });
      })
      .then(() => {
        axios
          .get(`${import.meta.env.VITE_BASE_URL}/get-all-roles`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            setRole(res.data?.data || []);
            setIsLoading(false);
          })
          .catch((err) => {
            console.error(err);
            setIsLoading(false);
          });
      })
      .catch((err) => {
        console.error(err);
        setAlert({ type: "error", message: "Failed to add role." });
      });
  };

  const handleDelete = (id) => {
    axios
      .delete(`${import.meta.env.VITE_BASE_URL}/delete-role/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setRole((prev) => prev.filter((item) => item.id !== id));
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const rolesColumns = [
    {
      key: "name",
      label: "Role",
      render: (data) => <div title={data.name}>{data.name}</div>,

      width: "w-50",
    },
    {
      key: "delete",
      label: "Delete",
      render: (row) => (
        <div className="px-4 py-2 flex gap-2">
          <Tooltip content="Edit">
            <button type="button" onClick={() => openModal(row.id)}>
              <PencilIcon className="h-5 w-5 text-blue-500" />
            </button>
          </Tooltip>
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
          Add New Role
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
            <Typography variant="h6">Role</Typography>
            <Input
              type="text"
              name="role"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
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
          Role Table
        </Typography>
      </div>
      <CardBody className="border rounded-2xl border-gray-300 justify-center items-center">
        {isLoading ? (
          <div className="flex justify-center items-center">
            <Spinner className="h-10 w-10 text-blue-500 justify-center" />
          </div>
        ) : (
          <CustomTable columns={rolesColumns} data={role || []} />
        )}
      </CardBody>

      {/* Edit Role Modal */}
      <div id="edit-role-modal" className="hidden">
        <div className="bg-white rounded-2xl p-4 w-full mx-auto">
          <Typography variant="h3" className="mb-4">
            Assign Permissions
          </Typography>
          <form
            onSubmit={handleAssignPermissionsSubmit}
            className="flex flex-col gap-4"
          >
            <div className="flex items-center justify-center">
              <table className="border border-gray-300 w-full">
                <thead>
                  <tr>
                    <th className="border border-gray-300 p-2 text-center">
                      Select
                    </th>
                    <th className="border border-gray-300 p-2 text-center">
                      Permission Name
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {permissions.map((permission) => (
                    <tr key={permission.id}>
                      <td className="border border-gray-300 p-2 text-center">
                        <input
                          type="checkbox"
                          value={permission.id}
                          onChange={handlePermissionChange}
                        />
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        {permission.name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Button type="submit" color="blue">
              Save
            </Button>
            <Button type="button" onClick={closeModal} color="red">
              Cancel
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Role;
