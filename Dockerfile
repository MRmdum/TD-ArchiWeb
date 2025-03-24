# Utiliser l'image officielle Node.js comme base
FROM node:18-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package.json package-lock.json ./

# Installer les dépendances
RUN npm install

# Copier tout le projet dans le conteneur
COPY . .

# Construire l'application Next.js
RUN npm run build

# Exposer le port utilisé par Next.js
EXPOSE 3000

# Démarrer l'application
CMD ["npm", "run", "start"]
