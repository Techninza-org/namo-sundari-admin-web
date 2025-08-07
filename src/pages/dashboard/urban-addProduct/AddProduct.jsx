import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Select from "react-select";
import {
  Card,
  Input,
  Button,
  Typography,
  Spinner,
  Tooltip,
} from "@material-tailwind/react";
import Cookies from "js-cookie";
import {
  XCircleIcon,
  PlusCircleIcon,
  TrashIcon,
  ViewfinderCircleIcon,
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

function AddProduct() {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    mainCategoryId: null,
    subCategoryId: null,
    vendorId: null,
    variants: [
      {
        sku: "",
        price: "",
        stock: "",
        attributes: [
          { key: "color", value: "" },
          { key: "size", value: "" },
        ],
      },
    ],
    images: [[], []],
  });

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = Cookies.get("token");

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchAdmins();
  }, [token]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/admin/get-all-products`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProducts(data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    if (!token) return;
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/admin/get-all-main-categories`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCategories(data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchSubCategories = useCallback(
    async (categoryId) => {
      setLoading(true);
      if (!token || !categoryId) return;
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/admin/get-all-sub-categories`,
          { 
            headers: { Authorization: `Bearer ${token}` },
            params: { mainCategoryId: categoryId }
          }
        );
        setSubCategories(data.subCategories);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  const fetchAdmins = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/admin/get-all-admins`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAdmins(data.admins);
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (selectedOption) => {
    setProduct((prev) => ({
      ...prev,
      mainCategoryId: selectedOption,
      subCategoryId: null,
    }));
    fetchSubCategories(selectedOption.value);
  };

  const handleSubCategoryChange = (selectedOption) => {
    setProduct((prev) => ({
      ...prev,
      subCategoryId: selectedOption,
    }));
  };

  // const handleAdminChange = (selectedOption) => {
  //   setProduct((prev) => ({ ...prev, adminId: selectedOption }));
  // };

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...product.variants];
    updatedVariants[index][field] = value;
    setProduct((prev) => ({ ...prev, variants: updatedVariants }));
  };

  const handleAttributeChange = (variantIndex, attrIndex, field, value) => {
    const updatedVariants = [...product.variants];
    updatedVariants[variantIndex].attributes[attrIndex][field] = value;
    setProduct((prev) => ({ ...prev, variants: updatedVariants }));
  };

  const addVariant = () => {
    setProduct((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          sku: "",
          price: "",
          stock: "",
          attributes: [
            { key: "color", value: "" },
            { key: "size", value: "" },
          ],
        },
      ],
      images: [...prev.images, []],
    }));
  };

  const removeVariant = (index) => {
    if (product.variants.length === 1) return;

    const updatedVariants = [...product.variants];
    updatedVariants.splice(index, 1);

    const updatedImages = [...product.images];
    updatedImages.splice(index, 1);

    setProduct((prev) => ({
      ...prev,
      variants: updatedVariants,
      images: updatedImages,
    }));
  };

  const addAttribute = (variantIndex) => {
    const updatedVariants = [...product.variants];
    updatedVariants[variantIndex].attributes.push({ key: "", value: "" });
    setProduct((prev) => ({ ...prev, variants: updatedVariants }));
  };

  const removeAttribute = (variantIndex, attrIndex) => {
    if (product.variants[variantIndex].attributes.length === 1) return;

    const updatedVariants = [...product.variants];
    updatedVariants[variantIndex].attributes.splice(attrIndex, 1);
    setProduct((prev) => ({ ...prev, variants: updatedVariants }));
  };

  const handleImageChange = (variantIndex, e) => {
    const files = Array.from(e.target.files);
    setProduct((prev) => {
      const updatedImages = [...prev.images];
      updatedImages[variantIndex] = [...updatedImages[variantIndex], ...files];
      return { ...prev, images: updatedImages };
    });
  };

  const removeImage = (variantIndex, imageIndex) => {
    setProduct((prev) => {
      const updatedImages = [...prev.images];
      updatedImages[variantIndex].splice(imageIndex, 1);
      return { ...prev, images: updatedImages };
    });
  };

  const validateForm = () => {
    if (!product.name || product.name.length < 3) {
      alert("Product name must be at least 3 characters long");
      return false;
    }
    if (!product.description) {
      alert("Description is required");
      return false;
    }
    if (!product.mainCategoryId) {
      alert("Please select a main category");
      return false;
    }
    if (!product.subCategoryId) {
      alert("Please select a subcategory");
      return false;
    }
    // if (!product.adminId) {
    //   alert("Please select an admin");
    //   return false;
    // }

    for (let i = 0; i < product.variants.length; i++) {
      const variant = product.variants[i];
      if (!variant.sku) {
        alert(`SKU is required for variant ${i + 1}`);
        return false;
      }
      if (!variant.price || variant.price <= 0) {
        alert(`Price must be greater than 0 for variant ${i + 1}`);
        return false;
      }
      if (!variant.stock || variant.stock <= 0) {
        alert(`Stock must be greater than 0 for variant ${i + 1}`);
        return false;
      }

      for (let j = 0; j < variant.attributes.length; j++) {
        const attr = variant.attributes[j];
        if (!attr.key || !attr.value) {
          alert(
            `Both key and value are required for all attributes in variant ${i + 1}`
          );
          return false;
        }
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("description", product.description);
      formData.append("mainCategoryId", product.mainCategoryId.value);
      formData.append("subCategoryId", product.subCategoryId.value);
      // formData.append("adminId", product.adminId.value);

      formData.append("variants", JSON.stringify(product.variants));

      product.images.forEach((variantImages, variantIndex) => {
        variantImages.forEach((image, imageIndex) => {
          formData.append(`images_${variantIndex}`, image);
        });
      });

      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin/add-product`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Product added successfully!");
      fetchProducts();

      setProduct({
        name: "",
        description: "",
        mainCategoryId: null,
        subCategoryId: null,
        // adminId: null,
        variants: [
          {
            sku: "",
            price: "",
            stock: "",
            attributes: [
              { key: "color", value: "" },
              { key: "size", value: "" },
            ],
          },
        ],
        images: [[]],
      });
    } catch (error) {
      console.error("Failed to add product:", error);
      alert(
        "Failed to add product. " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    setLoading(true);
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/admin/delete-product/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Product deleted successfully!");
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert(
        "Failed to delete product: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };


  //toggle active/Inactive 

  const toggleActive = async (id) => {

    if (!confirm("Are you sure you want to toggle the status of this product?")) {
      return;
    }
    setLoading(true);
    try {
      await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/admin/soft-delete-product/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
        ) 
      alert("Product status updated successfully!");
      fetchProducts();
    } catch (error) {
      console.error("Error updating product status:", error);
      alert(
        "Failed to update product status: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };  



  const columns = [
    { key: "name", label: "Name", render: (row) => row.name },
    {
      key: "variants",
      label: "Variants",
      render: (row) => row.variants?.length || 0,
    },
    {
      key: "price",
      label: "Price Range",
      render: (row) => {
        if (!row.variants || row.variants.length === 0) return "N/A";
        const prices = row.variants.map((v) => parseFloat(v.price));
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        return min === max
          ? `₹${min.toFixed(2)}`
          : `₹${min.toFixed(2)} - ₹${max.toFixed(2)}`;
      },
    },
{
  key: "isActive",
  label: "Active",
  render: (row) => (
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={!!row.isActive}
        onChange={() => toggleActive(row.id)}
        className="sr-only peer"
      />

      {/* Track */}
      <div className="w-11 h-6 bg-gray-300 peer-checked:bg-green-500 rounded-full relative transition-colors duration-300">
        {/* Thumb */}
        <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-all duration-300 transform peer-checked:translate-x-5"></div>
      </div>

      <span className="ml-2 text-sm text-gray-700">
        {row.isActive ? "Active" : "Inactive"}
      </span>
    </label>
  ),
},
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="px-4 py-2 flex gap-2">
          <Tooltip content="Product Details">
            <Link
              to={`/view-product-detail/${row.id}`}
              className="text-blue-500">
              <button>
                <ViewfinderCircleIcon className="h-5 w-5 text-green-500" />
              </button>
            </Link>
          </Tooltip>
          <Tooltip content="Edit">
            <Link to={`/edit-product/${row.id}`} className="text-blue-500">
              <button>
                <PlusCircleIcon className="h-5 w-5 text-blue-500" />
              </button>
            </Link>
          </Tooltip>
          <Tooltip content="Delete">
            <button onClick={() => handleDelete(row.id)}>
              <TrashIcon className="h-5 w-5 text-red-500" />
            </button>
          </Tooltip>
        </div>
      ),
      width: "w-24",
    },
  ];

  return (
    <div className="flex flex-col gap-6 mt-10 px-4 items-center">
      <Card className="p-6 border border-gray-300 shadow-sm rounded-2xl w-full max-w-6xl">
        <Typography variant="h4" className="mb-6">
          Add Product with Variants
        </Typography>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <input
                name="name"
                className="w-full border border-gray-300 rounded-sm px-2 py-2"
                value={product.name}
                onChange={handleProductChange}
                placeholder="Enter Product Name"
                required
              />
            </div>

            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Main Category
              </label>
              <Select
                options={categories.map((cat) => ({
                  value: cat.id,
                  label: cat.name,
                }))}
                value={product.mainCategoryId}
                onChange={handleCategoryChange}
                placeholder="Select Main Category"
                required
              />
            </div>

            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subcategory
              </label>
              <Select
                options={subCategories.map((sub) => ({
                  value: sub.id,
                  label: sub.name,
                }))}
                value={product.subCategoryId}
                onChange={handleSubCategoryChange}
                placeholder="Select Subcategory"
                isDisabled={!product.mainCategoryId}
                required
              />
            </div>

            {/* <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Admin
              </label>
              <Select
                options={admins.map((admin) => ({
                  value: admin.id,
                  label: admin.name,
                }))}
                value={product.adminId}
                onChange={handleAdminChange}
                placeholder="Select Admin"
                required
              />
            </div> */}

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                className="w-full border border-gray-300 rounded-sm px-2 py-2"
                value={product.description}
                onChange={handleProductChange}
                placeholder="Enter Product Description"
                rows={4}
                required
              />
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-4">
              <Typography variant="h5">Product Variants</Typography>
              <Button
                size="sm"
                color="green"
                onClick={addVariant}
                className="flex items-center gap-1">
                <PlusCircleIcon className="h-4 w-4" /> Add Variant
              </Button>
            </div>

            {product.variants.map((variant, variantIndex) => (
              <div
                key={variantIndex}
                className="mb-8 p-4 border border-gray-200 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <Typography variant="h6">
                    Variant #{variantIndex + 1}
                  </Typography>
                  {product.variants.length > 1 && (
                    <Button
                      size="sm"
                      color="red"
                      onClick={() => removeVariant(variantIndex)}
                      className="flex items-center gap-1">
                      <XCircleIcon className="h-4 w-4" /> Remove
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      SKU
                    </label>
                    <input
                      className="w-full border border-gray-300 rounded-sm px-2 py-2"
                      value={variant.sku}
                      onChange={(e) =>
                        handleVariantChange(variantIndex, "sku", e.target.value)
                      }
                      placeholder="SKU (e.g. TEE-RED-M)"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price
                    </label>
                    <input
                      className="w-full border border-gray-300 rounded-sm px-2 py-2"
                      type="number"
                      step="0.01"
                      value={variant.price}
                      onChange={(e) =>
                        handleVariantChange(
                          variantIndex,
                          "price",
                          e.target.value
                        )
                      }
                      placeholder="Price"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock
                    </label>
                    <input
                      className="w-full border border-gray-300 rounded-sm px-2 py-2"
                      type="number"
                      value={variant.stock}
                      onChange={(e) =>
                        handleVariantChange(
                          variantIndex,
                          "stock",
                          e.target.value
                        )
                      }
                      placeholder="Stock quantity"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <Typography className="font-medium">Attributes</Typography>
                    <Button
                      size="sm"
                      color="blue"
                      onClick={() => addAttribute(variantIndex)}
                      className="flex items-center gap-1">
                      <PlusCircleIcon className="h-4 w-4" /> Add Attribute
                    </Button>
                  </div>

                  {variant.attributes.map((attr, attrIndex) => (
                    <div
                      key={attrIndex}
                      className="flex gap-2 items-center mb-2">
                      <input
                        className="flex-1 border border-gray-300 rounded-sm px-2 py-2"
                        value={attr.key}
                        onChange={(e) =>
                          handleAttributeChange(
                            variantIndex,
                            attrIndex,
                            "key",
                            e.target.value
                          )
                        }
                        placeholder="Key (e.g. color)"
                        required
                      />
                      <input
                        className="flex-1 border border-gray-300 rounded-sm px-2 py-2"
                        value={attr.value}
                        onChange={(e) =>
                          handleAttributeChange(
                            variantIndex,
                            attrIndex,
                            "value",
                            e.target.value
                          )
                        }
                        placeholder="Value (e.g. red)"
                        required
                      />
                      {variant.attributes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeAttribute(variantIndex, attrIndex)}
                          className="text-red-500">
                          <XCircleIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Typography className="font-medium">Images</Typography>
                  </div>

                  <div className="mb-2">
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleImageChange(variantIndex, e)}
                    />
                  </div>

                  {product.images[variantIndex] &&
                    product.images[variantIndex].length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {product.images[variantIndex].map((img, imgIndex) => (
                          <div key={imgIndex} className="relative w-20 h-20">
                            <img
                              src={URL.createObjectURL(img)}
                              alt={`Preview ${imgIndex}`}
                              className="w-20 h-20 object-cover rounded"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(variantIndex, imgIndex)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1">
                              <XCircleIcon className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="px-6" disabled={loading}>
              {loading ? <Spinner className="h-5 w-5" /> : "Add Product"}
            </Button>
          </div>
        </form>
      </Card>

      <Card className="w-full max-w-6xl shadow-lg">
        <Typography variant="h5" className="p-4">
          Products
        </Typography>
        <div className="p-4">
          {loading ? (
            <div className="flex justify-center p-8">
              <Spinner className="h-8 w-8 text-blue-500" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center p-8 text-gray-500">
              No products found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      S.No.
                    </th>
                    {columns.map((col) => (
                      <th
                        key={col.key}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product, index) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {index + 1}
                      </td>
                      {columns.map((col) => (
                        <td
                          key={`${product.id}-${col.key}`}
                          className="px-6 py-4 whitespace-nowrap">
                          {col.render(product)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

export default AddProduct;