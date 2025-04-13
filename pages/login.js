import { useRouter } from "next/router";
import axios from "axios";
import Cookies from "js-cookie";
import DOMPurify from "dompurify"; // Import DOMPurify for XSS sanitization

const API_BASE_URL = "https://gourmet.cours.quimerch.com";

export default function Login() {
  const router = useRouter();

  // Function to sanitize user inputs
  const sanitizeInput = (input) => {
    return DOMPurify.sanitize(input);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    let username = formData.get("username");
    let password = formData.get("password");

    // Sanitize the inputs to prevent injections
    username = sanitizeInput(username);
    password = sanitizeInput(password);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/login`,
        { username, password },
        { withCredentials: true }
      );
      
      const token = response.data.token;

      if (token) {
        Cookies.set("jwt", token, { expires: 1, secure: true }); //1 day expiration
        sessionStorage.setItem("username", username);
        router.push("/");
      } else {
        alert("Login failed. No token received.");
      }
    } catch (err) {
      alert("Error in connexion: \n" + err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form 
        onSubmit={handleLogin} 
        className="bg-white p-6 rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        
        <label className="block mb-2">Username</label>
        <input 
          type="text"
          name="username"
          className="w-full p-2 border rounded mb-4"
          required
        />
        
        <label className="block mb-2">Password</label>
        <input 
          type="password"
          name="password"
          className="w-full p-2 border rounded mb-4"
          required
        />
        
        <button 
          type="submit" 
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>
    </div>
  );
}
