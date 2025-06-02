import {  useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Input,
  Button,
  Typography,
  Select,
  Option,
} from "@material-tailwind/react";
import Cookies from "js-cookie";
import { PlusCircle, Trash } from "lucide-react";
import Toaster, {
  showSuccessToast,
  showErrorToast,
} from "@/components/Toaster";
import { useParams } from "react-router-dom";


function AddDescription() {
  const [product, setProduct] = useState({
    heading: "",
    title: "",
    price: "",
    description: [],
    faq: [],
  });

  const [selectedType, setSelectedType] = useState();

  const { id: productId } = useParams();
  const token = Cookies.get("token");

  // Image Upload Function - Updates State Immediately
  const handleImageUpload = async (file, updateFunction) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Image uploaded successfully:", data.data);
      updateFunction(data.data); // Set image URL in state
    } catch (error) {
      showErrorToast("Image upload failed", error);
    }
  };

  const addDescription = () => {
    // if (product.description.some((desc) => desc.type === selectedType)) return;

    setProduct((prev) => ({
      ...prev,
      description: [
        ...prev.description,
        {
          title: selectedType === "0" || selectedType === "1" ? "" : undefined,
          image:
            selectedType === "0" || selectedType === "1" || selectedType === "2"
              ? ""
              : undefined,
          desc: selectedType === "1" || selectedType === "3" ? "" : undefined,
        },
      ],
    }));
  };

  // Update Specific Field
  const updateDescription = (index, field, value) => {
    setProduct((prev) => ({
      ...prev,
      description: prev.description.map((desc, i) =>
        i === index ? { ...desc, [field]: value } : desc
      ),
    }));
  };

  // Add FAQ

  
  const addFaq = () => {
    console.log("addFaq");
    setProduct((prev) => ({
      ...prev,
      faq: [...prev.faq, { question: "", answer: "", image: "" }],
    }));
  };

  // Update FAQ Field
  const updateFaq = (index, key, value) => {
    setProduct((prev) => {
      const updatedFaq = [...prev.faq];
      updatedFaq[index][key] = value;
      return { ...prev, faq: updatedFaq };
    });
  };

  useEffect(() => {
    addFaq();
  }, []);






  // Handle Description Submit
  const handleDescriptionSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin/add-description`,
        {
          productId,
          heading: product.heading,
          type: parseInt(selectedType),
          details: product.description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      showSuccessToast("Description added successfully!");

      setProduct((prev) => ({ ...prev, description: [] }));
      product.heading = "";
    } catch (error) {
      showErrorToast("Failed to add description.", error);
    }
  };

  // Handle FAQ Submit
  const handleFaqSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin/add-faq`,
        {
          productId: parseInt(productId, 10),
          faqs: product.faq,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      showSuccessToast("FAQ added successfully!");
      setProduct((prev) => ({ ...prev, faq: [] }));
    } catch (error) {
      showErrorToast("Failed to add FAQ.", error);
    }
  };

  return (
    <>
      <Toaster />
      <div className="flex flex-col md:flex-row gap-6 mt-5">
        {/* Description Section */}
        <Card className="p-6 border border-gray-300 shadow-sm rounded-2xl w-full max-w-5xl">
          <Typography variant="h4">Add Product Description</Typography>
          <form onSubmit={handleDescriptionSubmit} className="grid gap-4">
            <Typography variant="h5">Product Description</Typography>
            <div className="flex items-center gap-4 justify-between">
              <label className="font-medium">Choose Description Type</label>
              {selectedType && (
                <Button type="button" onClick={addDescription}>
                  Add
                </Button>
              )}
            </div>
            {/* Select Description Type */}
            <Select
              label="Choose Description Type"
              onChange={(value) => setSelectedType(value)}
            >
              <Option value="0">Point</Option>
              <Option value="1">Process</Option>
              <Option value="2">Image</Option>
              <Option value="3">Description</Option>
            </Select>
            {/* Rendering Heading Field */}
            {selectedType !== "2" && (
              <div>
                <label className="font-medium">Heading</label>
                <Input
                  value={product.heading}
                  onChange={(e) =>
                    setProduct({ ...product, heading: e.target.value })
                  }
                  placeholder="Heading"
                />
              </div>
            )}
            {/* Rendering Description Fields */}
            {product.description.map((desc, index) => (
              <div
                key={index}
                className="flex flex-col gap-2 border p-2 rounded"
              >
                {/* Title Field (Only for Type 0 and 1) */}
                {(selectedType === "0" || selectedType === "1") && (
                  <>
                    <label className="font-medium">Title</label>
                    <Input
                      value={desc.title}
                      onChange={(e) =>
                        updateDescription(index, "title", e.target.value)
                      }
                      placeholder="Title"
                    />
                  </>
                )}

                {/* Description Field (Only for Type 1 and 3) */}
                {(selectedType === "1" || selectedType === "3") && (
                  <>
                    <label className="font-medium">Description</label>
                    <Input
                      value={desc.desc}
                      onChange={(e) =>
                        updateDescription(index, "desc", e.target.value)
                      }
                      placeholder="Description"
                    />
                  </>
                )}

                {/* Image Field (Only for Type 0, 1, and 2) */}
                {(selectedType === "0" ||
                  selectedType === "1" ||
                  selectedType === "2") && (
                  <>
                    <label className="font-medium">Upload Image</label>
                    <Input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          handleImageUpload(file, (url) =>
                            updateDescription(index, "image", url)
                          );
                        }
                      }}
                    />
                  </>
                )}

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() =>
                    setProduct((prev) => ({
                      ...prev,
                      description: prev.description.filter(
                        (_, i) => i !== index
                      ),
                    }))
                  }
                >
                  <Trash size={20} />
                </button>
              </div>
            ))}
            <Button type="submit">Submit Description</Button>
          </form>
        </Card>

        {/* FAQ Section */}
        <Card className="p-6 border border-gray-300 shadow-sm rounded-2xl w-full max-w-5xl">
          <Typography variant="h4">Add FAQ</Typography>
          <form onSubmit={handleFaqSubmit} className="grid gap-4 mt-6">
            <div className="flex items-center gap-4 justify-between">
              <Typography variant="h5">Frequently Asked Questions</Typography>
              {/* <Button type="button" id="oneClickFaq" className="hidden" onClick={addFaq}>
                Add FAQ
              </Button> */}
            </div>
            {product.faq.map((faq, index) => (
              <div
                key={index}
                className="flex flex-col gap-2 border p-2 rounded"
              >
                <label className="font-medium">Question</label>
                <Input
                  value={faq.question}
                  onChange={(e) => updateFaq(index, "question", e.target.value)}
                  placeholder="Question"
                />
                <label className="font-medium">Answer</label>
                <Input
                  value={faq.answer}
                  onChange={(e) => updateFaq(index, "answer", e.target.value)}
                  placeholder="Answer"
                />
                <label className="font-medium">Upload Image</label>
                <Input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      handleImageUpload(file, (url) =>
                        updateFaq(index, "image", url)
                      );
                    }
                  }}
                />
                <div className="flex gap-2">
                  <button type="button" onClick={addFaq}>
                    <PlusCircle size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setProduct((prev) => ({
                        ...prev,
                        faq: prev.faq.filter((_, i) => i !== index),
                      }))
                    }
                  >
                    <Trash size={20} />
                  </button>
                </div>
              </div>
            ))}
            <Button type="submit">Submit FAQ</Button>
          </form>
        </Card>
      </div>
    </>
  );
}

export default AddDescription;
