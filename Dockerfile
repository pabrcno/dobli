# Use an official Node runtime as a parent image for the base stage
FROM node:21-alpine as base

# Declare the arguments
ARG DATABASE_URL
ARG YOUTUBE_API_KEY
ARG GOOGLE_PROJECT_ID
ARG GCP_SA
ARG AUDIO_SNIPPET_BUCKET

# Set the environment variables
ENV DATABASE_URL=${DATABASE_URL} \
    YOUTUBE_API_KEY=${YOUTUBE_API_KEY} \
    GOOGLE_PROJECT_ID=${GOOGLE_PROJECT_ID} \
    GCP_SA=${GCP_SA} \
    AUDIO_SNIPPET_BUCKET=${AUDIO_SNIPPET_BUCKET}

WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files to the container
COPY . .

# Build the Next.js application for production
RUN npm run build

# Expose the application port (assuming your app runs on port 3000)
EXPOSE 3000

# Start the application
CMD ["npm", "start"]