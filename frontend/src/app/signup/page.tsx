"use client";

import { useState, FormEvent } from "react";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("visitor"); // default to visitor
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.post("/users/signup", { email, password, role });
      const res = await axios.post("/users/login", { email, password }); // auto login after signup
      localStorage.setItem("token", res.data.access_token);
      
      // Show success alert
      alert("Signup successfully! Welcome to RecipeApp!");
      
      // Navigate to recipes page after a short delay
      setTimeout(() => {
        router.push("/recipes");
      }, 1000);
    } catch (error: unknown) {
      console.error("Signup error:", error);
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { detail?: string } } };
        if (axiosError.response?.data?.detail) {
          alert("Signup failed: " + axiosError.response.data.detail);
        } else {
          alert("Signup failed. Please try again.");
        }
      } else {
        alert("Signup failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/background.jpg')"
      }}
    >
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🍳 Join RecipeApp</h1>
          <p className="text-gray-600">Create your account and start sharing recipes</p>
        </div>
        
        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Create a password"
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Account Type
            </label>
            <select
              id="role"
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="visitor">👤 Visitor - Browse and vote on recipes</option>
              <option value="chef">👨‍🍳 Chef - Create and share recipes</option>
            </select>
          </div>
          
          <button 
            className="w-full bg-green-600 text-white px-4 py-3 rounded-md hover:bg-green-700 disabled:opacity-50 font-medium transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Create Account"}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-green-600 hover:text-green-800 font-medium">
              Sign in here
            </Link>
          </p>
        </div>
        
        <div className="mt-4 text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
