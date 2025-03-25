import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";

const API_BASE_URL = "https://gourmet.cours.quimerch.com";

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchRecipes();
    fetchFavorites();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/recipes`);
      setRecipes(response.data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  const fetchFavorites = async () => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  };

  const toggleFavorite = (recipeId) => {
    let updatedFavorites;
    if (favorites.includes(recipeId)) {
      updatedFavorites = favorites.filter(id => id !== recipeId);
    } else {
      updatedFavorites = [...favorites, recipeId];
    }
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Liste des Recettes</h1>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe.id} className="border p-2 mb-2">
            <Link href={`/recettes/${recipe.id}`}>{recipe.name}</Link>
            <button 
              onClick={() => toggleFavorite(recipe.id)}
              className={`ml-2 ${favorites.includes(recipe.id) ? 'text-red-500' : 'text-gray-500'}`}
            > 
              {favorites.includes(recipe.id) ? "★" : "☆"}
            </button>
          </li>
        ))}
      </ul>
      <button onClick={() => router.push('/favorites')} className="mt-4 p-2 bg-blue-500 text-white">
        Voir Favoris
      </button>
    </div>
  );
}
