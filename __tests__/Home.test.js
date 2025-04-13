import { render, screen, fireEvent } from "@testing-library/react";
import Home, { getServerSideProps } from "../pages/index";
import Cookies from "js-cookie";
import axios from "axios";
import { useRouter } from "next/router";

// 🔧 Mocks
jest.mock("axios");
jest.mock("js-cookie");
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("Page d'accueil Home", () => {
  const mockRouterPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue({ push: mockRouterPush });
  });

  const mockRecipes = [
    {
      id: 1,
      name: "Tarte aux pommes",
      image_url: "/tarte.jpg",
      description: "Une délicieuse tarte",
      cook_time: 20,
      prep_time: 10,
    },
    {
      id: 2,
      name: "Soupe de légumes",
      image_url: "/soupe.jpg",
      description: "Parfait pour l'hiver",
      cook_time: 30,
      prep_time: 15,
    },
  ];

  test("affiche les recettes fournies", () => {
    render(<Home initialRecipes={mockRecipes} />);

    expect(screen.getByText("🍽️ Nos Recettes Gourmandes")).toBeInTheDocument();
    expect(screen.getByText(/Tarte aux pommes/)).toBeInTheDocument();
    expect(screen.getByText(/Soupe de légumes/)).toBeInTheDocument();
  });

  test("bouton de connexion redirige vers /login", () => {
    Cookies.get.mockReturnValue(undefined); // Pas connecté
    render(<Home initialRecipes={mockRecipes} />);

    const loginBtn = screen.getByRole("button", { name: /se connecter/i });
    fireEvent.click(loginBtn);
    expect(mockRouterPush).toHaveBeenCalledWith("/login");
  });

  test("bouton 'Voir Favoris' désactivé si non connecté", () => {
    Cookies.get.mockReturnValue(undefined);
    render(<Home initialRecipes={mockRecipes} />);
    const favBtn = screen.getByRole("button", { name: /voir favoris/i });
    expect(favBtn).toBeDisabled();
  });

  test("getServerSideProps retourne des recettes", async () => {
    axios.get.mockResolvedValueOnce({ data: mockRecipes });

    const result = await getServerSideProps();
    expect(result).toEqual({
      props: {
        initialRecipes: mockRecipes,
      },
    });
  });

  test("getServerSideProps retourne une liste vide en cas d'erreur", async () => {
    axios.get.mockRejectedValueOnce(new Error("Network error"));

    const result = await getServerSideProps();
    expect(result).toEqual({
      props: {
        initialRecipes: [],
      },
    });
  });
});
