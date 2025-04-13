
import { useState, useEffect, useRef } from "react";
import React from "react";
import { Container, Row, Col, Button, Card, CardBody, CardTitle, CardText } from "reactstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from "next/router";
import axios from "axios";
import Image from 'next/image';  // Import next/image
import Head from 'next/head';
import RecipeImage from "./components/RecipeImage";
import RecipesCard from "./components/RecipesCard";

import Cookies from "js-cookie";


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
      {visible ? children : <div style={{ height: "400px" }} />}
    </div>
  );
}

export default function Home({ initialRecipes = [] }) {
  const [recipes, setRecipes] = useState(initialRecipes);
  const [favorites, setFavorites] = useState([]);
  const [username, setUsername] = useState("");
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (Cookies.get("jwt")) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    const storedUsername = sessionStorage.getItem("username");
    setUsername(storedUsername);

    if (Cookies.get("jwt")) {
      fetchFavorites();
    }
  }, []);

  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  const fetchFavorites = async () => {
    try {
      const jwt = Cookies.get("jwt").toString();
      const username = sessionStorage.getItem("username");
  
      if (!jwt || !username) {
        return alert("Please log in to view your favorites.");
      }

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
  
      const favoritesData = response.data || [];
      setFavorites(favoritesData);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };
  

  const toggleFavorite = async (recipeId) => {
    const username = sessionStorage.getItem("username");
    if (!Cookies.get("jwt")) {
      return alert("Veuillez vous connecter pour gérer vos favoris.");
    }
    try {
      const isAlreadyFavorite = favorites.some((fav) => fav.recipe?.id === recipeId);
      if (isAlreadyFavorite) {
        await axios.delete(
          `${API_BASE_URL}/users/${username}/favorites?recipeID=${recipeId}`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("jwt")}`,
            },
            withCredentials: true, 
          }
        );

      } else {
        const jwt = Cookies.get("jwt").toString();
        await axios.post(
          `${API_BASE_URL}/users/${username}/favorites?recipeID=${recipeId}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
            withCredentials: true, 
          }
        );
      }
      await fetchFavorites();
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  const handleLogout = async () => {
    try {
      //await axios.get(`${API_BASE_URL}/logout`, { withCredentials: true });
      Cookies.remove("jwt"); 
      sessionStorage.removeItem("username");
      setUsername(null);
      setFavorites([]);
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <>
      <Container className="mt-4" style={{ position: "relative", zIndex: 1 }}>
        {/* Content */}
        <Row className="justify-content-between align-items-center mb-4">
          <h1 className="text-4xl font-extrabold">🍽️ Nos Recettes Gourmandes</h1>
          <div>
          {hasMounted && (
            <>
              <Button
                color="primary"
                onClick={() => router.push('/favorites')}
                className="me-2"
                disabled={!isLoggedIn}
              >
                Voir Favoris
              </Button>
              <Button
                color={isLoggedIn ? "danger" : "success"}
                onClick={isLoggedIn ? handleLogout : () => router.push('/login')}
              >
                {isLoggedIn ? "Se Déconnecter" : "Se Connecter"}
              </Button>
            </>
          )}
          </div>
        </Row>

        <Row>
          {initialRecipes?.length > 0 ? (
            recipes.map((recipe, index) => (
              <Col sm="12" md="6" lg="3" key={recipe.id} className="mb-4">
                {index < 4 ? (
                  <RecipesCard
                    recipe={recipe}
                    index={index}
                    favorites={favorites}
                    username={username}
                    onToggleFavorite={toggleFavorite}
                    router={router}
                  />
                ) : (
                  <LazyCard>
                    <RecipesCard
                      recipe={recipe}
                      index={index}
                      favorites={favorites}
                      username={username}
                      onToggleFavorite={toggleFavorite}
                      router={router}
                    />
                  </LazyCard>
                )}
              </Col>
            ))
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
          zIndex: -1,
        }}
      >
        <Image
          src="/cuisine.jpg"
          alt="Background Image"
          fill
          style={{ objectFit: 'cover' }}
          quality={100}
        />
      </div>
    </>
  );
}
