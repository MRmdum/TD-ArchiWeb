# Étape 1 : Build de l'application
FROM node:18-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . . 

RUN npm run build

# Étape 2 : Image finale avec un serveur Node.js minimaliste
FROM node:18-alpine
WORKDIR /app

ENV PORT=80
ENV HOSTNAME="0.0.0.0"
ENV ORIGIN="https://kappa.cours.quimerch.com"
ENV NODE_ENV=production

# Ajouter un utilisateur non root pour la sécurité
RUN addgroup -S nextjs && adduser -S nextjs -G nextjs
USER nextjs

COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 80
CMD ["node", "server.js"]
