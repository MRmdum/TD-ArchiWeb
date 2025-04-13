import { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "reactstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from "next/router";
import axios from "axios";
import Cookies from "js-cookie";
import RecipesCard from "./components/RecipesCard";

const API_BASE_URL = "https://gourmet.cours.quimerch.com";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [username, setUsername] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedUsername = sessionStorage.getItem("username");
    setUsername(storedUsername);

    if (Cookies.get("jwt") && storedUsername) {
      fetchFavorites(storedUsername);
    } else {
      router.push("/login"); // Redirect if not logged in
    }
  }, []);

  const fetchFavorites = async (username) => {
    try {
      const jwt = Cookies.get("jwt").toString();
      const response = await axios.get(
        `${API_BASE_URL}/users/${username}/favorites`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
            Accept: "application/json",
          },
          withCredentials: true,
        }
      );
      setFavorites(response.data || []);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  const toggleFavorite = async (recipeId) => {
    const username = sessionStorage.getItem("username");
    const jwt = Cookies.get("jwt")?.toString();
  
    if (!jwt || !username) {
      return alert("Veuillez vous connecter pour gérer vos favoris.");
    }
  
    try {
      const isFavorite = favorites.some(fav => fav.recipe.id === recipeId);
  
      if (isFavorite) {
        await axios.delete(
          `${API_BASE_URL}/users/${username}/favorites?recipeID=${recipeId}`,
          {
            headers: { Authorization: `Bearer ${jwt}` },
            withCredentials: true,
          }
        );
        setFavorites(prev => prev.filter(fav => fav.recipe.id !== recipeId));
      } else {
        await axios.post(
          `${API_BASE_URL}/users/${username}/favorites?recipeID=${recipeId}`,
          null,
          {
            headers: { Authorization: `Bearer ${jwt}` },
            withCredentials: true,
          }
        );
        fetchFavorites(); // Refresh list
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour des favoris:", error);
    }
  };

  const handleLogout = async () => {
    try {
      Cookies.remove("jwt");
      sessionStorage.removeItem("username");
      router.push("/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <Container className="mt-4" style={{ position: "relative", zIndex: 1 }}>
      <Row>
        {favorites?.length > 0 ? (
          favorites.map((favObj, index) => (
            <Col sm="12" md="6" lg="3" key={favObj.recipe.id} className="mb-4">
              <RecipesCard
                recipe={favObj.recipe} // ✅ pass the actual recipe object
                index={index}
                favorites={favorites.map(f => f.recipe.id)} // keep your ID list accurate
                username={username}
                onToggleFavorite={toggleFavorite}
                router={router}
              />
            </Col>
          ))
        ) : (
          <Col className="text-center mt-4">
            <h3>Vous n'avez pas encore de recettes en favoris.</h3>
          </Col>
        )}
      </Row>
    </Container>
  );
}
