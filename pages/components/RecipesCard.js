import React from "react";
import { Card, CardBody, CardTitle, CardText, Button } from "reactstrap";
import RecipeImage from "./RecipeImage";
import Cookies from "js-cookie";

export default function RecipesCard({ recipe, index, favorites, username, onToggleFavorite, router }) {
  //const isFavorite = (favorites || []).some(f => f.recipe?.id === recipe.id);

  if(!recipe) return null;
  return (
    <Card
      className="shadow-lg rounded-3"
      style={{ transition: "transform 0.3s, box-shadow 0.3s", cursor: "pointer" }}
      onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
      onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
      onClick={() => router.push(`/recettes/${recipe.id}`)}
    >
      <div style={{ position: 'relative', height: '200px' }}>
        <RecipeImage
          src={recipe.image_url}
          alt={recipe.name}
          priority={index < 4}
          fetchPriority={index < 4 ? "high" : "auto"}
        />
      </div>
      <CardBody>
        <CardTitle tag="h5" className="text-center">{recipe.name}</CardTitle>
        <CardText className="text-center text-muted">{recipe.description}</CardText>
        <CardText className="text-center">
          <strong>Préparation:</strong>{" "}
          {recipe.prep_time && recipe.cook_time + recipe.prep_time > 0 ? (
            <span>{recipe.cook_time + recipe.prep_time} min</span>
          ) : (
            "Non spécifié"
          )}
        </CardText>
        {/* {Cookies.get("jwt") && (
          <div className="d-flex justify-content-center">
            <Button
              color={isFavorite ? "danger" : "secondary"}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(recipe.id);
              }}
            >
              {isFavorite ? "★" : "☆"}
            </Button>
          </div>
        )} */}
      </CardBody>
    </Card>
  );
}
