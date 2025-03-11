import React, { createContext, useState, useContext } from "react";

// Create the context
const FavoritesContext = createContext();

// Provide the context to children components
export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  const addFavorite = (recipe) => {
    setFavorites([...favorites, recipe]);
  };

  const removeFavorite = (id) => {
    setFavorites(favorites.filter((recipe) => recipe.id !== id));
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

// Custom Hook to use the FavoritesContext
export const useFavorites = () => useContext(FavoritesContext);