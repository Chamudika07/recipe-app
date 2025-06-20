// src/app/recipes/page.tsx

export const dynamic = "force-dynamic"; // to force SSR and bypass cache if needed

type Recipe = {
  id: number;
  title: string;
  description?: string;
  user_id: number;
};

export default async function RecipesPage() {
  const res = await fetch("http://localhost:8000/recipes", {
    cache: "no-store", // don't cache for dev
  });

  const recipes: Recipe[] = await res.json();

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">All Recipes</h1>

      {recipes.length === 0 ? (
        <p className="text-gray-600">No recipes found.</p>
      ) : (
        <div className="space-y-4">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="border p-4 rounded shadow-sm">
              <h2 className="text-lg font-semibold">{recipe.title}</h2>
              <p className="text-sm text-gray-700 mt-1">
                {recipe.description || "No description"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
