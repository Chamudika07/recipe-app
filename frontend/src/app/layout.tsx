// src/app/layout.tsx
import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Recipe App",
  description: "Chef & Visitor Recipe Sharing",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        {/* ✅ Navbar */}
        <nav className="bg-blue-700 text-white p-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">
              🍲 RecipeApp
            </Link>
            <div className="space-x-4">
              <Link href="/recipes" className="hover:underline">Recipes</Link>
              <Link href="/best-recipes" className="hover:underline">🏆 Best</Link>
              <Link href="/recipess/add" className="hover:underline">Add</Link>
              <Link href="/signup" className="hover:underline">Sign Up</Link>
              <Link href="/login" className="hover:underline">Login</Link>
            </div>
          </div>
        </nav>

        {/* ✅ Page Content */}
        <main className="flex-1">{children}</main>

        {/* ✅ Footer */}
        <footer className="bg-gray-100 text-center p-4 text-sm text-gray-500">
          © {new Date().getFullYear()} RecipeApp. Built by Chamudika 🍳
        </footer>
      </body>
    </html>
  );
}
