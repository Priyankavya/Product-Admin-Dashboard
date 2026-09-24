"use client";

import { useRouter } from "next/navigation";
import { logout, getCurrentUser } from "@/utils/auth";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <button
          onClick={() => router.push("/products")}
          className="text-xl font-bold text-blue-600"
        >
          Product Admin
        </button>

        <div className="flex items-center gap-4">
          {user && (
            <span className="hidden text-sm text-gray-600 sm:block">
              {user.firstName} {user.lastName}
            </span>
          )}

          <button
            onClick={handleLogout}
            className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}