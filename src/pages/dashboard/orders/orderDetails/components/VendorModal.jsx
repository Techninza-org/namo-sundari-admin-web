import PropTypes from "prop-types";
import { Dialog, DialogBody, DialogFooter } from "@material-tailwind/react";
import Cookies from "js-cookie";
import axios from "axios";

const VendorModal = ({ open, setOpen, vendorOptions, loading, item,  }) => {
  const token = Cookies.get("token");

  const handleAssign = async (vendorId) => {
    try {
         await axios.put(
        `${import.meta.env.VITE_BASE_URL}/admin/update-assign-vendor`,
        {
          cart_item_id: item.cart_item_id,
          vendor_id: vendorId,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        }
      );

      // const assignedVendor = vendorOptions.data.find((v) => v.id === vendorId);
      
      setOpen(false);
    } catch (error) {
      console.error("Error assigning vendor:", error);
    }
  };

  return (
    <Dialog open={open} handler={setOpen}>
      <DialogBody className="h-96 overflow-y-auto">
        {loading ? (
          <div>Loading vendors...</div>
        ) : vendorOptions.data?.length > 0 ? (
          <ul className="space-y-4">
            {vendorOptions.data.map((vendor) => (
              <li key={vendor.id} className="bg-gray-100 p-4 rounded-md shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {vendor.img_url ? (
                      <img
                        src={vendor.img_url}
                        alt={vendor.full_name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-white">{vendor.full_name[0]}</span>
                      </div>
                    )}
                    <div className="ml-4">
                      <div className="text-lg font-medium text-gray-900">{vendor.full_name}</div>
                      <div className="text-sm text-gray-500">Email: {vendor.email}</div>
                      <div className="text-sm text-gray-500">Phone: {vendor.p_mobile}</div>
                      <div className="text-sm text-gray-500">Gender: {vendor.gender}</div>
                    </div>
                  </div>
                  <button
                    className="py-1 px-3 bg-blue-600 text-white rounded-md text-sm"
                    onClick={() => handleAssign(vendor.id)}
                  >
                    Assign
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div>No vendors available for this category.</div>
        )}
      </DialogBody>
      <DialogFooter>
        <button
          onClick={() => setOpen(false)}
          className="py-2 px-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-md"
        >
          Close
        </button>
      </DialogFooter>
    </Dialog>
  );
};

VendorModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  vendorOptions: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  item: PropTypes.object.isRequired,
  setAssignedVendor: PropTypes.func.isRequired,
};

export default VendorModal;
