// pages/recettes/[recetteID].js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const API_BASE_URL = "https://gourmet.cours.quimerch.com";

export default function RecetteDetail() {
  const router = useRouter();
  const { recetteID } = router.query;
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (recetteID) {
      fetchRecipe();
    }
  }, [recetteID]);

  const fetchRecipe = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/recipes/${recetteID}`);
      setRecipe(response.data);
      setLoading(false);
    } catch (error) {
      setError("Erreur lors du chargement de la recette.");
      setLoading(false);
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{recipe.name}</h1>
      <img src={recipe.image_url} alt={recipe.name} className="w-full max-w-lg rounded-lg mb-4" />
      <p><strong>Catégorie:</strong> {recipe.category}</p>
      <p><strong>Calories:</strong> {recipe.calories}</p>
      <p><strong>Temps de préparation:</strong> {recipe.prep_time} minutes</p>
      <p><strong>Temps de cuisson:</strong> {recipe.cook_time} minutes</p>
      <p><strong>Coût:</strong> {recipe.cost}€</p>
      <p><strong>Portions:</strong> {recipe.servings}</p>
      <p><strong>Quand manger:</strong> {recipe.when_to_eat}</p>
      <p><strong>Créé par:</strong> {recipe.created_by}</p>
      <p><strong>Date de création:</strong> {new Date(recipe.created_at).toLocaleDateString()}</p>
      <p><strong>Description:</strong> {recipe.description}</p>
      {recipe.disclaimer && <p className="text-gray-500 italic">{recipe.disclaimer}</p>}
      <h2 className="text-xl font-semibold mt-4">Instructions</h2>
      <p>{recipe.instructions}</p>
    </div>
  );
}
