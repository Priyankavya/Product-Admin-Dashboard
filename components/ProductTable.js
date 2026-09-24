"use client";

import { useRouter } from "next/navigation";

export default function ProductTable({ products, onDelete }) {
  const router = useRouter();

  function handleDelete(product) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.title}"?`
    );

    if (confirmed) {
      onDelete(product.id);
    }
  }

  return (
    <div className="hidden overflow-x-auto rounded-lg border bg-white md:block">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3">Image</th>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Rating</th>
            <th className="px-4 py-3">Stock</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-t">
              <td className="px-4 py-3">
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="h-14 w-14 rounded object-cover"
                />
              </td>

              <td className="px-4 py-3 font-medium">
                {product.title}
              </td>

              <td className="px-4 py-3">{product.category}</td>

              <td className="px-4 py-3">
                ${product.price}
              </td>

              <td className="px-4 py-3">
                ⭐ {product.rating}
              </td>

              <td className="px-4 py-3">{product.stock}</td>

              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/products/${product.id}`)}
                    className="rounded bg-blue-600 px-3 py-1 text-white"
                  >
                    View
                  </button>

                  <button
                    onClick={() =>
                      router.push(`/products/${product.id}?edit=true`)
                    }
                    className="rounded bg-yellow-500 px-3 py-1 text-white"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(product)}
                    className="rounded bg-red-600 px-3 py-1 text-white"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}