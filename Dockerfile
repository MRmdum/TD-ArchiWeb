# Étape 1 : Build de l'application
FROM node:18-alpine AS builder
WORKDIR /app

# Copier uniquement les fichiers nécessaires pour installer les dépendances
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copier le reste des fichiers pour la compilation
COPY . . 

# Compiler l’application Next.js
RUN npm run build

# Étape 2 : Run de l'application
FROM node:18-alpine
WORKDIR /app

# Définition des variables d'environnement
ENV HOST 0.0.0.0
ENV PORT 80
ENV ORIGIN https://chi.cours.quimerch.com

# Copier uniquement les fichiers nécessaires depuis l'étape de build
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 80

# Lancer l'application avec npm
CMD ["npm", "run", "start"]