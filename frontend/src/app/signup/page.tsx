"use client";

import { useState } from "react";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("visitor"); // default to visitor
  const router = useRouter();

  const handleSignup = async (e: any) => {
    e.preventDefault();

    try {
      await axios.post("/users/signup", { email, password, role });
      const res = await axios.post("/users/login", { email, password }); // auto login after signup
      localStorage.setItem("token", res.data.access_token);
      router.push("/recipes");
    } catch (err: any) {
        console.error(err); // 🧪 Print full error to the browser console
        if (err.response?.data?.detail) {
          alert("Signup failed: " + err.response.data.detail);
        } else {
          alert("Signup failed: " + err.message);
        }
      }
      
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-xl mb-4">Sign Up</h1>
      <form onSubmit={handleSignup} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          className="border px-3 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border px-3 py-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <select
          className="border px-3 py-2"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="visitor">Visitor</option>
          <option value="chef">Chef</option>
        </select>

        <button className="bg-green-600 text-white px-4 py-2">Sign Up</button>
      </form>
    </div>
  );
}
