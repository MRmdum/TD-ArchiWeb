import { useState, useEffect } from "react";
import React from "react";
import { Container, Row, Col, Button, Card, CardBody, CardImg, CardTitle, CardText } from "reactstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from "next/router";
import axios from "axios";

const API_BASE_URL = "https://gourmet.cours.quimerch.com";

export async function getServerSideProps() {
  try {
    const response = await axios.get(`${API_BASE_URL}/recipes`);
    return { props: { initialRecipes: response.data || [] } };  // Ensure it's always an array
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return { props: { initialRecipes: [] } };  // Return an empty array on error
  }
}

export default function Home({ initialRecipes = [] }) {  // Default to empty array
  const [recipes, setRecipes] = useState(initialRecipes);
  const [favorites, setFavorites] = useState([]);
  const [username, setUsername] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    setUsername(storedUsername);

    if (storedUsername) {
      //fetchFavorites();
    }
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/favorites`, { withCredentials: true });
      setFavorites(response.data);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  const toggleFavorite = async (recipeId) => {
    if (!username) {
      return alert("Veuillez vous connecter pour gérer vos favoris.");
    }
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
      setUsername(null);
      setFavorites([]);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-between align-items-center mb-4">
        <h1 className="text-4xl font-extrabold">🍽️ Nos Recettes Gourmandes</h1>
        <div>
          {username ? (
            <>
              <Button color="primary" onClick={() => router.push('/favorites')} className="me-2">
                Voir Favoris
              </Button>
              <Button color="danger" onClick={handleLogout}>
                Se Déconnecter
              </Button>
            </>
          ) : (
            <Button color="success" onClick={() => router.push('/login')}>
              Se Connecter
            </Button>
          )}
        </div>
      </Row>

      <Row>
        {initialRecipes?.length > 0 ? (
          recipes.map((recipe) => (
            <Col sm="12" md="6" lg="3" key={recipe.id} className="mb-4">
              <Card
                className="shadow-lg rounded-3"
                style={{ transition: "transform 0.3s, box-shadow 0.3s" }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                onClick={() => router.push(`/recettes/${recipe.id}`)}
              >
                <CardImg top width="100%" src={recipe.image_url} alt={recipe.name} style={{ height: '200px', objectFit: 'cover' }} />
                <CardBody>
                  <CardTitle tag="h5" className="text-center">{recipe.name}</CardTitle>
                  <CardText className="text-center text-muted">{recipe.description}</CardText>
                  <CardText className="text-center">
                    <strong>Ingrédients:</strong> {recipe.ingredients?.join(", ") || "Non spécifié"}
                  </CardText>
                  {username && (
                    <div className="d-flex justify-content-center">
                      <Button
                        color={favorites.includes(recipe.id) ? "danger" : "secondary"}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(recipe.id);
                        }}
                      >
                        {favorites.includes(recipe.id) ? "★" : "☆"}
                      </Button>
                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>
          ))
        ) : (
          <Col className="text-center mt-4">
            <h3>Aucune recette disponible pour le moment.</h3>
          </Col>
        )}
      </Row>
    </Container>
  );
}
