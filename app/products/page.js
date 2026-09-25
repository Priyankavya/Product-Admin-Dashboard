"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/pagination"
import ProductTable from "@/components/ProductTable";
import ProductCard from "@/components/ProductCard";
import Loading from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";

import useDebounce from "@/hooks/useDebounce";

import {
  getCategories,
  getProducts,
  deleteProduct,
} from "@/lib/productApi";

import { isLoggedIn } from "@/utils/auth";

function applyLocalChanges(products) {
  if (typeof window === "undefined") {
    return products;
  }

  const deletedIds = JSON.parse(
    localStorage.getItem("deletedProductIds") || "[]"
  );

  const updatedProducts = JSON.parse(
    localStorage.getItem("updatedProducts") || "{}"
  );

  const localProducts = JSON.parse(
    localStorage.getItem("localProducts") || "[]"
  );

  const result = products
    .filter((product) => !deletedIds.includes(product.id))
    .map((product) => {
      return updatedProducts[product.id]
        ? {
            ...product,
            ...updatedProducts[product.id],
          }
        : product;
    });

  return [...localProducts, ...result];
}

function validPositiveInteger(value, fallback) {
  const number = Number(value);

  if (!Number.isInteger(number) || number < 1) {
    return fallback;
  }

  return number;
}

function getValidLimit(value) {
  const number = Number(value);

  return [10, 20, 50].includes(number) ? number : 20;
}

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlPage = validPositiveInteger(
    searchParams.get("page"),
    1
  );

  const urlLimit = getValidLimit(searchParams.get("limit"));

  const urlSearch = searchParams.get("search") || "";
  const urlCategory = searchParams.get("category") || "";
  const urlSort = searchParams.get("sort") || "default";

  const [searchInput, setSearchInput] = useState(urlSearch);

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);

  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [error, setError] = useState("");

  const [requestVersion, setRequestVersion] = useState(0);

  const debouncedSearch = useDebounce(searchInput, 500);

  const sortParts = useMemo(() => {
    if (!urlSort || urlSort === "default") {
      return {
        sortBy: "",
        order: "asc",
      };
    }

    const [sortBy, order = "asc"] = urlSort.split("-");

    return {
      sortBy,
      order,
    };
  }, [urlSort]);

  // Protect page
  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/login");
    }
  }, [router]);

  // Keep input synchronized with URL
  useEffect(() => {
    setSearchInput(urlSearch);
  }, [urlSearch]);

  // When debounced search changes, go to page 1
  useEffect(() => {
    if (debouncedSearch !== urlSearch) {
      updateUrl({
        search: debouncedSearch,
        page: 1,
      });
    }
  }, [debouncedSearch]);

  function updateUrl(changes) {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(changes).forEach(([key, value]) => {
      if (
        value === "" ||
        value === null ||
        value === undefined ||
        value === "default"
      ) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    router.push(`/products?${params.toString()}`);
  }

  const loadProducts = useCallback(
    async (signal) => {
      setLoading(true);
      setError("");

      try {
        const data = await getProducts({
          page: urlPage,
          limit: urlLimit,
          search: urlSearch,
          category: urlSearch ? "" : urlCategory,
          sortBy: sortParts.sortBy,
          order: sortParts.order,
          signal,
        });

        const finalProducts = applyLocalChanges(
  data.products || []
);

setProducts(finalProducts);
setTotal(
  (data.total || 0) +
    JSON.parse(
      localStorage.getItem("localProducts") || "[]"
    ).length
);
      } catch (error) {
        if (error.code === "ERR_CANCELED") {
          return;
        }

        setError(
          error.message || "Failed to load products."
        );
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    },
    [
      urlPage,
      urlLimit,
      urlSearch,
      urlCategory,
      sortParts,
      requestVersion,
    ]
  );

  useEffect(() => {
    const controller = new AbortController();

    loadProducts(controller.signal);

    return () => {
      controller.abort();
    };
  }, [loadProducts]);

  // Load categories
  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories();

        const normalized = data.map((item) => {
          if (typeof item === "string") {
            return {
              slug: item,
              name: item,
            };
          }

          return {
            slug: item.slug,
            name: item.name,
          };
        });

        setCategories(normalized);
      } catch (error) {
        console.error("Category loading failed:", error);
      } finally {
        setCategoryLoading(false);
      }
    }

    loadCategories();
  }, []);

  function handlePageChange(page) {
    updateUrl({ page });
  }

  function handleLimitChange(limit) {
    updateUrl({
      limit,
      page: 1,
    });
  }

  function handleCategoryChange(category) {
    updateUrl({
      category,
      page: 1,
    });
  }

  function handleSortChange(sort) {
    updateUrl({
      sort,
      page: 1,
    });
  }

  async function handleDelete(id) {
  try {
    setError("");

    await deleteProduct(id);

    const deletedIds = JSON.parse(
      localStorage.getItem("deletedProductIds") || "[]"
    );

    if (!deletedIds.includes(id)) {
      deletedIds.push(id);
    }

    localStorage.setItem(
      "deletedProductIds",
      JSON.stringify(deletedIds)
    );

    setProducts((previous) =>
      previous.filter((product) => product.id !== id)
    );

    setTotal((previous) => Math.max(0, previous - 1));
  } catch (error) {
    setError(
      error.message || "Failed to delete product."
    );
  }
}

  function handleRetry() {
    setRequestVersion((previous) => previous + 1);
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Products
            </h1>

            <p className="mt-1 text-gray-500">
              Manage your product catalog
            </p>
          </div>

          <button
            onClick={() => router.push("/products/new")}
            className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
          >
            + Add Product
          </button>
        </div>

        <div className="mb-6 rounded-xl border bg-white p-4 shadow-sm">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-1">
              <SearchBar
                value={searchInput}
                onChange={setSearchInput}
              />
            </div>

            <div>
              <select
                value={urlSearch ? "" : urlCategory}
                disabled={Boolean(urlSearch)}
                onChange={(e) =>
                  handleCategoryChange(e.target.value)
                }
                className="w-full rounded-lg border px-4 py-2 disabled:cursor-not-allowed disabled:bg-gray-100"
              >
                <option value="">All categories</option>

                {categories.map((category) => (
                  <option
                    key={category.slug}
                    value={category.slug}
                  >
                    {category.name}
                  </option>
                ))}
              </select>

              {urlSearch && (
                <p className="mt-1 text-xs text-gray-500">
                  Category filter is disabled while searching.
                </p>
              )}
            </div>

            <div>
              <select
                value={urlSort}
                onChange={(e) =>
                  handleSortChange(e.target.value)
                }
                className="w-full rounded-lg border px-4 py-2"
              >
                <option value="default">Default sort</option>
                <option value="price-asc">
                  Price: Low to High
                </option>
                <option value="price-desc">
                  Price: High to Low
                </option>
                <option value="rating-desc">
                  Rating: High to Low
                </option>
                <option value="title-asc">
                  Title: A to Z
                </option>
                <option value="title-desc">
                  Title: Z to A
                </option>
              </select>
            </div>
          </div>
        </div>

        {loading && <Loading text="Loading products..." />}

        {!loading && error && (
          <ErrorMessage
            message={error}
            onRetry={handleRetry}
          />
        )}

        {!loading && !error && products.length === 0 && (
          <div className="rounded-lg border bg-white p-10 text-center">
            <h2 className="text-xl font-semibold">
              No products found
            </h2>

            <p className="mt-2 text-gray-500">
              Try changing your search or filter.
            </p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <>
            <ProductTable
              products={products}
              onDelete={handleDelete}
            />

            <div className="grid gap-4 md:hidden">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            <Pagination
              page={urlPage}
              total={total}
              limit={urlLimit}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
            />
          </>
        )}
      </main>
    </div>
  );
}