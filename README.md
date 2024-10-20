# Dobli - YouTube Translator

## Warning

This is a test project with limited functionality. To save resources, the translation process only works for the first 60 seconds of a video (from second 0 to 60). If you want to adjust this limitation, you can modify the configuration in the following file:

`src/server/controller/video-controller.ts`

Check the audioSnippetConfig object to change the time limit for processing.

## Project Setup

This project uses npm and Next.js for development. Below are the commands to set up and run the project:

1. Install Dependencies
   npm install

2. Run the Development Server
   npm run dev

3. Build the Project
   npm run build
   npm run start

## Docker Setup

1. Build the Docker Image (without cache)
   `docker-compose build --no-cache`

2. Start the Docker Container
   `docker-compose up`

3. Common Docker Commands
   Stop Docker containers:

`docker-compose down`

View running Docker containers:

`docker ps`

Remove all Docker containers:

`docker rm $(docker ps -a -q)`

## Environment Variables

Set the following environment variables for the project. You will need a GCP project with several enabled APIs and proper service account permissions.

```
GCP_SA="Service account with permissions for: Translation User, GCP SQL, Storage User, Youtube API key"
DATABASE_URL="Your database connection URL"
YOUTUBE_API_KEY="Your YouTube Data API key"
GOOGLE_PROJECT_ID="Your Google Cloud project ID"
AUDIO_SNIPPET_BUCKET="GCP bucket where you want to store the audio output"
OPENAI_API_KEY="OpenAI API key with access to Whisper model"
```

## Google Cloud Setup

### Create a Service Account

Go to the Google Cloud Console.
Navigate to IAM & Admin > Service Accounts.
Create a new service account and assign the following roles:
Translation User
Storage Object Admin (for GCP bucket access)
Cloud SQL Client (if using Cloud SQL)
YouTube Data API (for video access)
Enable Required APIs

Go to the API & Services.
Enable the following APIs for your project:
Cloud Translation API
YouTube Data API v3
Cloud Storage API
Cloud SQL API
Create a GCP Bucket

Go to Cloud Storage in the Google Cloud Console and create a bucket for storing audio snippets.
Generate API Keys

Go to API & Services > Credentials and create API keys for:
YouTube Data API v3
OpenAI Whisper model
Set these environment variables in your .env file before running the project.
