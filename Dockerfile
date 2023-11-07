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

# Install system dependencies
RUN apk add --no-cache libc6-compat

# Set the working directory for the base image
WORKDIR /app

# Install dependencies only when needed
FROM base AS deps
COPY package.json  package-lock.json*  ./
RUN npm ci
# Setup the production build stage
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# If using npm comment out above and use below instead
# RUN npm run build

# Uncomment to disable Next.js telemetry
# ENV NEXT_TELEMETRY_DISABLED 1

# Create the production build of your application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy over the built assets from the builder stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set the correct permission for prerender cache
RUN mkdir -p .next/cache && chown nextjs:nodejs .next

USER nextjs

EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
