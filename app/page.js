"use client";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {
  const [productForm, setProductForm] = useState({});
  const [products, setProducts] = useState([]);
  const [alert, setAlert] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingaction, setLoadingaction] = useState(false);
  const [dropdown, setDropdown] = useState([]);

  useEffect(() => {
    // Fetch products on load
    const fetchProducts = async () => {
      const response = await fetch("/api/product");
      let rjson = await response.json();
      setProducts(rjson.products);
    };
    fetchProducts();
  }, []);

  const buttonAction = async (action, slug, value) => {
    // Immediately change the value of the product with the given slug in Products and Dropdown
    let index = products.findIndex((item) => item.slug === slug);
    let newProducts = [...products];
    let indexdrop = dropdown.findIndex((item) => item.slug === slug);
    let newDropdown = [...dropdown];

    if (action === "plus") {
      newProducts[index].quantity = parseInt(newProducts[index].quantity) + 1;
      newDropdown[indexdrop].quantity =
        parseInt(newDropdown[indexdrop].quantity) + 1;
    } else if (action === "minus") {
      newProducts[index].quantity = parseInt(newProducts[index].quantity) - 1;
      newDropdown[indexdrop].quantity =
        parseInt(newDropdown[indexdrop].quantity) - 1;
    } else if (action === "updateQuantity") {
      newProducts[index].quantity = value;
      newDropdown[indexdrop].quantity = value;
    } else if (action === "updatePrice") {
      newProducts[index].price = value;
      newDropdown[indexdrop].price = value;
    } else if (action === "updateName") {
      newProducts[index].name = value;
      newDropdown[indexdrop].name = value;
    }

    setProducts(newProducts);
    setDropdown(newDropdown);

    setLoadingaction(true);
    const response = await fetch("/api/action", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action, slug, value }),
    });

    if (response.ok) {
      let r = await response.json();
      setAlert(
        `Product ${
          action === "updatePrice"
            ? "price"
            : action === "updateName"
            ? "name"
            : "quantity"
        } updated successfully!`
      );
    } else {
      console.error("Error updating product");
    }
    setLoadingaction(false);
  };

  const addProduct = async (e) => {
    try {
      const response = await fetch("/api/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productForm),
      });

      if (response.ok) {
        // Product added successfully
        setAlert("Your Product has been added!");
        setProductForm({});
      } else {
        // Handle error case
        console.error("Error adding product");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    // Fetch all the products again to sync back
    const response = await fetch("/api/product");
    let rjson = await response.json();
    setProducts(rjson.products);
    e.preventDefault();
  };

  const handleChange = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value });
  };

  const onDropdownEdit = async (e) => {
    let value = e.target.value;
    setQuery(value);
    if (value.length > 2) {
      // Changed from > 3 to > 2 to allow more immediate feedback
      setLoading(true);
      setDropdown([]);
      const response = await fetch("/api/search?query=" + value);
      let rjson = await response.json();
      setDropdown(rjson.products);
      setLoading(false);
    } else {
      setDropdown([]);
    }
  };
  const handleQuantityChange = async (e, slug) => {
    const newQuantity = e.target.value;
    await buttonAction("updateQuantity", slug, newQuantity);
  };
  const handleNameChange = async (e, slug) => {
    const newName = e.target.value;
    await buttonAction("updateName", slug, newName);
  };

  const handlePriceChange = async (e, slug) => {
    const newPrice = e.target.value;
    await buttonAction("updatePrice", slug, newPrice);
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-5">
          <div className="text-green-800 text-center">{alert}</div>
          <h1 className="text-3xl font-semibold mb-6 ">Search a Product</h1>
          <div className="flex mb-2 items-center mx-auto container text-center">
            <input
              onChange={onDropdownEdit}
              type="text"
              placeholder="Enter a product name"
              className="flex-1 border border-gray-300 px-4 py-2 rounded-l-md"
            />
          </div>
          {loading && (
            <div className="flex justify-center items-center">
              <img width={74} src="/loading.svg" alt="Loading..." />
            </div>
          )}
          {/* Conditionally render the dropdown table */}
          {query.length > 2 && (
            <div className="overflow-x-auto">
              <table className="min-w-full text-center bg-white border border-gray-200">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b border-gray-200">ID</th>
                    <th className="py-2 px-4 border-b border-gray-200">
                      Product Name
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200">
                      Price
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200">
                      Quantity
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dropdown.map((product) => (
                    <tr key={product.id}>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {product.slug}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        <input
                          type="text"
                          className="w-40 border border-gray-300 rounded-md px-2 py-1"
                          value={product.name}
                          onChange={(e) => handleNameChange(e, product.slug)}
                        />
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200 text-center">
                        <input
                          type="number"
                          className="w-20 border border-gray-300 rounded-md px-2 py-1"
                          value={product.price}
                          onChange={(e) => handlePriceChange(e, product.slug)}
                        />
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        <div className="mx-5">
                          <button
                            onClick={() => {
                              buttonAction(
                                "minus",
                                product.slug,
                                product.quantity
                              );
                            }}
                            disabled={loadingaction}
                            className="subtract inline-block px-3 py-1 cursor-pointer bg-purple-500 text-white font-semibold rounded-lg shadow-md disabled:bg-purple-200"
                          >
                            {" "}
                            -{" "}
                          </button>
                          <span className="quantity inline-block min-w-3 mx-3">
                            {product.quantity}
                          </span>
                          <button
                            onClick={() => {
                              buttonAction(
                                "plus",
                                product.slug,
                                product.quantity
                              );
                            }}
                            disabled={loadingaction}
                            className="add inline-block px-3 py-1 cursor-pointer bg-purple-500 text-white font-semibold rounded-lg shadow-md disabled:bg-purple-200"
                          >
                            {" "}
                            +{" "}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {/* Add Product Form */}
          <div className="mt-8">
            <h1 className="text-3xl font-semibold mb-6">Add a Product</h1>

            <form onSubmit={addProduct}>
              <div className="mb-4">
                <label htmlFor="productName" className="block mb-2">
                  Product Slug
                </label>
                <input
                  value={productForm?.slug || ""}
                  name="slug"
                  onChange={handleChange}
                  type="text"
                  id="productName"
                  className="w-full border border-gray-300 px-4 py-2 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="productName" className="block mb-2">
                  Product Name
                </label>
                <input
                  value={productForm?.name || ""}
                  name="name"
                  onChange={handleChange}
                  type="text"
                  id="productName"
                  className="w-full border border-gray-300 px-4 py-2 rounded-md"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="quantity" className="block mb-2">
                  Quantity
                </label>
                <input
                  value={productForm?.quantity || ""}
                  name="quantity"
                  onChange={handleChange}
                  type="number"
                  id="quantity"
                  className="w-full border border-gray-300 px-4 py-2 rounded-md"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="price" className="block mb-2">
                  Price
                </label>
                <input
                  value={productForm?.price || ""}
                  name="price"
                  onChange={handleChange}
                  type="number"
                  id="price"
                  className="w-full border border-gray-300 px-4 py-2 rounded-md"
                />
              </div>

              <button
                type="submit"
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg shadow-md font-semibold"
              >
                Add Product
              </button>
            </form>
          </div>
          {/* Display Current Stock */}
          <div className="mt-8">
            <h1 className="text-2xl font-bold mb-4">Current Stock</h1>
            <div className="overflow-x-auto">
              <table className="min-w-full text-center bg-white border border-gray-200">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b border-gray-200">ID</th>
                    <th className="py-2 px-4 border-b border-gray-200">
                      Product Name
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200">
                      Quantity
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {product.slug}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {product.name}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {product.quantity}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {product.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
