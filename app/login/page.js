"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/authApi";
import { isLoggedIn } from "@/utils/auth";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("emilys");
  const [password, setPassword] = useState("emilyspass");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) {
      router.replace("/products");
    }
  }, [router]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (loading) {
      return;
    }

    setError("");
    setLoading(true);

    try {
      const data = await loginUser(username, password);

      const token = data.accessToken || data.token;

      if (!token) {
        throw new Error("Login token was not returned.");
      }

      localStorage.setItem("accessToken", token);

      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.id,
          username: data.username,
          firstName: data.firstName,
          lastName: data.lastName,
          image: data.image,
        })
      );

      router.replace("/products");
    } catch (error) {
      setError(
        error.message || "Invalid username or password."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-3xl font-bold">
          Product Admin
        </h1>

        <p className="mb-6 text-gray-500">
          Login to manage products
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1 block font-medium">
              Username
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border px-4 py-2 outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="mb-1 block font-medium">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border px-4 py-2 outline-none focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 rounded-lg bg-gray-50 p-4 text-sm">
          <p className="font-medium">Demo credentials</p>
          <p>Username: emilys</p>
          <p>Password: emilyspass</p>
        </div>
      </div>
    </main>
  );
}