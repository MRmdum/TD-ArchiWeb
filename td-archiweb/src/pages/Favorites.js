import { useContext } from "react";
import { Link } from "react-router-dom";

import { FavoritesProvider } from "../context/FavoritesContext";

const Favorites = () => {
  const { favorites, removeFavorite } = useContext(FavoritesProvider);

  return (
    <div>
      <h1>Favorites</h1>
      {favorites.length === 0 ? <p>No favorites yet.</p> : (
        <ul>
          {favorites.map(recipe => (
            <li key={recipe.id}>
              <Link to={`/recettes/${recipe.id}`}>{recipe.name}</Link>
              <button onClick={() => removeFavorite(recipe.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Favorites;
