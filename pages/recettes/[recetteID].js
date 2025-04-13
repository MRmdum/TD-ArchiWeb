import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Container, Row, Col, Button, Spinner } from "reactstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import Image from "next/image";
import Cookies from "js-cookie";

const API_BASE_URL = "https://gourmet.cours.quimerch.com";

export default function RecetteDetail() {
  const router = useRouter();
  const { recetteID } = router.query;

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (recetteID) {
      fetchRecipe();
      const storedUsername = sessionStorage.getItem("username");
      setUsername(storedUsername);
    }
  }, [recetteID]);

  // Check favorite status once the recipe and username are ready
  useEffect(() => {
    if (username && recetteID) {
      checkIfFavorite();
    }
  }, [username, recetteID]);

  const fetchRecipe = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/recipes/${recetteID}`);
      setRecipe(response.data);
    } catch (error) {
      setError("Erreur lors du chargement de la recette.");
    } finally {
      setLoading(false);
    }
  };

  const checkIfFavorite = async () => {
    try {
      if (!username) return;

      const jwt = Cookies.get("jwt");
      const response = await axios.get(`${API_BASE_URL}/users/${username}/favorites`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        withCredentials: true,
      });

      const favorites = response.data || [];
      const match = favorites.some(f => f.recipe?.id === recetteID);
      setIsFavorite(match); // Set favorite status once data is fetched
    } catch (err) {
      console.error("Erreur lors du check des favoris", err);
    }
  };

  const toggleFavorite = async () => {
    try {
      const jwt = Cookies.get("jwt");
      if (!jwt || !username) return alert("Veuillez vous connecter.");

      if (isFavorite) {
        await axios.delete(`${API_BASE_URL}/users/${username}/favorites?recipeID=${recetteID}`, {
          headers: { Authorization: `Bearer ${jwt}` },
          withCredentials: true,
        });
      } else {
        await axios.post(`${API_BASE_URL}/users/${username}/favorites?recipeID=${recetteID}`, null, {
          headers: { Authorization: `Bearer ${jwt}` },
          withCredentials: true,
        });
      }

      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error("Erreur lors du toggle du favori", err);
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner color="primary" />
        <p>Chargement de la recette...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center mt-5">
        <p className="text-danger">{error}</p>
      </Container>
    );
  }

  return (
    <>
      <Container className="mt-4" style={{ position: "relative", zIndex: 1 }}>
        <Row className="mb-4 justify-content-between align-items-center">
          <Col>
            <h1 className="display-4">{recipe.name}</h1>
          </Col>
          <Col className="text-end">
            <Button color="secondary" className="me-2" onClick={() => router.push("/")}>
              Retour à l'accueil
            </Button>
            <Button
              color={isFavorite ? "danger" : "success"}
              onClick={toggleFavorite}
              disabled={!username}
            >
              {isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
            </Button>
          </Col>
        </Row>

        <Row>
          <Col md="6" className="mb-4">
            <img
              src={recipe.image_url}
              alt={recipe.name}
              className="img-fluid rounded shadow"
              style={{ maxHeight: "400px", objectFit: "cover" }}
            />
          </Col>

          <Col md="6">
            <p><strong>Catégorie:</strong> {recipe.category}</p>
            <p><strong>Calories:</strong> {recipe.calories}</p>
            <p><strong>Temps de préparation:</strong> {recipe.prep_time} min</p>
            <p><strong>Temps de cuisson:</strong> {recipe.cook_time} min</p>
            <p><strong>Coût:</strong> {recipe.cost}€</p>
            <p><strong>Portions:</strong> {recipe.servings}</p>
            <p><strong>Quand manger:</strong> {recipe.when_to_eat}</p>
            <p><strong>Créé par:</strong> {recipe.created_by}</p>
            <p><strong>Date de création:</strong> {new Date(recipe.created_at).toLocaleDateString()}</p>
            {recipe.disclaimer && <p className="text-muted fst-italic">{recipe.disclaimer}</p>}
          </Col>
        </Row>

        <Row className="mt-5">
          <Col>
            <h2 className="h4">Description</h2>
            <p>{recipe.description}</p>

            <h2 className="h4 mt-4">Instructions</h2>
            <p>{recipe.instructions}</p>
          </Col>
        </Row>
      </Container>

      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
        }}
      >
        <Image
          src="/cuisine.jpg"
          alt="Fond de cuisine"
          layout="fill"
          objectFit="cover"
          quality={100}
        />
      </div>
    </>
  );
}
