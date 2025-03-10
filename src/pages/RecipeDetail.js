import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const RecipeDetail = () => {
  const { recetteID } = useParams();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    axios.get(`https://gourmet.cours.quimerch.com/recettes/${recetteID}`)
      .then(response => setRecipe(response.data))
      .catch(error => console.error("Error fetching recipe details", error));
  }, [recetteID]);

  if (!recipe) return <p>Loading...</p>;

  return (
    <div>
      <h1>{recipe.name}</h1>
      <p>{recipe.description}</p>
    </div>
  );
};

export default RecipeDetail;
