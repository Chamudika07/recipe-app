"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

type TokenPayload = {
  sub: string;
  role: string;
  exp: number;
};

export default function AddRecipePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();

  const [isChef, setIsChef] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const decoded: TokenPayload = jwtDecode(token);
      if (decoded.role !== "chef") {
        alert("Only chefs can add recipes!");
        router.push("/recipes");
      } else {
        setIsChef(true);
      }
    } catch (err) {
      console.error("Invalid token");
      localStorage.removeItem("token");
      router.push("/login");
    }
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "/recipes/",
        { title, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Recipe added!");
      router.push("/recipes");
    } catch (err: any) {
      console.error(err);
      alert("Failed to add recipe: " + (err.response?.data?.detail || "Unknown error"));
    }
  };

  if (!isChef) return null;

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Add New Recipe</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Recipe title"
          className="border px-3 py-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          className="border px-3 py-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2">
          ➕ Add Recipe
        </button>
      </form>
    </div>
  );
}
