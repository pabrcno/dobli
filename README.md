# Project Title: DoBli YouTube Insight Translator

## Table of Contents

- [Context](#context)
- [Instructions](#instructions)
- [Checkpoints Overview](#checkpoints-overview)
- [Deliverable](#deliverable)
- [How We Test Your Site](#how-we-test-your-site)
- [Discussion Questions](#discussion-questions)
- [Deployment Challenges](#deployment-challenges)
- [Tech Stack Justification](#tech-stack-justification)
- [Software Architecture](#software-architecture)
- [Solutions Architecture](#solutions-architecture)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)
- [Acknowledgements](#acknowledgements)

## Context

This project is a coding challenge aimed at creating a feature-rich website capable of interacting with YouTube videos, extracting and displaying various pieces of information, and translating and synthesizing speech.

## Instructions

Participants are expected to build a website with multiple checkpoints, each adding a different feature, from displaying video details to translating and voicing text in Spanish.

## Checkpoints Overview

- **Checkpoint 1**: Display the most recent YouTube video title from a URL input.
- **Checkpoint 2**: Show video view count and most recent comment.
- **Checkpoint 3**: Play a specific audio segment from the video.
- **Checkpoint 4**: Translate audio segment into Spanish and display the translation.
- **Checkpoint 5**: Speak the translated Spanish text using text-to-speech.

## Deliverable

Participants will submit an email containing a README.md and a live URL of the built website. Additionally, a code walkthrough via screenshare will be expected during the interview.

## How We Test Your Site

The site will be tested by a non-engineer, who will check the functionality of the features against multiple YouTube URLs.

## Discussion Questions

Post-completion, a discussion will cover the project decisions, checkpoints completed, tech stack choices, handling of API keys, storage solutions, APIs used, and other relevant questions.

## Deployment Challenges

Deployment of ffmpeg on Vercel posed challenges, leading to a shift towards using a Cloud Run instance for the application.

## Tech Stack Justification

- **Next.js**: An efficient framework for building server-side rendered React applications, allowing for rapid development and deployment.
- **tRPC**: Simplifies data fetching by eliminating the need for APIs when using Next.js, providing end-to-end typesafe APIs.
- **Prisma**: An object-relational mapper (ORM) that streamlines database operations with a focus on type safety and ease of use.

## Software Architecture

- **Monorepo**: Consolidates all code in a single repository for easier management and version control.
- **Monolithic**: A single codebase for the entire application simplifies deployment and development processes.
- **Layered Architecture**: Provides a structured approach that separates concerns, such as UI, business logic, and data access.
- **Domain-Driven Design (DDD)**: Focuses on complex needs by connecting the implementation to an evolving model.

## Solutions Architecture

- **Supabase**: Provides a free tier PostgreSQL database, offering scalability and easy integration.
- **OpenAI**: Utilized for text-to-speech and speech-to-text services due to its advanced natural language processing capabilities.
- **Google Translate**: Offers reliable and accurate text translation services.
- **FFmpeg**: Used for video to audio conversion due to its powerful multimedia handling capabilities.
- **YouTube API**: For retrieval of video data, a natural choice given the requirements.
- **Cloud Storage and Cloud Run**: Offers a scalable infrastructure for storing and running the application.

## Usage

For information on how to use the website, visit the URL provided in the submission email.

## Contributing

Contributions to this project are not accepted, as it is a personal challenge submission.

## License

This project is not licensed and is intended for demonstration purposes only.

## Contact

- **Candidate**: Paulo Briceno
- **Email**: pabrcn@gmail.com
- **Reviewer**: Jon Doe - jon@unilingo.tv

## Acknowledgements

This project was completed as part of a coding challenge for Unilingo and is not intended for commercial use. Special thanks to the Unilingo team for providing this opportunity.
