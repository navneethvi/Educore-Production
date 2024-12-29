# FROM node AS build

# WORKDIR /app

# COPY package.json .

# RUN npm install

# COPY . .

# ARG VITE_STRIPE_KEY
# ARG VITE_GOOGLE_CLIENT_ID


# ENV VITE_STRIPE_KEY=${VITE_STRIPE_KEY}
# ENV VITE_GOOGLE_CLIENT_ID=${VITE_GOOGLE_CLIENT_ID}


# RUN npm run dev


# FROM node:18-alpine

# WORKDIR /app

# RUN npm install -g serve

# COPY --from=build /app/build /app

# EXPOSE 5173

# CMD ["serve", "-s", ".", "-l", "5173"]


# Use an official Node.js runtime as a parent image
FROM node AS build

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files first
COPY package*.json ./

ARG VITE_STRIPE_KEY
ARG VITE_GOOGLE_CLIENT_ID


ENV VITE_STRIPE_KEY=${VITE_STRIPE_KEY}
ENV VITE_GOOGLE_CLIENT_ID=${VITE_GOOGLE_CLIENT_ID}

# Install frontend dependencies
RUN npm install

FROM node:18-alpine


WORKDIR /app


RUN npm install -g serve


# Copy the rest of the application code
COPY . .

# Expose the port that Vite will serve the app on
EXPOSE 5173

# Command to run the app using Vite
CMD ["serve", "-s", ".", "-l", "5173"]
