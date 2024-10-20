# Use an official Node runtime as a parent image for the base stage
FROM node:21-alpine as base

# Set the working directory
WORKDIR /usr/src/app

# Define a build argument for DATABASE_URL
ARG DATABASE_URL

# Set the environment variable for the build process
ENV DATABASE_URL=${DATABASE_URL}

# Copy the package.json and package-lock.json first to leverage Docker caching
COPY package*.json ./

# Copy the prisma folder (relative path)
COPY prisma ./prisma

COPY patches ./patches

# Install dependencies (DATABASE_URL might be needed by Prisma here)
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the Next.js application for production
RUN npm run build

# Expose the application port (assuming your app runs on port 3000)
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
