# Use an official Node.js runtime as a parent image for the build stage
FROM node AS build

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files first to install dependencies
COPY package*.json ./

# Set environment variables for VITE_STRIPE_KEY and VITE_GOOGLE_CLIENT_ID
ARG VITE_STRIPE_KEY
ARG VITE_GOOGLE_CLIENT_ID

ENV VITE_STRIPE_KEY=${VITE_STRIPE_KEY}
ENV VITE_GOOGLE_CLIENT_ID=${VITE_GOOGLE_CLIENT_ID}

# Install frontend dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Vite app
RUN npm run build

# Use a smaller Node.js image for serving the built app
FROM node:18-alpine

# Set the working directory to /app
WORKDIR /app

# Install the 'serve' package globally to serve the app
RUN npm install -g serve

# Copy the production build from the previous stage (from /app/dist to /app)
COPY --from=build /app/dist /app

# Expose the port that the app will run on (Vite's default port is 5173)
EXPOSE 5173

# Command to serve the built app using 'serve'
CMD ["serve", "-s", ".", "-l", "5173"]
