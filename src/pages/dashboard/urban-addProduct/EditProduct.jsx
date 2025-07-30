import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import {
  Card,
  Input,
  Button,
  Typography,
  Spinner,
  Select,
  Option,
} from '@material-tailwind/react';
import {
  XCircleIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/solid';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = Cookies.get('token');
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [product, setProduct] = useState({
    name: '',
    description: '',
    mainCategoryId: null,
    subCategoryId: null,
    variants: [
      {
        sku: '',
        price: '',
        stock: '',
        attributes: [
          { key: '', value: '' },
        ],
      },
    ],
    images: [[]],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories first
        const categoriesResponse = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/admin/get-all-main-categories`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            },
          }
        );
        setCategories(categoriesResponse.data.categories);

        // Fetch product data
        const productResponse = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/admin/get-product/${id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            },
          }
        );

        const productData = productResponse.data.data;

        // Fetch subcategories based on product's main category
        if (productData.mainCategoryId) {
          const subCategoriesResponse = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/admin/get-all-sub-categories`,
            { 
              headers: { 
                'Authorization': `Bearer ${token}` 
              },
              params: { mainCategoryId: productData.mainCategoryId }
            }
          );
          setSubCategories(subCategoriesResponse.data.subCategories);
        }

        // Transform the product data to match our state structure
        const transformedProduct = {
          name: productData.name,
          description: productData.description,
          mainCategoryId: productData.mainCategoryId,
          subCategoryId: productData.subCategoryId,
          variants: productData.variants.map(variant => ({
            id: variant.id,
            sku: variant.sku,
            price: variant.price,
            stock: variant.stock,
            attributes: variant.attributes.map(attr => ({
              key: attr.key,
              value: attr.value
            }))
          })),
          images: productData.variants.map(variant => 
            variant.images ? variant.images.map(img => ({ url: img })) : []
          )
        };

        setProduct(transformedProduct);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load product data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token]);

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = async (value) => {
    const selectedCategory = categories.find(cat => cat.id === value);
    setProduct((prev) => ({
      ...prev,
      mainCategoryId: value,
      subCategoryId: null,
    }));

    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/admin/get-all-sub-categories`,
        { 
          headers: { 
            'Authorization': `Bearer ${token}` 
          },
          params: { mainCategoryId: value }
        }
      );
      setSubCategories(data.subCategories);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      setError("Failed to load subcategories. Please try again.");
    }
  };

  const handleSubCategoryChange = (value) => {
    setProduct((prev) => ({
      ...prev,
      subCategoryId: value,
    }));
  };

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
            { key: "", value: "" },
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
      setError("Product name must be at least 3 characters long");
      return false;
    }
    if (!product.description) {
      setError("Description is required");
      return false;
    }
    if (!product.mainCategoryId) {
      setError("Please select a main category");
      return false;
    }
    if (!product.subCategoryId) {
      setError("Please select a subcategory");
      return false;
    }

    for (let i = 0; i < product.variants.length; i++) {
      const variant = product.variants[i];
      if (!variant.sku) {
        setError(`SKU is required for variant ${i + 1}`);
        return false;
      }
      if (!variant.price || variant.price <= 0) {
        setError(`Price must be greater than 0 for variant ${i + 1}`);
        return false;
      }
      if (!variant.stock || variant.stock <= 0) {
        setError(`Stock must be greater than 0 for variant ${i + 1}`);
        return false;
      }

      for (let j = 0; j < variant.attributes.length; j++) {
        const attr = variant.attributes[j];
        if (!attr.key || !attr.value) {
          setError(
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
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("description", product.description);
      formData.append("mainCategoryId", product.mainCategoryId);
      formData.append("subCategoryId", product.subCategoryId);
      
      // Prepare variants data
      const variantsData = product.variants.map(variant => ({
        id: variant.id, // Include variant ID for update
        sku: variant.sku,
        price: variant.price,
        stock: variant.stock,
        attributes: variant.attributes.map(attr => ({
          key: attr.key,
          value: attr.value
        }))
      }));
      
      formData.append("variants", JSON.stringify(variantsData));

      // Handle image uploads
      product.images.forEach((variantImages, variantIndex) => {
        variantImages.forEach((image, imageIndex) => {
          if (image instanceof File) {
            formData.append(`images_${variantIndex}`, image);
          } else if (image.url) {
            // For existing images, we might want to keep them
            formData.append(`existingImages_${variantIndex}`, image.url);
          }
        });
      });

      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/admin/update-product/${id}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/products');
        }, 1500);
      } else {
        setError(response.data.message || "Failed to update product");
      }
    } catch (error) {
      console.error("Failed to update product:", error);
      setError(
        error.response?.data?.message || 
        error.message || 
        "Failed to update product. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading && !product.name) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 mt-10 px-4 items-center">
      <Card className="p-6 border border-gray-300 shadow-sm rounded-2xl w-full max-w-6xl">
        <Typography variant="h4" className="mb-6">
          Edit Product
        </Typography>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
            Product updated successfully! Redirecting...
          </div>
        )}

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
                label="Select Main Category"
                value={product.mainCategoryId?.toString()}
                onChange={handleCategoryChange}
              >
                {categories.map((category) => (
                  <Option key={category.id} value={category.id.toString()}>
                    {category.name}
                  </Option>
                ))}
              </Select>
            </div>

            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subcategory
              </label>
              <Select
                label="Select Subcategory"
                value={product.subCategoryId?.toString()}
                onChange={handleSubCategoryChange}
                disabled={!product.mainCategoryId}
              >
                {subCategories.map((subCategory) => (
                  <Option key={subCategory.id} value={subCategory.id.toString()}>
                    {subCategory.name}
                  </Option>
                ))}
              </Select>
            </div>

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

                  {product.images[variantIndex]?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {product.images[variantIndex].map((img, imgIndex) => (
                        <div key={imgIndex} className="relative w-20 h-20">
                              <img
                                  src={
    img instanceof File 
      ? URL.createObjectURL(img) 
      : `${import.meta.env.VITE_BASE_URL_IMAGE}${img.url}`
  }
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

          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              color="red" 
              onClick={() => navigate('/products')}
              className="px-6">
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="px-6" 
              disabled={loading}>
              {loading ? <Spinner className="h-5 w-5" /> : "Update Product"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EditProduct;