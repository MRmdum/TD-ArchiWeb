import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Home from "./pages/Home";
import RecipeDetail from "./pages/RecipeDetail";
import Favorites from "./pages/Favorites";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import { FavoritesProvider } from "./context/FavoritesContext";

function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recettes/:recetteID" element={<RecipeDetail />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Router>
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;

// Context/AuthContext.js
import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (username, password) => {
    try {
      const response = await axios.post("https://gourmet.cours.quimerch.com/auth/login", { username, password });
      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Context/FavoritesContext.js
import { createContext, useState } from "react";

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  const addFavorite = (recipe) => {
    setFavorites([...favorites, recipe]);
  };

  const removeFavorite = (recipeID) => {
    setFavorites(favorites.filter((recipe) => recipe.id !== recipeID));
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

// Components/Navbar.js
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/favorites">Favorites</Link>
      {user ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
};

export default Navbar;

// Pages/Home.js
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

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

// Pages/RecipeDetail.js
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
