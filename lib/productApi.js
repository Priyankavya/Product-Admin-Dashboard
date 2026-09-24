import api from "./axios";

export async function getProducts({
  page = 1,
  limit = 20,
  search = "",
  category = "",
  sortBy = "",
  order = "asc",
  signal,
}) {
  const skip = (page - 1) * limit;

  let url = "/products";

  const params = {
    limit,
    skip,
  };

  if (search.trim()) {
    url = "/products/search";

    params.q = search.trim();
  } else if (category) {
    url = `/products/category/${encodeURIComponent(category)}`;
  }

  if (sortBy) {
    params.sortBy = sortBy;
    params.order = order;
  }

  const response = await api.get(url, {
    params,
    signal,
  });

  return response.data;
}

export async function getCategories() {
  const response = await api.get("/products/categories");

  return response.data;
}

export async function getProduct(id, signal) {
  const response = await api.get(`/products/${id}`, {
    signal,
  });

  return response.data;
}

export async function addProduct(product) {
  const response = await api.post("/products/add", product);

  return response.data;
}

export async function updateProduct(id, product) {
  const response = await api.put(`/products/${id}`, product);

  return response.data;
}

export async function deleteProduct(id) {
  const response = await api.delete(`/products/${id}`);

  return response.data;
}