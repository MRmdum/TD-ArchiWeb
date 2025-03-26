import { useState, useEffect } from "react";
import React from "react";
import {
  Container, Row, Col, Button, Card, CardBody, CardImg, CardTitle, CardText
} from "reactstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from "next/router";
import axios from "axios";

const API_BASE_URL = "https://gourmet.cours.quimerch.com";

export default function Home({ recipes }) {
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

    // Check for saved dark mode preference
    const storedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(storedDarkMode);
    if (storedDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    // Save the dark mode state to localStorage
    localStorage.setItem("darkMode", darkMode);
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

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
    <div className={`container mx-auto p-6 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"} min-h-screen`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-extrabold">🍽️ Nos Recettes Gourmandes: Kappa Edition</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-all"
          >
            {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
          </button>
          <button onClick={handleLogout} className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all">
            Se déconnecter
          </button>
        </div>
      </div>
      <Container className="mt-4">
        <Row>
          <h1 className="text-center mb-4">🍽️ Recettes Gourmandes</h1>
        </Row>
        <Row>
          {Array.isArray(recipes) && recipes.length > 0 ? (
            recipes.map((recipe) => (
              <Col sm="12" md="6" lg="3" key={recipe.id} className="mb-4">
                <Card
                  className="shadow-lg rounded-3"
                  style={{
                    transition: "transform 0.3s, box-shadow 0.3s",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                  onClick={() => router.push(`/recettes/${recipe.id}`)}
                >
                  <CardImg
                    top
                    width="100%"
                    src={recipe.image_url}
                    alt={recipe.name}
                    className="card-img-top"
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <CardBody>
                    <CardTitle tag="h5" className="text-center">{recipe.name}</CardTitle>
                    <CardText className="text-center text-muted">{recipe.description}</CardText>
                    <CardText className="text-center">
                      <strong>Ingrédients:</strong> {recipe.ingredients?.join(", ") || "Non spécifié"}
                    </CardText>
                    <div className="d-flex justify-content-center">
                      <Button
                        color="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(recipe.id);
                        }}
                      >
                        ☆
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            ))
          ) : (
            <p className="text-center text-muted">Aucune recette disponible.</p>
          )}
        </Row>
        <Row className="justify-content-center mt-4">
          <Button onClick={() => router.push('/favorites')} color="primary">
            Voir Favoris
          </Button>
        </Row>
      </Container>
    </div>
  );
}

export async function getStaticProps() {
  try {
    const response = await axios.get(`${API_BASE_URL}/recipes`);
    return {
      props: {
        recipes: response.data || [], // Ensure it's always an array
      },
      revalidate: 60, // Rebuild every 60s
    };
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return {
      props: {
        recipes: [], // Ensure recipes is an empty array on failure
      },
    };
  }
}
