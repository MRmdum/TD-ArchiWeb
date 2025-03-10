# Utilise l'image node pour la construction
FROM node:18-alpine AS build

# Définit le répertoire de travail
WORKDIR /app

# Copie les fichiers package.json et package-lock.json
COPY package.json package-lock.json ./

# Installe les dépendances
RUN npm install

# Copie le reste du code source
COPY ./td-archiweb/src .

# Construit l'application
RUN npm run build

# Utilise une image Nginx pour servir l'application
FROM nginx:alpine

# Copie les fichiers générés dans le dossier de build de React
COPY --from=build /app/dist /usr/share/nginx/html

# Expose le port 80
EXPOSE 80

# Lance Nginx
CMD ["nginx", "-g", "daemon off;"]
