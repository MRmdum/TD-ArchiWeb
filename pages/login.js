// pages/login.js
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const API_BASE_URL = "https://gourmet.cours.quimerch.com";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
    //   await axios.post(`${API_BASE_URL}/login`, { username, password }, { withCredentials: true });
    //   localStorage.setItem("username", username);
        localStorage.setItem("username", "defaultUser");
        router.push("/");
    } catch (error) {
        setError("Échec de la connexion. Vérifiez vos identifiants.");
    }
  };

  return (
    <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold">Connexion</h1>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
            type="text"
            placeholder="Nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2"
            required
            />
            <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2"
            required
            />
            <button type="submit" className="p-2 bg-blue-500 text-white">Se connecter</button>
        </form>
    </div>
  );
}
