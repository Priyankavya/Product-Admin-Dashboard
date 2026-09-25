"use client";

import { useEffect, useState } from "react";

export default function ProductsPageContent() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get products from localStorage
    const savedProducts = localStorage.getItem("products");

    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts));
      } catch (error) {
        console.error("Error reading products:", error);
        setProducts([]);
      }
    }

    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>

        <button
          className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800"
          onClick={() => {
            alert("Add Product clicked");
          }}
        >
          Add Product
        </button>
      </div>

      {products.length === 0 ? (
        <div className="border rounded-lg p-8 text-center">
          <h2 className="text-lg font-semibold mb-2">
            No products found
          </h2>

          <p className="text-gray-500">
            Add products to display them here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3 text-left">ID</th>
                <th className="border p-3 text-left">Name</th>
                <th className="border p-3 text-left">Category</th>
                <th className="border p-3 text-left">Price</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product, index) => (
                <tr key={product.id || index}>
                  <td className="border p-3">
                    {product.id || index + 1}
                  </td>

                  <td className="border p-3">
                    {product.name || product.title || "N/A"}
                  </td>

                  <td className="border p-3">
                    {product.category || "N/A"}
                  </td>

                  <td className="border p-3">
                    ₹{product.price || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}