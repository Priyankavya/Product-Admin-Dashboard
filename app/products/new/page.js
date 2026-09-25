"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from "@/components/Navbar";
import ProductForm from "@/components/ProductForm";
import { addProduct } from "@/lib/productApi";

import { isLoggedIn } from "@/utils/auth";
import { useEffect, useState } from "react";
export default function NewProductPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
  if (!isLoggedIn()) {
    router.replace("/login");
  }
}, [router]);

  async function handleSubmit(product) {
    if (loading) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const createdProduct = await addProduct(product);

      // DummyJSON doesn't permanently save the product.
      // Store it locally so the application can show it.
      const existing =
        JSON.parse(
          localStorage.getItem("localProducts") || "[]"
        );

      localStorage.setItem(
        "localProducts",
        JSON.stringify([
          ...existing,
          {
            ...createdProduct,
            ...product,
            _local: true,
          },
        ])
      );

      router.push("/products");
    } catch (error) {
      setError(
        error.message || "Failed to create product."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">
          Add Product
        </h1>

        {error && (
          <div className="mb-5 rounded-lg bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        <ProductForm
          onSubmit={handleSubmit}
          loading={loading}
        />
      </main>
    </div>
  );
}