// src/app/page.tsx

export const dynamic = "force-dynamic";

type Chef = {
  email: string;
  recipes: number;
};

type Recipe = {
  title: string;
  description: string;
};

export default async function HomePage() {
  const bestChefRes = await fetch("http://localhost:8000/stats/best-chef", {
    cache: "no-store",
  });
  const bestRecipeRes = await fetch("http://localhost:8000/stats/best-recipe", {
    cache: "no-store",
  });

  const bestChef: Chef = await bestChefRes.json();
  const bestRecipe: Recipe = await bestRecipeRes.json();

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-12">
      {/* 🏠 Website Intro */}
      <section>
        <h1 className="text-4xl font-bold text-blue-800 mb-4">Welcome to RecipeApp 🍳</h1>
        <p className="text-white-700 text-lg">
          RecipeApp is a modern platform that connects chefs and food lovers.
          Chefs can share their culinary creations, and visitors can explore, learn, and enjoy.
          Built using FastAPI, Next.js, and PostgreSQL – this full-stack app is secure, fast, and scalable.
        </p>
      </section>

      {/* 💡 Features Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-green-700">🔥 Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border rounded bg-blue-50 shadow">
            <h3 className="font-bold text-lg text-emerald-400">🎯 Usability</h3>
            <p className="text-gray-600">
              Simple and user-friendly interface for both chefs and visitors. Easily navigate, post, and view recipes.
            </p>
          </div>
          <div className="p-4 border rounded bg-yellow-50 shadow">
            <h3 className="font-bold text-lg  text-emerald-400">🔒 Reliability</h3>
            <p className="text-gray-600">
              Built with secure authentication and stable backend architecture using FastAPI and PostgreSQL.
            </p>
          </div>
          <div className="p-4 border rounded bg-purple-50 shadow">
            <h3 className="font-bold text-lg  text-emerald-400 ">⚡ Performance</h3>
            <p className="text-gray-600">
              Fast response times and modern tech stack (Next.js App Router, SSR, Tailwind) ensure excellent performance.
            </p>
          </div>
          <div className="p-4 border rounded bg-pink-50 shadow">
            <h3 className="font-bold text-lg  text-emerald-400">🌟 Unique Features</h3>
            <p className="text-gray-600">
              Role-based system (chefs/visitors), JWT login, best recipe stats, and more to come.
            </p>
          </div>
        </div>
      </section>

      {/* 🏆 Best Chef */}
      <section>
        <h2 className="text-xl font-semibold text-blue-700 mb-2">🏆 Best Chef</h2>
        {bestChef.email ? (
          <div className="p-4 border rounded bg-blue-100">
            <p className="text-lg  text-emerald-400">👨‍🍳 {bestChef.email}</p>
            <p className="text-sm text-gray-700">{bestChef.recipes} recipes created</p>
          </div>
        ) : (
          <p>No chefs found</p>
        )}
      </section>

      {/* 🥇 Best Recipe */}
      <section>
        <h2 className="text-xl font-semibold text-green-700 mb-2">🥇 Best Recipe</h2>
        {bestRecipe.title ? (
          <div className="p-4 border rounded bg-green-100">
            <p className="text-lg font-medium  text-emerald-400">{bestRecipe.title}</p>
            <p className="text-sm text-gray-700">{bestRecipe.description || "No description"}</p>
          </div>
        ) : (
          <p>No recipes found</p>
        )}
      </section>
    </div>
  );
}
