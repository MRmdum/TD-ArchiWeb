import { useRouter } from "next/router";
import axios from "axios";
import Cookies from "js-cookie";
import DOMPurify from "dompurify";
import Image from "next/image";
import styles from "../styles/Login.module.css";

const API_BASE_URL = "https://gourmet.cours.quimerch.com";

export default function Login() {
  const router = useRouter();

  const sanitizeInput = (input) => DOMPurify.sanitize(input);

  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    let username = sanitizeInput(formData.get("username"));
    let password = sanitizeInput(formData.get("password"));

    try {
      const response = await axios.post(
        `${API_BASE_URL}/login`,
        { username, password },
        { withCredentials: true }
      );

      const token = response.data.token;

      if (token) {
        Cookies.set("jwt", token, { expires: 1, secure: true });
        sessionStorage.setItem("username", username);
        router.push("/");
      } else {
        alert("Login failed. No token received.");
      }
    } catch (err) {
      alert("Error in connexion:\n" + err);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.background}>
        <Image
          src="/cuisine.jpg"
          alt="Background Image"
          fill
          style={{ objectFit: "cover" }}
          quality={100}
        />
      </div>

      <form className={styles.loginForm} onSubmit={handleLogin}>
        <h2>Login</h2>

        <label htmlFor="username">Username</label>
        <input type="text" name="username" required />

        <label htmlFor="password">Password</label>
        <input type="password" name="password" required />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}
