// pages/favorites.js (New Favorites Page)
import { useRouter } from "next/router";
import axios from "axios";
import { Container, Row, Col, Button, Card, CardBody, CardImg, CardTitle, CardText } from "reactstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

const API_BASE_URL = "https://gourmet.cours.quimerch.com";

export default function Favorites({ favoriteRecipes }) {
  const router = useRouter();

  return (
    <Container className="mt-4">
      <h1 className="text-center mb-4">⭐ Favorite Recipes</h1>
      <Row>
        {favoriteRecipes.length > 0 ? (
          favoriteRecipes.map((recipe) => (
            <Col sm="12" md="6" lg="3" key={recipe.id} className="mb-4">
              <Card
                className="shadow-lg rounded-3"
                onClick={() => router.push(`/recettes/${recipe.id}`)}
              >
                <CardImg src={recipe.image_url} alt={recipe.name} className="card-img-top" style={{ height: '200px', objectFit: 'cover' }} />
                <CardBody>
                  <CardTitle tag="h5" className="text-center">{recipe.name}</CardTitle>
                  <CardText className="text-center text-muted">{recipe.description}</CardText>
                </CardBody>
              </Card>
            </Col>
          ))
        ) : (
          <p className="text-center">No favorites added yet.</p>
        )}
      </Row>
      <Row className="justify-content-center mt-4">
        <Button onClick={() => router.push('/')} color="primary">
          Back to Home
        </Button>
      </Row>
    </Container>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;
  const token = req.cookies.token;

  if (!token) {
    return { props: { favoriteRecipes: [] } };
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/favorites`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    return { props: { favoriteRecipes: response.data } };
  } catch (error) {
    return { props: { favoriteRecipes: [] } };
  }
}