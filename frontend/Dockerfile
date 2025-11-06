# Frontend Dockerfile - Angular 17
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build --prod

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist/elibrary-frontend /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]