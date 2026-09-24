"use client";

import { useRouter } from "next/navigation";

export default function ProductCard({ product, onDelete }) {
  const router = useRouter();

  function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.title}"?`
    );

    if (confirmed) {
      onDelete(product.id);
    }
  }

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <img
        src={product.thumbnail}
        alt={product.title}
        className="mb-4 h-48 w-full rounded object-cover"
      />

      <h2 className="mb-2 text-lg font-semibold">
        {product.title}
      </h2>

      <p className="text-sm text-gray-500">
        Category: {product.category}
      </p>

      <p className="mt-2 font-semibold">
        ${product.price}
      </p>

      <p className="text-sm">⭐ {product.rating}</p>

      <p className="text-sm">Stock: {product.stock}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => router.push(`/products/${product.id}`)}
          className="rounded bg-blue-600 px-3 py-2 text-sm text-white"
        >
          View
        </button>

        <button
          onClick={() =>
            router.push(`/products/${product.id}?edit=true`)
          }
          className="rounded bg-yellow-500 px-3 py-2 text-sm text-white"
        >
          Edit
        </button>

        <button
          onClick={handleDelete}
          className="rounded bg-red-600 px-3 py-2 text-sm text-white"
        >
          Delete
        </button>
      </div>
    </div>
  );
}