import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import Home from "./pages/Home";
import RecipeDetail from "./pages/RecipeDetail";
import Favorites from "./pages/Favorites";
import Login from "./pages/Login";

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
