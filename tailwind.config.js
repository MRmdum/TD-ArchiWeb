/** @type {import('tailwindcss').Config} */

export default defineConfig({
  darkMode: 'class',  // Utilisation de la classe "dark" pour activer le mode sombre
  theme: {
    extend: {
      colors: {
        // Ajoute ici des couleurs personnalisées si tu veux les utiliser dans ton projet
        'dark-background': '#1a202c',  // Exemple de couleur pour l'arrière-plan en mode sombre
        'light-background': '#f7fafc', // Exemple de couleur pour l'arrière-plan en mode clair
        'dark-text': '#e2e8f0',  // Exemple de couleur pour le texte en mode sombre
        'light-text': '#2d3748', // Exemple de couleur pour le texte en mode clair
      },
      spacing: {
        // Ajout d'espacements personnalisés si nécessaire
        '128': '32rem',  // Exemple d'ajout d'un espacement personnalisé
      },
      boxShadow: {
        // Ajout de nouveaux effets d'ombre si nécessaire
        'custom-shadow': '0 4px 10px rgba(0, 0, 0, 0.1)',  // Exemple d'ombre personnalisée
      },
    },
  },
  plugins: [],
})