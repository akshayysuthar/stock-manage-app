"use client";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useState } from "react";

export default function Home() {
  // Sample stock data and form state
  const [stockData, setStockData] = useState([
    { id: 1, slug: "a", name: "Product A", quantity: 10, price: "$20" },
    { id: 2, slug: "b", name: "Product B", quantity: 5, price: "$50" },
    { id: 3, slug: "c", name: "Product C", quantity: 8, price: "$30" },
  ]);

  const [newProduct, setNewProduct] = useState({
    slug: "",
    name: "",
    quantity: "",
    price: "",
  });

  const [searchQuery, setSearchQuery] = useState("");

  // Function to handle form submission
  const handleAddProduct = (e) => {
    e.preventDefault();
    const updatedStock = [
      ...stockData,
      {
        id: stockData.length + 1,
        slug: newProduct.slug,
        name: newProduct.name,
        quantity: newProduct.quantity,
        price: `$${newProduct.price}`,
      },
    ];
    setStockData(updatedStock);
    setNewProduct({ slug: "", name: "", quantity: "", price: "" }); // Reset form
  };

  // Filter stock based on search query
  const filteredStock = stockData.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen flex flex-col justify-between">
      <Header />
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Add a Product</h1>

        {/* Add Product Form */}
        <form
          onSubmit={handleAddProduct}
          className="bg-white p-6 rounded-md shadow-md mb-8"
        >
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Product Slug</label>
            <input
              type="text"
              value={newProduct.slug}
              onChange={(e) =>
                setNewProduct({ ...newProduct, slug: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter product name"
              required
            />
            <label className="block text-gray-700 mb-2">Product Name</label>
            <input
              type="text"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter product name"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Quantity</label>
            <input
              type="number"
              value={newProduct.quantity}
              onChange={(e) =>
                setNewProduct({ ...newProduct, quantity: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter quantity"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Price</label>
            <input
              type="number"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter price"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Add Product
          </button>
        </form>

        {/* Search Product */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2 text-lg">
            Search Product
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Search by product name"
          />
        </div>

        <h1 className="text-2xl font-bold mb-4">Current Stock</h1>

        {/* Stock Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-center bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-gray-200">ID</th>
                <th className="py-2 px-4 border-b border-gray-200">Slug</th>
                <th className="py-2 px-4 border-b border-gray-200">
                  Product Name
                </th>
                <th className="py-2 px-4 border-b border-gray-200">Quantity</th>
                <th className="py-2 px-4 border-b border-gray-200">Price</th>
              </tr>
            </thead>
            <tbody>
              {filteredStock.map((product) => (
                <tr key={product.id}>
                  <td className="py-2 px-4 border-b border-gray-200">
                    {product.id}
                  </td>
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
              {filteredStock.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
}
