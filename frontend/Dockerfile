# Build stage
FROM node:lts-alpine as build

WORKDIR /app

COPY public_canvas/package*.json ./
RUN npm ci

COPY public_canvas/ .
RUN npm run build

# Deployment stage
FROM nginx:alpine

COPY --from=build /app/dist/public_canvas/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80