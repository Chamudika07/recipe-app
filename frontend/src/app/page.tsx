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
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Welcome to RecipeApp 🍳</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-blue-700 mb-2">🏆 Best Chef</h2>
        {bestChef.email ? (
          <div className="p-4 border rounded bg-blue-50">
            <p className="text-lg">👨‍🍳 {bestChef.email}</p>
            <p className="text-sm text-gray-700">{bestChef.recipes} recipes created</p>
          </div>
        ) : (
          <p>No chefs found</p>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold text-green-700 mb-2">🥇 Best Recipe</h2>
        {bestRecipe.title ? (
          <div className="p-4 border rounded bg-green-50">
            <p className="text-lg font-medium">{bestRecipe.title}</p>
            <p className="text-sm text-gray-700">{bestRecipe.description || "No description"}</p>
          </div>
        ) : (
          <p>No recipes found</p>
        )}
      </section>
    </div>
  );
}

