export function isLoggedIn() {
  if (typeof window === "undefined") {
    return false;
  }

  return Boolean(localStorage.getItem("accessToken"));
}

export function getCurrentUser() {
  if (typeof window === "undefined") {
    return null;
  }

  const user = localStorage.getItem("user");

  return user ? JSON.parse(user) : null;
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  }
}