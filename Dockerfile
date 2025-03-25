# Étape 1 : Build de l'application
FROM node:18-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . . 
RUN npm run build

# Étape 2 : Run de l'application
FROM node:18-alpine
WORKDIR /app

ENV HOST 0.0.0.0
ENV PORT 80
ENV ORIGIN https://kappa.cours.quimerch.com

COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 80
CMD ["npm", "run", "start"]