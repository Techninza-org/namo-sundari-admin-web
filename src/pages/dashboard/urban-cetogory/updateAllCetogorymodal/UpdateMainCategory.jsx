import PropTypes from "prop-types";
import {
    Button,
    Dialog,
    DialogBody,
    DialogHeader,
    DialogFooter,
    Input,
    Spinner,
    Typography,
} from "@material-tailwind/react";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Toaster, { showErrorToast, showSuccessToast } from "@/components/Toaster";

const UpdateMainCategory = ({ open, handleOpen, categoryData }) => {
    const [loading, setLoading] = useState(false);
    const token = Cookies.get("token");
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        description: "",
        image: null,
    });

    useEffect(() => {
        if (categoryData) {
            setFormData({
                id: categoryData.id || "",
                name: categoryData.name || "",
                description: categoryData.description || "",
                image: null,
            });
        }
    }, [categoryData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        const data = new FormData();
        data.append("id", formData.id);
        data.append("name", formData.name);
        data.append("description", formData.description);
        if (formData.image) {
            data.append("image", formData.image);
        }

        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BASE_URL}/admin/update-main-category`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.data.success) {
                showSuccessToast("Category updated successfully!");
                handleOpen();
            } else {
                showErrorToast(response.data.message || "Update failed.");
            }
        } catch (error) {
            console.error("Update error:", error);
            showErrorToast("An error occurred while updating.");
        }

        setLoading(false);
    };

    return (
        <div>
            <Toaster />
            <Dialog open={open} handler={handleOpen}>
                <DialogHeader>Update Main Category</DialogHeader>
                <DialogBody>
                    <div className="grid grid-cols-1 gap-4">
                        <Input
                            label="Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                        <Input
                            label="Description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        />
                        <Input
                            type="file"
                            label="Category Image"
                            onChange={handleImageChange}
                        />
                    </div>
                </DialogBody>
                <DialogFooter>
                    <Button variant="text" onClick={handleOpen} className="mr-2">
                        Cancel
                    </Button>
                    <Button variant="text" onClick={handleSubmit} disabled={loading}>
                        {loading ? <Spinner className="h-4 w-4" /> : "Update"}
                    </Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
};

UpdateMainCategory.propTypes = {
    open: PropTypes.bool.isRequired,
    handleOpen: PropTypes.func.isRequired,
    categoryData: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        name: PropTypes.string,
        description: PropTypes.string,
    }).isRequired,
};

export default UpdateMainCategory;
