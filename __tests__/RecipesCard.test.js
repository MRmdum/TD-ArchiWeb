import { render, screen } from "@testing-library/react";
import RecipesCard from "../pages/components/RecipesCard";

const mockRecipe = {
  id: 1,
  name: "Pâtes Carbonara",
  image_url: "https://cache.marieclaire.fr/data/photo/w1000_ci/6g/lasagnes-aux-3-viandes-pate-maison.jpg",
  description: "Un plat italien classique.",
  cook_time: 10,
  prep_time: 5,
};

test("affiche les infos de la recette", () => {

  render(<RecipesCard recipe={mockRecipe} index={0} />);

  expect(screen.getByText(/Pâtes Carbonara/)).toBeInTheDocument();
  expect(screen.getByText(/Un plat italien classique/)).toBeInTheDocument();
  expect(screen.getByText(/15 min/)).toBeInTheDocument();
});
