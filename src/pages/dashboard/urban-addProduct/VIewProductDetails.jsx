import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";

const ViewProductDetails = () => {
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = Cookies.get("token");
  const { id } = useParams();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/admin/get-product/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProduct(data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, [token, id]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleVariantChange = (index) => {
    setSelectedVariant(index);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === product.variants[selectedVariant].images.length - 1
        ? 0
        : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0
        ? product.variants[selectedVariant].images.length - 1
        : prev - 1
    );
  };



  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-700">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-red-600">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center text-sm text-gray-500">
          <a href="#" className="hover:text-blue-600">
            Home
          </a>
          <span className="mx-2">/</span>
          <a href="#" className="hover:text-blue-600 capitalize">
            {product.mainCategory.name}
          </a>
          <span className="mx-2">/</span>
          <a href="#" className="hover:text-blue-600 capitalize">
            {product.subCategory.name}
          </a>
          <span className="mx-2">/</span>
          <span className="text-gray-700 font-medium">{product.name}</span>
        </div>
      </div>

      {/* Product Display */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row -mx-4">
          {/* Product Images */}
          <div className="md:w-1/2 px-4 mb-8 md:mb-0">
            <div className="relative bg-white rounded-lg shadow-sm p-2 mb-4">
              <img
                src={`${import.meta.env.VITE_BASE_URL_IMAGE}${
                  product.variants[selectedVariant].images[currentImageIndex]
                }`}
                alt={`${product.name} - View ${currentImageIndex + 1}`}
                className="w-full h-96 object-contain"
              />

              {/* Image navigation buttons */}
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
              >
                <ChevronLeft className="h-6 w-6 text-gray-700" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
              >
                <ChevronRight className="h-6 w-6 text-gray-700" />
              </button>
            </div>

            {/* Thumbnail Images */}
            <div className="flex space-x-2 overflow-x-auto">
              {product.variants[selectedVariant].images.map((image, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`flex-shrink-0 border-2 rounded-md ${
                    currentImageIndex === idx
                      ? "border-blue-500"
                      : "border-gray-200"
                  }`}
                >
                  <img
                    src={`${import.meta.env.VITE_BASE_URL_IMAGE}${image}`}
                    alt={`Thumbnail ${idx + 1}`}
                    className="h-16 w-16 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="md:w-1/2 px-4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {/* Vendor */}
              <div className="text-sm text-gray-500 mb-2">
                Sold by:{" "}
                <span className="font-medium text-gray-700">
                  {product.vendor.name}
                </span>
              </div>

              {/* Product Title */}
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {product.name}
              </h1>

              {/* Price */}
              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(product.variants[selectedVariant].price)}
                </span>
                {product.variants[selectedVariant].stock <= 5 && (
                  <span className="ml-3 text-sm text-red-600 font-medium">
                    Only {product.variants[selectedVariant].stock} left in
                    stock!
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="text-gray-700 mb-6">{product.description}</div>

              {/* Variant Selection */}
              <div className="mb-6">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  Variants:
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant, idx) => (
                    <button
                      key={variant.id}
                      onClick={() => handleVariantChange(idx)}
                      className={`px-4 py-2 border rounded-md ${
                        selectedVariant === idx
                          ? "border-blue-500 bg-blue-50 text-blue-600"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {variant.sku.charAt(0).toUpperCase() +
                        variant.sku.slice(1)}
                      {variant.stock === 0 && (
                        <span className="ml-1 text-red-500">
                          (Out of stock)
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Attributes */}
              {product.variants[selectedVariant].attributes.length > 0 && (
                <div className="mb-6">
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    Specifications:
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {product.variants[selectedVariant].attributes.map(
                      (attr) => (
                        <div key={attr.id} className="flex">
                          <span className="text-gray-600 capitalize">
                            {attr.key}:
                          </span>
                          <span className="ml-2 text-gray-800">
                            {attr.value}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Show Available Stock */}
              <div className="mb-6">
                <span className="text-sm font-medium text-gray-700 mb-2">
                  Available Stock:
                </span>
                <div className="flex items-center">
                  <span className="text-lg font-bold text-gray-600">
                    {product.variants[selectedVariant].stock}
                  </span>
                </div>
                </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ViewProductDetails;
