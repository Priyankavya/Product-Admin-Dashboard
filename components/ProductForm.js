"use client";

import { useEffect, useState } from "react";

const emptyProduct = {
  title: "",
  description: "",
  price: "",
  category: "",
  stock: "",
  thumbnail: "",
};

export default function ProductForm({
  initialProduct = null,
  onSubmit,
  loading = false,
}) {
  const [form, setForm] = useState(emptyProduct);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialProduct) {
      setForm({
        title: initialProduct.title || "",
        description: initialProduct.description || "",
        price: initialProduct.price ?? "",
        category: initialProduct.category || "",
        stock: initialProduct.stock ?? "",
        thumbnail:
          initialProduct.thumbnail ||
          initialProduct.images?.[0] ||
          "",
      });
    }
  }, [initialProduct]);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  }

  function validate() {
    const newErrors = {};

    if (!form.title.trim()) {
      newErrors.title = "Title is required.";
    }

    if (!form.description.trim()) {
      newErrors.description = "Description is required.";
    }

    if (form.price === "" || Number(form.price) <= 0) {
      newErrors.price = "Price must be greater than 0.";
    }

    if (!form.category.trim()) {
      newErrors.category = "Category is required.";
    }

    if (form.stock === "" || Number(form.stock) < 0) {
      newErrors.stock = "Stock cannot be negative.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    await onSubmit({
      title: form.title.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      category: form.category.trim(),
      stock: Number(form.stock),
      thumbnail: form.thumbnail.trim(),
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-2xl space-y-5 rounded-lg border bg-white p-6 shadow-sm"
    >
      <div>
        <label className="mb-1 block font-medium">Title</label>

        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full rounded border px-3 py-2"
        />

        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block font-medium">Description</label>

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows="4"
          className="w-full rounded border px-3 py-2"
        />

        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description}
          </p>
        )}
      </div>

      <div>
        <label className="mb-1 block font-medium">Price</label>

        <input
          name="price"
          type="number"
          min="0"
          step="0.01"
          value={form.price}
          onChange={handleChange}
          className="w-full rounded border px-3 py-2"
        />

        {errors.price && (
          <p className="mt-1 text-sm text-red-600">{errors.price}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block font-medium">Category</label>

        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full rounded border px-3 py-2"
        />

        {errors.category && (
          <p className="mt-1 text-sm text-red-600">
            {errors.category}
          </p>
        )}
      </div>

      <div>
        <label className="mb-1 block font-medium">Stock</label>

        <input
          name="stock"
          type="number"
          min="0"
          value={form.stock}
          onChange={handleChange}
          className="w-full rounded border px-3 py-2"
        />

        {errors.stock && (
          <p className="mt-1 text-sm text-red-600">{errors.stock}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block font-medium">
          Image URL
        </label>

        <input
          name="thumbnail"
          value={form.thumbnail}
          onChange={handleChange}
          placeholder="https://..."
          className="w-full rounded border px-3 py-2"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading
          ? "Saving..."
          : initialProduct
          ? "Update Product"
          : "Add Product"}
      </button>
    </form>
  );
}