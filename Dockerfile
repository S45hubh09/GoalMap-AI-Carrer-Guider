# --- Stage 1: Build the React App ---
# We use Node 20 Alpine (a lightweight version of Node)
FROM node:20-alpine as builder

# Set the working folder inside the container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your project files
COPY . .

# 1. Accept the API Key as a build argument
ARG GEMINI_API_KEY

# 2. Write the key into a .env.local file so Vite can use it during build
# We add "VITE_" because React/Vite requires that prefix to see the variable.
RUN echo "VITE_GEMINI_API_KEY=$GEMINI_API_KEY" > .env.local

# Build the app (creates the 'dist' folder)
RUN npm run build

# --- Stage 2: Serve with Nginx ---
# We use Nginx Alpine to serve the website
FROM nginx:alpine

# Copy the built files from the previous stage to Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy our custom nginx config file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 8080 (Google Cloud Run loves this port)
EXPOSE 8080

# Start Nginx in the foreground so the container keeps running
CMD ["nginx", "-g", "daemon off;"]
