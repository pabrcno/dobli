# Use an official Node runtime as a parent image
FROM node:21-alpine

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

ARG YOUTUBE_API_KEY
ENV YOUTUBE_API_KEY=${YOUTUBE_API_KEY}

# FFmpeg is required, so we add the packages
RUN apk add --no-cache ffmpeg

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json (if available) to the working directory
COPY package*.json ./

# Install app dependencies, including 'devDependencies' since they are required for the build
RUN npm install

# Copy the rest of the app source code from the current directory to the working directory in the container
COPY . .

# Generate Prisma clients for the specified binary targets
RUN npx prisma generate


# If using TypeScript, run the build script, otherwise skip this step
RUN npm run build

# Run the postinstall script to ensure any patches are applied
RUN npm run postinstall

# Start the application
CMD [ "npm", "start" ]
