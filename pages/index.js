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
  const router = useRouter();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (!storedUsername) {
      router.push("/login");
      return;
    }
    setUsername(storedUsername);
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
    try {
      // const response = await axios.get(`${API_BASE_URL}/favorites`, { withCredentials: true });
      // setFavorites(response.data);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  const toggleFavorite = async (recipeId) => {
    if (!username) return alert("Veuillez vous connecter pour gérer vos favoris.");
    try {
      // if (favorites.includes(recipeId)) {
      //   await axios.delete(`${API_BASE_URL}/users/${username}/favorites`, {
      //     data: { recipeId },
      //     withCredentials: true,
      //   });
      // } else {
      //   await axios.post(`${API_BASE_URL}/users/${username}/favorites`, { recipeId }, { withCredentials: true });
      // }
      // fetchFavorites();
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
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Liste des Recettes</h1>
        <button onClick={handleLogout} className="p-2 bg-red-500 text-white">Se déconnecter</button>
      </div>
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
