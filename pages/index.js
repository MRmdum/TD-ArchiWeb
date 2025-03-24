// pages/index.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";

const API_BASE_URL = "https://gourmet.cours.quimerch.com";

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [username, setUsername] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (!storedUsername) {
      router.push("/login");
      return;
    }
    setUsername(storedUsername);
    fetchRecipes();
    // fetchFavorites();
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
    try {
      const response = await axios.get(`${API_BASE_URL}/favorites`, { withCredentials: true });
      setFavorites(response.data);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  const toggleFavorite = async (recipeId) => {
    if (!username) return alert("Veuillez vous connecter pour gérer vos favoris.");
    try {
      if (favorites.includes(recipeId)) {
        await axios.delete(`${API_BASE_URL}/users/${username}/favorites`, {
          data: { recipeId },
          withCredentials: true,
        });
      } else {
        await axios.post(`${API_BASE_URL}/users/${username}/favorites`, { recipeId }, { withCredentials: true });
      }
      fetchFavorites();
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get(`${API_BASE_URL}/logout`, { withCredentials: true });
      localStorage.removeItem("username");
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"} min-h-screen p-6 transition-all`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-extrabold">🍽️ Recettes Gourmandes</h1>
        <div className="flex items-center gap-4">
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 bg-gray-700 text-white rounded-full shadow-lg hover:bg-gray-600 transition-all">
            {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
          </button>
          <button onClick={handleLogout} className="p-3 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-all">Se déconnecter</button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl overflow-hidden cursor-pointer hover:shadow-2xl transition-all transform hover:scale-105 flex flex-col items-center p-4" onClick={() => router.push(`/recettes/${recipe.id}`)}>
            <div className="w-20 h-20 bg-gray-300 dark:bg-gray-700 rounded-full mb-4"></div>
            <div className="text-center">
              <h2 className="text-lg font-semibold mb-1">{recipe.name}</h2>
              <p className="text-gray-500 dark:text-gray-400 text-xs mb-2">{recipe.description}</p>
              <div className="flex justify-center items-center">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(recipe.id);
                  }}
                  className={`text-xl ${favorites.includes(recipe.id) ? 'text-red-500' : 'text-gray-400'} hover:text-red-600 transition-all`}
                >
                  {favorites.includes(recipe.id) ? "★" : "☆"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => router.push('/favorites')} className="mt-6 p-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-all">
        Voir Favoris
      </button>
    </div>
  );
}
