
import { useState, useEffect, useRef } from "react";
import React from "react";
import { Container, Row, Col, Button, Card, CardBody, CardTitle, CardText } from "reactstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from "next/router";
import axios from "axios";
import Image from 'next/image';  // Import next/image
import Head from 'next/head';

const API_BASE_URL = "https://gourmet.cours.quimerch.com";

export async function getServerSideProps() {
  try {
    const response = await axios.get(`${API_BASE_URL}/recipes`);
    return { props: { initialRecipes: response.data || [] } };  // Ensure it's always an array
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return { props: { initialRecipes: [] } }; 
  }
}

function LazyCard({ children }) {
  const ref = useRef();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {visible ? children : <div style={{ height: "400px" }} />} {/* placeholder height */}
    </div>
  );
}

export default function Home({ initialRecipes = [] }) {
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
    <>
      {/* <Head>
        {initialRecipes?.slice(0, 4).map((recipe) => (
          recipe.image_url && (
            <link
              key={recipe.id}
              rel="preload"
              as="image"
              href={recipe.image_url}
              type="image/jpeg"
            />
          )
        ))}
      </Head> */}

      <Container className="mt-4" style={{ position: "relative", zIndex: 1 }}>
        {/* Content */}
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
            recipes.map((recipe, index) => {
              const cardContent = (
                <Card
                  className="shadow-lg rounded-3"
                  style={{ transition: "transform 0.3s, box-shadow 0.3s" }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                  onClick={() => router.push(`/recettes/${recipe.id}`)}
                >
                  <div style={{ position: 'relative', height: '200px' }}>
                    <Image
                      src={`/api/proxy?url=${encodeURIComponent(recipe.image_url)}`}
                      alt={recipe.name}
                      fill
                      className="object-cover"
                      priority={index < 4}
                      fetchPriority={index < 4 ? "high" : "auto"}
                    />
                  </div>
                  <CardBody>
                    <CardTitle tag="h5" className="text-center">{recipe.name}</CardTitle>
                    <CardText className="text-center text-muted">{recipe.description}</CardText>
                    <CardText className="text-center">
                      <strong>Préparation:</strong>{" "}
                      {recipe.cook_time && recipe.cook_time > 0 ? (
                        <span>{recipe.cook_time} min</span>
                      ) : (
                        "Non spécifié"
                      )}
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
              );
            
              return (
                <Col sm="12" md="6" lg="3" key={recipe.id} className="mb-4">
                  {index < 4 ? cardContent : <LazyCard>{cardContent}</LazyCard>}
                </Col>
              );
            })
          ) : (
            <Col className="text-center mt-4">
              <h3>Aucune recette disponible pour le moment.</h3>
            </Col>
          )}
        </Row>
      </Container>

      {/* Fixed Background Image */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1, // Ensure the background is behind all content
        }}
      >
        <Image
          src="/cuisine.jpg" // Make sure the image is in the public folder
          alt="Background Image"
          layout="fill"
          objectFit="cover"
          quality={100}
        />
      </div>
    </>
  );
}
