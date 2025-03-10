import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    axios.get("https://gourmet.cours.quimerch.com/recettes")
      .then(response => setRecipes(response.data))
      .catch(error => console.error("Error fetching recipes", error));
  }, []);

  return (
    <div>
      <h1>Recipes</h1>
      <ul>
        {recipes.map(recipe => (
          <li key={recipe.id}>
            <Link to={`/recettes/${recipe.id}`}>{recipe.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
