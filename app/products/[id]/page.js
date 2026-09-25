"use client";

import { use, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";
import ProductForm from "@/components/ProductForm";

import {
  getProduct,
  updateProduct,
} from "@/lib/productApi";

export default function ProductDetailsPage({ params }) {
  const { id } = use(params);

  const router = useRouter();
  const searchParams = useSearchParams();

  const isEditMode = searchParams.get("edit") === "true";

  const [product, setProduct] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadProduct() {
      setLoading(true);
      setError("");

      try {
        const data = await getProduct(id, controller.signal);

        setProduct(data);
      } catch (error) {
        if (error.code === "ERR_CANCELED") {
          return;
        }

        setError("Product not found.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      controller.abort();
    };
  }, [id]);

  async function handleUpdate(updatedProduct) {
    if (saving) {
      return;
    }

    setSaving(true);
    setError("");

    try {
      const data = await updateProduct(id, updatedProduct);

      // DummyJSON simulates updates.
      const finalProduct = {
        ...product,
        ...data,
        ...updatedProduct,
      };

      setProduct(finalProduct);

      const updates = JSON.parse(
        localStorage.getItem("updatedProducts") || "{}"
      );

      updates[id] = finalProduct;

      localStorage.setItem(
        "updatedProducts",
        JSON.stringify(updates)
      );

      router.push(`/products/${id}`);
    } catch (error) {
      setError(
        error.message || "Failed to update product."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <Loading text="Loading product..." />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Navbar />

        <main className="mx-auto max-w-4xl px-4 py-10">
          <ErrorMessage
            message={error || "Product not found."}
            onRetry={() => window.location.reload()}
          />

          <button
            onClick={() => router.push("/products")}
            className="mt-4 rounded bg-blue-600 px-4 py-2 text-white"
          >
            Back to Products
          </button>
        </main>
      </>
    );
  }

  if (isEditMode) {
    return (
      <>
        <Navbar />

        <main className="mx-auto max-w-4xl px-4 py-8">
          <h1 className="mb-6 text-3xl font-bold">
            Edit Product
          </h1>

          {error && (
            <div className="mb-5 rounded bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}

          <ProductForm
            initialProduct={product}
            onSubmit={handleUpdate}
            loading={saving}
          />
        </main>
      </>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-8">
        <button
          onClick={() => router.push("/products")}
          className="mb-6 rounded border px-4 py-2"
        >
          ← Back
        </button>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <img
                src={
                  product.images?.[0] ||
                  product.thumbnail
                }
                alt={product.title}
                className="w-full rounded-xl object-cover"
              />

              {product.images?.length > 1 && (
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {product.images
                    .slice(0, 4)
                    .map((image) => (
                      <img
                        key={image}
                        src={image}
                        alt={product.title}
                        className="h-20 w-full rounded object-cover"
                      />
                    ))}
                </div>
              )}
            </div>

            <div>
              <p className="mb-2 text-sm uppercase text-blue-600">
                {product.category}
              </p>

              <h1 className="text-3xl font-bold">
                {product.title}
              </h1>

              <p className="mt-4 text-gray-600">
                {product.description}
              </p>

              <div className="mt-6 space-y-3">
                <p className="text-2xl font-bold">
                  ${product.price}
                </p>

                <p>⭐ Rating: {product.rating}</p>

                <p>Stock: {product.stock}</p>

                {product.brand && (
                  <p>Brand: {product.brand}</p>
                )}
              </div>

              <button
                onClick={() =>
                  router.push(
                    `/products/${product.id}?edit=true`
                  )
                }
                className="mt-6 rounded-lg bg-yellow-500 px-5 py-3 font-medium text-white"
              >
                Edit Product
              </button>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="mb-4 text-2xl font-bold">
              Reviews
            </h2>

            {product.reviews?.length ? (
              <div className="space-y-4">
                {product.reviews.map((review, index) => (
                  <div
                    key={index}
                    className="rounded-lg border p-4"
                  >
                    <div className="flex justify-between">
                      <strong>
                        {review.reviewerName ||
                          review.reviewerEmail ||
                          "Customer"}
                      </strong>

                      <span>
                        ⭐ {review.rating}
                      </span>
                    </div>

                    <p className="mt-2 text-gray-600">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                No reviews available.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}